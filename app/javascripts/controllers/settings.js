(function($){
  
var Channels = Spine.Controller.create({
  tag: "li",
  
  scoped: ["render", "remove"],
  
  events: {
    "click    .destroy": "destroy",
    "dblclick .view":    "edit",
    "keypress input":    "blurOnEnter",
    "blur     input":    "close"
  },
  
  elements: {
    "input": "input"
  },
  
  init: function(){
    this.item.bind("update", this.render);
    this.item.bind("destroy", this.remove);
  },
  
  template: function(data){
    return($("#editChannelTemplate").tmpl(data));
  },
  
  render: function(){
    this.el.html(this.template(this.item));
    this.refreshElements();
    return this;
  },
  
  edit: function(){
    this.el.addClass("editing");
    this.input.focus();
  },
  
  blurOnEnter: function(e) {
    if (e.keyCode == 13) e.target.blur();
  },
  
  close: function(e){
    this.el.removeClass("editing");
    this.item.updateAttributes({name: this.input.val()});
  },
  
  remove: function(){
    this.el.remove();
  },
  
  destroy: function(){
    this.item.destroy();
  }
})

window.Settings = Spine.Controller.create({
  elements: {
    ".channels": "channelsEl",
    ".createChannel input": "input"
  },
  
  events: {
    "submit .createChannel form": "create"
  },
  
  scoped: ["addAll", "addOne"],
  
  init: function(){
    Channel.bind("refresh", this.addAll);
    Channel.bind("create", this.addOne);
  },
  
  addOne: function(e, item){
    var channel = Channels.inst({item: item || e});
    this.channelsEl.append(channel.render().el);
  },
  
  addAll: function(){
    this.channelsEl.empty();
    Channel.each(this.addOne);
  },
  
  create: function(){
    var value = this.input.val();
    if ( !value ) return false;
    Channel.create({name: value});
    this.input.val("");
    return false;
  }
});

})(jQuery);