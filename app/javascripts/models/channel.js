var Channel = SuperModel.setup("Channel");
Channel.attributes = ["name"];

Channel.include(SuperModel.GUID);

Channel.include({
  getLink: function(){
    return(Rails.app_site + "/connect/" + this.id);
  },
    
  connect: function(){
    jQuery.post("/settings/" + this.id + "/connect");
  },
  
  disconnect: function(){
    jQuery.post("/settings/" + this.id + "/disconnect");
    this.destroy();
  }
});