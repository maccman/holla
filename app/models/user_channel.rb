class UserChannel < ActiveRecord::Base
  belongs_to :user
  belongs_to :channel
  
  validates_presence_of :user_id, :channel_id
  validates_uniqueness_of :channel_id, :scope => :user_id
  
  delegate :name, :to => :channel
end
