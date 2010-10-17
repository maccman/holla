%w{ 
  active_record/creator active_record/random_id 
  active_model/serialize_options 
  supermodel/creator superrpc
}.each {|lib| require lib }

SuperModel::Base.send(:include, ActiveModel::SerializeOptions::Model)
ActiveRecord::Base.send(:include, ActiveModel::SerializeOptions::Model)

# Don't require these klasses here, instead add them to 
# SuperRPC manually. Otherwise you get problms with duplicate
# observers being called (if class reloading is enabled).
SuperRPC.klasses += ["Activity", "ChannelActivity", "Asset"]