(function($){

window.Messages = Spine.Controller.create({
  elements: {
    ".items": "items",
    ".new textarea": "input"
  },
  
  events: {
    "click .new button": "create",
    "keydown .new textarea": "checkCreate",
  },
  
  scoped: ["changeChannel", "addOne"],
  
  handle: $("meta[name=handle]").attr("content"),
  
  template: function(data){
    return $("#messageTemplate").tmpl(data);
  },
  
  init: function(){
    Message.bind("create", this.addOne);
  },
  
  render: function(){
    this.items.html(this.template(this.getItems()));
    this.scrollToBottom();
    this.focus();
  },
  
  create: function(){
    if (!this.channel)
      throw "Channel required";
      
    var value = this.input.val();
    if ( !value ) return false;
    
    Message.create({
      name:       this.handle,
      channel_id: this.channel.id, 
      body: value
    });
    
    this.input.val("");
    this.input.focus();
    return false;
  },
  
  changeChannel: function(channel){
    this.channel = channel;
    this.render();
    this.active();
  },
  
  focus: function(){
    this.input.focus()
  },
  
  // Private
  
  checkCreate: function(e){
    if (e.which == 13 && !e.shiftKey) {
      this.create();
      return false;
    }
  },
  
  isScrolledToBottom: function(){
    var scrollBottom  = this.items.attr("scrollHeight") -
                        this.items.scrollTop() - 
                        this.items.outerHeight();
    return scrollBottom == 0;
  },
  
  scrollToBottom: function(){
    this.items.scrollTop(
      this.items.attr("scrollHeight")
    );
  },
  
  addOne: function(e, item){
    item = item || e;
    
    // Message for a different channel
    if ( !item.channel().eql(this.channel) )
      return;
      
    var shouldScroll = this.isScrolledToBottom();

    this.items.append(this.template(item));
    
    if (shouldScroll) 
      this.scrollToBottom();
      
    $.playAudio("/audio/new.mp3");
  },
  
  getItems: function(){
    if ( !this.channel ) return [];
    return this.channel.messages();
  }
});

})(jQuery);