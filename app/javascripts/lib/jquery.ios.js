//= require <jquery>

(function($){
  $.support.touch = (typeof Touch != "undefined");
    
  var TouchDrag = function(element){
    if ( !$.support.touch ) return;
    this.element = $(element);
    this.element.bind("touchstart", this.proxy(this.touchStart));
    this.element.bind("touchmove",  this.proxy(this.touchMove));
    this.element.bind("touchend",   this.proxy(this.touchEnd));
  };
  
  // Class helper functions
  TouchDrag.fn = TouchDrag.prototype;
  TouchDrag.fn.proxy = function(func){
    var thisObject = this;
    return(function(){ 
      return func.apply(thisObject, arguments); 
    });
  };
  
  TouchDrag.fn.simulateEvent = function(type, e){
    var simulatedEvent = document.createEvent("MouseEvent");
        
		simulatedEvent.initMouseEvent(
		  type, true, true, window, 1, 
		  e.screenX, e.screenY, e.clientX, e.clientY, 
		  false, false, false, false, 0 /*left*/, null
		);
															 
		e.target.dispatchEvent(simulatedEvent);
  };
  
  TouchDrag.fn.touchStart = function(e){
    this.dragging = false;
    e = e.originalEvent;
    e.preventDefault();
    this.simulateEvent("mousedown", e.changedTouches[0]);
  };
  
  TouchDrag.fn.touchMove = function(e){
    this.dragging = true;
    e = e.originalEvent;
    
    // If two finger touch
    if (e.touches.length == 2) {
      e.preventDefault();
      this.simulateEvent("mousemove", e.changedTouches[0]);
    }
  };
  
  TouchDrag.fn.touchEnd  = function(e){
    e = e.originalEvent;
    e.preventDefault();
    this.simulateEvent("mouseup", e.changedTouches[0]);
    
    if ( !this.dragging )
      this.simulateEvent("click", e.changedTouches[0]);
  };
    
  $.fn.touchDrag = function(){
    new TouchDrag(this);
    return this;
  }
})(jQuery);