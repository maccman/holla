class Channel < ActiveRecord::Base
  has_many :messages
  
  include ActiveRecord::GUID
  
  attr_accessible :id, :name
end
