Rails.application.config.middleware.use OmniAuth::Builder do  
  provider :twitter, 'imkhJ6VxilZIA7AO36XpHg', 'FsFr1yuVI7RMp9O7v97j8dHkwSfFKeLMcgK74hyys', :sign_in => true
end