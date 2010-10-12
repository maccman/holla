//= require <supermodel>
//= require <superrpc>

var ChannelActivity = SuperModel.setup("ChannelActivity");

ChannelActivity.attributes = ["klass", "klass_id", 
                              "data", "type", 
                              "channel_id", 
                              "creator_name"];

ChannelActivity.extend(SuperModel.Timestamp);
ChannelActivity.extend(SuperModel.AddCreator);
ChannelActivity.include(SuperModel.GUID);

ChannelActivity.include({
  channel: function(){
    return(this.channel_id && Channel.find(this.channel_id));
  }  
});