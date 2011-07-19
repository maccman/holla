class Message < ActiveRecord::Base
  belongs_to :channel
  
  validates_presence_of :body, :channel_id
  
  attr_accessible :id, :body, :name, :channel_id
  
end
