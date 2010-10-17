(function($){ 
  
  var state = App.state.find("channel");
  state.load(function(){
    this.rconnector = this.roster.connect(Roster);
    
    this.rconnector.onCreate = $.proxy(function(item){
      if ( !this.filter(item) ) return;
      var elements = this.renderTemplate(item);
      this.element.append(elements);
      
      $(elements).effect("drop", {direction: "down", mode: "show", distance: 200}, 1000);
    }, this.rconnector);
    
    this.rconnector.onDestroy = $.proxy(function(item){      
      if ( !this.filter(item) ) return;
      
      var element = this.findItem(item.id);
      
      $(element).effect("drop", {direction: "down", distance: 200}, 4000);
    }, this.rconnector);
    
    this.rconnector.builder = function(element, item){
      element.find(".avatar img").attr({
        title: item.user_name
      }).replaceImageWhenLoaded(
        "/users/" + item.user_id + "/avatar"
      );
    }
  });
  
})(jQuery);