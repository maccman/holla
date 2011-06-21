Rails.application.config.middleware.use OmniAuth::Builder do  
  provider :twitter, 'imkhJ6VxilZIA7AO36XpHg', 'FsFr1yuVI7RMp9O7v97j8dHkwSfFKeLMcgK74hyys', :sign_in => true
end

# use OmniAuth::Strategies::LDAP, :host => '10.101.10.1', :port => 389, :method => :plain, :base => 'dc=intridea, dc=com', :uid => 'sAMAccountName'
