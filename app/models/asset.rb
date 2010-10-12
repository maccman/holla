require "paperclip/storage/happening"

class Asset < ActiveRecord::Base  
  include ActiveRecord::Creator
  include ActiveRecord::RandomID
  include SuperRPC::Model

  alias_attribute :size, :data_file_size
  alias_attribute :name, :data_file_name
  
  validates_presence_of :data_file_name
  validates_length_of   :data_file_size, :in => 0..100.megabytes
  
  attr_accessible :id, :name, :size, :data
  
  has_attached_file :data, 
                    :storage => :happening,
                    :s3_credentials => {
                      :access_key_id => AppConfig.aws[:access_key_id], 
                      :secret_access_key => AppConfig.aws[:secret_access_key]
                    },
                    :s3_permissions => "private",
                    :s3_headers => { :content_disposition => "attachment" },
                    :path   => ":attachment/:id/:style.:extension",
                    :bucket => AppConfig.aws[:bucket],
                    :whiny  => true

  before_data_post_process Proc.new {|d| d.uploaded = true }
                    
  has_attached_file :preview, 
                    :storage => :happening,
                    :s3_credentials => {
                      :access_key_id => AppConfig.aws[:access_key_id], 
                      :secret_access_key => AppConfig.aws[:secret_access_key]
                    },
                    :s3_permissions => "private",
                    :path   => ":attachment/:id/:style.:extension",
                    :bucket => AppConfig.aws[:bucket],
                    :whiny  => true
end