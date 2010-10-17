//= require <superapp>
//= require <superevent>

if (typeof jQuery.support.CSSAnimation == "undefined")
  jQuery.support.CSSAnimation = (typeof WebKitTransitionEvent != "undefined");
  
SuperApp.View = new SuperClass();
SuperApp.View.include(SuperEvent);

SuperApp.View.include({
  init: function(element){
    this.element    = jQuery(element);
    this.animations = jQuery.support.CSSAnimation;
    this.current    = null;
  },
  
  find: function(name){
    return this.element.find("> [data-view='" + name + "']:first");
  },
  
  findAnimation: function(fview, tview) { },    
  
  equal: function(fview, tview){
    return(fview[0] == tview[0]);
  },
  
  callback: function(fromView, toView, animation){
    if (animation){
      toView.removeClass("in " + animation);
      if(fromView) fromView.removeClass("current out " + animation);
    } else {
      if(fromView) fromView.removeClass("current");
    }
  },
  
  change: function(name){
    var fromView = this.current;
    var toView   = this.find(name);
    
    if (fromView && this.equal(fromView, toView)) return;
        
    var animation;
    if ( this.animations ) 
  		animation = this.findAnimation(fromView, toView);
  			
    if (animation){
      var self = this;
      var callback = function(){
        self.callback(fromView, toView, animation);
      };
      toView.one("webkitAnimationEnd", callback);
      toView.addClass(animation + " in current");
      if (fromView) fromView.addClass(animation + " out");
    } else {
      toView.addClass("current");
      this.callback(fromView, toView);
    }
    
    this.current = toView;
    this.trigger("change");
  }
});

if (typeof SuperApp != "undefined") {
  
  var oldStateInit = SuperApp.State.fn.init;
  
  SuperApp.State.include({
    init: function(){
      jQuery(this.proxy(this.loadView));
      oldStateInit.apply(this, arguments);
    },
    
    loadView: function(){
      if ( !this.hasView ) return;
      this.view = this.app.view.find(this.name);
      this.view.find("[data-name]").each(this.proxy(function(i, item){
        // We're re-selecting the element, so jQuery has
        // a proper selector attribute, useful for live events
        var name     = jQuery(item).attr("data-name");
        var selector = this.view.find("[data-name='" + name + "']");
        this[name]   = selector;
      }));
    }
  });
  
  var oldInit = SuperApp.fn.init;
  
  SuperApp.include({
    init: function(){
      this.on("change", this.proxy(this.changeView));
      oldInit.apply(this, arguments);
    },
    
    changeView: function(){
      if ( !this.current || !this.current.hasView ) return;
      if ( !this.view ) throw "View not connected";
      this.view.change(this.current.name);
    }
  });
}