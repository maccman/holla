class Channel < ActiveRecord::Base
  include ActiveRecord::RandomID
  include ActiveRecord::Creator
  include SuperRPC::Model
  
  has_many :user_channels, :dependent => :destroy
  has_many :users, :through => :user_channels
  
  after_create :set_user_channels
  
  attr_accessible :id, :name
  
  validates_presence_of :name
  
  def channel_activity
    ChannelActivity.for_channel(self)
  end
  
  def messages
    Message.for_channel(self)
  end
  
  def observer_clients
    user_ids
  end
  
  def editable_by?(user)
    self.creator == user
  end
  
  protected
    def set_user_channels
      return unless creator
      creator.channels << self
    end
end