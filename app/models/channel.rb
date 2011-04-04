class Channel < ActiveRecord::Base
  has_many :messages, :dependent => :destroy
  
  include ActiveRecord::GUID
  
  attr_accessible :id, :name
end