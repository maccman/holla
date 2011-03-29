(function($){

window.Searches = Spine.Controller.create({  
  events: {
    "click li": "click"
  },
  
  scoped: ["render", "query", "checkActive"],
  
  template: function(data){
    return $("#searchTemplate").tmpl(data);
  },
  
  init: function(){
    this.input = $("#sidebar input[type=search]");
    this.input.keyup(this.query);
    this.model = Search.inst();
    this.model.bind("change", this.render);
  },
  
  render: function(){
    this.el.html(this.template(this.model.results));
  },
  
  query: function(){
    this.model.query(this.input.val());
    this.active();
  },
    
  click: function(e){
    var message = $(e.target).item();
    this.trigger("openChannel", message.channel());
  }
});

})(jQuery);