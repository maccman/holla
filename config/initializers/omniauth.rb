Rails.application.config.middleware.use OmniAuth::Builder do  
  require "openid/store/filesystem"

  provider :openid, OpenID::Store::Filesystem.new("./tmp"), :name => "google", :identifier => "https://www.google.com/accounts/o8/id"
  provider :openid, OpenID::Store::Filesystem.new("./tmp"), :name => "myopenid", :identifier => "myopenid.com"
  provider :openid, OpenID::Store::Filesystem.new("./tmp"), :name => "yahoo", :identifier => "yahoo.com"
  
  provider :twitter, 'imkhJ6VxilZIA7AO36XpHg', 'FsFr1yuVI7RMp9O7v97j8dHkwSfFKeLMcgK74hyys', :sign_in => true

end
