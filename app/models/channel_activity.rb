class ChannelActivity < SuperModel::Base
  include SuperModel::Redis::Model
  include SuperModel::Timestamp::Model
  include SuperRPC::Model
  include SuperModel::Creator
  include SuperModel::RandomID
  
  attributes :klass, 
             :klass_id, 
             :data, 
             :type,
             :creator_name

  belongs_to :channel
  
  validates_presence_of :klass, :channel_id, :creator_id
  
  before_create :set_creator_name
  
  indexes :channel_id
  
  class << self
    def for_channel(channel)
      find_all_by_channel_id(channel.id)
    end
  end
  
  def observer_clients
    channel.user_ids
  end
  
  def editable_by?(user)
    self.creator == user
  end
  
  def set_creator_name
    self.creator_name = creator && creator.name
  end  
end