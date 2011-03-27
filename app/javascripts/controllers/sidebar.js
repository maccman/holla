(function($){

window.Sidebar = Spine.Controller.create({
  events: {
    "click [data-name]": "change"
  },
  
  elements: {
    "#channels": "channels"
  },
  
  scoped: ["render"],
  
  init: function(){
    Channel.bind("refresh change", this.render);
  },
  
  render: function(){
    var items    = Channel.all();
    var elements = $("#channelsTemplate").tmpl(items);
    this.channels.html(elements);
    
    // Select first channel
    if ( !this.current )
      this.$("[data-name=channels]:first").click();
  },
  
  change: function(e){
    this.deactivate();
    this.current = $(e.target);
    this.current.addClass("current");
    
    var type = this.current.attr("data-name");
    var item = this.current.item();    
    this.trigger("change", type, item);
  },
  
  deactivate: function(){
    this.$("[data-name]").removeClass("current");    
  }
})

})(jQuery);