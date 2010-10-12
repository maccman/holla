# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rake db:seed (or created alongside the db with db:setup).

User.transaction do 

  user = User.create!({
    :first_name => "Alex",
    :last_name  => "MacCaw",
    :email      => "maccman@gmail.com",
    :password   => "xhtml",
    :password_confirmation => "xhtml"
  })
  
  channel = Channel.create!(:name => "Main")
  user.channels << channel
  
end