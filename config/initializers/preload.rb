%w{ 
  activerecord/creator activerecord/random_id 
  supermodel/creator superrpc
}.each {|lib| require lib }

# Don't require these klasses here, instead add them to 
# SuperRPC manually. Otherwise you get problms with duplicate
# observers being called (if class reloading is enabled).
SuperRPC.klasses += ["Activity", "ChannelActivity", "Asset"]