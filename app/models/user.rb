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
  
  has_attached_file :avatar, 
                    :styles => { 
                      :thumb => ["48x48#", :png]
                    },
                    :storage => :happening,
                    :s3_credentials => {
                      :access_key_id => AppConfig.aws[:access_key_id], 
                      :secret_access_key => AppConfig.aws[:secret_access_key]
                    },
                    :default_url => "/images/missing.png",
                    :path    => ":attachment/:id/:style.:extension",
                    :bucket  => AppConfig.aws[:bucket],
                    :whiny   => true
  
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
  
  def serializable_hash(options = nil)
    options ||= {}
    options[:only] ||= []
    options[:only] += [
      :first_name, 
      :last_name,
      :email,
      :id
    ]
    super(options)
  end
end