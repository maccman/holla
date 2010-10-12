class Roster < SuperModel::Base
  include SuperModel::Redis::Model
  include SuperModel::Timestamp::Model

  attributes :count
  serialize  :count

  belongs_to :user
  validates_presence_of   :user_id
  
  indexes :user_id  
  
  class << self
    def for_user(user)
      user_ids = user.channels.user_ids
      user_ids.map {|id| find_by_user_id(id) }.compact
    end
    
    def subscribe
      Juggernaut.subscribe do |event, data|
        data.default = {}
        user_id = data["meta"]["user_id"]
        next unless user_id
                
        case event
        when :subscribe
          event_subscribe(user_id)
        when :unsubscribe
          event_unsubscribe(user_id)
        end
      end
    end
    
    protected
      def event_subscribe(user_id)
        user = find_by_user_id(user_id) || self.new(:user_id => user_id)
        user.increment!
      end
      
      def event_unsubscribe(user_id)
        user = find_by_user_id(user_id)
        user && user.decrement!
      end
  end
  
  def count
    read_attribute(:count) || 0
  end
  
  def increment!
    self.count += 1
    save!
  end
  
  def decrement!
    self.count -= 1
    self.count > 0 ? save! : destroy
  end
  
  def observer_clients
    user.channels.user_ids
  end
  
  delegate :name, :to => :user, :prefix => true
  
  def serializable_hash(options = nil)
    options ||= {}
    options[:methods] = :user_name
    super(options)
  end
end