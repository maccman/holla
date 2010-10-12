//= require <jquery.tooltip>

(function($){
  
var state = App.state.add("intro");

state.setup(function(){  
  this.create.submit(this.proxy(function(e){
    e.preventDefault();
    
    if (this.input.val() == "") return;
    
    var channel = new Channel;
    channel.name = this.input.val();
    channel.save();
    channel.createRemote();
    
    this.input.val("");
    
    App.state.change("channel", channel);
  }));
  
  this.view.find(".area").tooltip();
});

state.hasView = true;

})(jQuery);