class Activity < SuperModel::Base
  include SuperModel::Redis::Model
  include SuperModel::Timestamp::Model
  include SuperRPC::Model
  include SuperModel::RandomID
  
  class << self
    def for_user(user)
      find_all_by_user_id(user.id)
    end
  end
  
  attributes :klass, 
             :klass_id, 
             :data, 
             :type, 
             :level,
             :seen
  
  include SuperModel::Creator
  belongs_to :user
  
  indexes :user_id
  
  validates_presence_of :klass, :user_id, :creator_id
  
  def editable_by?(user)
    self.user == user
  end
end