(function($){

window.Settings = Spine.Controller.create({
  newChannel: function(){
    var channelName = prompt("Channel name?");
    if ( !channelName ) return;
    var channel = Channel.create({name: channelName});
    this.channels.changeCurrent(channel, true);
  }
})

})(jQuery);