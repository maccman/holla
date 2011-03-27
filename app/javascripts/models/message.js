var Message = exports = Spine.Model.setup("Message", ["body", "name", "channel_id"]);

Message.extend(Spine.Model.Ajax);

Message.include({
  url: "/messages",
  
  validate: function(){
    if ( !this.channel_id )
      return "channel_id required";
  },
  
  channel: function(){
    return Channel.find(this.channel_id);
  },
  
  isPaste: function(){
    return this.body.match(/\r|\n/);
  }
});

//= require <models/search>
Message.extend(Search.Model);
Message.search_attributes = ["body"];