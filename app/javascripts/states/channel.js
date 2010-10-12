//= require <jquery.animation>

(function($){

var state = App.state.add("channel")

state.setup(function(){ 
  this.share.submit(this.proxy(function(e){
    e.preventDefault();
    
    var value = this.input.val();
    if (value == "") return;
    
    var ca = new ChannelActivity;
    
    if (value.match(/\r|\n/))
      ca.klass = "Paste"
    else
      ca.klass = "Message";
    
    ca.type       = "create";
    ca.channel_id = this.current.id;
    ca.data = {body: value};
    ca.save();
    
    ca.createRemote();
    
    this.input.val("");
    this.input.select();
  }));
  
  this.input.keydown(function(e){
    if (e.which == 13 && !e.shiftKey) {
      $(this).parents("form").submit();
      return false;
    }
  });  
});
  
state.beforeEnter(function(channel){
  if ( !channel ) throw "Null Channel";
  this.current = channel;
  
  this.delay(function(){ 
    this.input.select(); 
  });
});

state.hasView = true;

})(jQuery);

//= require <states/channel.asset>
//= require <states/channel.activity>
//= require <states/channel.roster>