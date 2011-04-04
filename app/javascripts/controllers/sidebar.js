(function($){

window.Sidebar = Spine.Controller.create({
  events: {
    "click [data-name]": "click"
  },
  
  elements: {
    "#channels": "channels"
  },
  
  scoped: ["change", "render"],
  
  template: function(item){
    return $("#channelsTemplate").tmpl(item);
  },
  
  init: function(){
    Channel.bind("refresh change", this.render);
    this.App.bind("change", this.change);
  },
  
  render: function(){
    var items    = Channel.all();
    this.channels.html(this.template(items));
    
    // Select first channel
    if ( !this.current )
      this.$("[data-name=channels]:first").click();
  },
  
  change: function(type, item){
    this.App.trigger("change:" + type, item);

    this.deactivate();
    var elements = this.$("[data-name=" + type + "]");    
    this.current = (item && elements.forItem(item)) || elements;
    this.current.addClass("current");    
  },
  
  click: function(e){
    var element = $(e.target);
    var type = element.attr("data-name");
    var item = element.item();
    this.App.trigger("change", type, item);
  },
  
  deactivate: function(){
    this.$("[data-name]").removeClass("current");    
  }  
});

})(jQuery);