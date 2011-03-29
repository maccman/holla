(function($){
  
window.MessagesItem = Spine.Controller.create({
  tag: "li",
  
  scoped: ["render", "remove"],
  
  template: function(data){
    return $("#messageTemplate").tmpl(data);
  },
  
  init: function(){
    this.item.bind("update", this.render);
    this.item.bind("destroy", this.remove);
  },
  
  render: function(e, item){
    if (item) this.item = item;
    var elements = this.template(this.item);
    this.el.replaceWith(elements);
    this.el = elements;
    this.el.autolink();
    this.el.mailto();
    return this;
  },
  
  remove: function(){
    this.el.remove();
  }
})

window.Messages = Spine.Controller.create({
  elements: {
    ".items": "items",
    ".new textarea": "input"
  },
  
  events: {
    "click .new button": "create",
    "keydown .new textarea": "checkCreate",
  },
  
  scoped: ["changeChannel", "addNew", "addOne"],
  
  handle: $("meta[name=handle]").attr("content"),
  
  init: function(){
    Message.bind("create", this.addNew);
  },
  
  render: function(){
    this.addAll();
    this.delay(function(){
     this.scrollToBottom();
     this.focus();
    });
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
  
  scroll: function(callback){
    var shouldScroll = this.isScrolledToBottom();
    callback.apply(this);
    if (shouldScroll) 
      this.scrollToBottom();
  },
  
  addOne: function(item, audio){    
    // Message for a different channel
    if ( !item.forChannel(this.channel) )
      return;

    var msgItem = MessagesItem.inst({item: item});
    this.items.append(msgItem.render().el);
    
    if (audio) $.playAudio("/audio/new.mp3");
  },
  
  addAll: function(){
    Message.each(this.addOne);
  },
  
  addNew: function(e, item){
    this.scroll(function(){
      this.addOne(item, true);
    });
  },
  
  getItems: function(){
    if ( !this.channel ) return [];
    return this.channel.messages();
  }
});

})(jQuery);