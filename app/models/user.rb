class User < ActiveRecord::Base
  include ActiveRecord::RandomID
    
  has_many :user_channels, :dependent => :destroy
  has_many :channels, :through => :user_channels do
    def user_ids
      map(&:user_ids).flatten
    end
    
    def channel_activity
      map(&:channel_activity).flatten
    end
  end
  
  validates_presence_of :email
  
  attr_accessible :first_name, :last_name, :email, 
                  :password, :password_confirmation, :avatar
  
  acts_as_authentic
  
  def channel_activity
    channels.channel_activity
  end
  
  def activity
    Activity.for_user(self)
  end
  
  def roster
    Roster.for_user(self)
  end
  
  def name
    return email unless first_name?
    [first_name, last_name].join(" ")
  end
  
  def gravatar_url
    "http://gravatar.com/avatar/" + 
    "#{Digest::MD5.new.update(email.downcase)}"
  end
  
  serialize_options do
    only :id, :email
    only :first_name, :last_name
    methods :name
  end
end