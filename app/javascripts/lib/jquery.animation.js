//= require <jquery>

(function($){
  
var rupper = /([A-Z])/g; 

// ----------
// Function: stopCssAnimation
// Stops an animation in its tracks!
$.fn.stopCSSAnimation = function(){   
  this.each(function(){
    // When you remove the CSS Transition properties
    // it doesn't just end the animation where it was,
    // instead it jumps the animation to the end state.
    // Thus, to stop an animation, you first have to get
    // its current computed values, remove the transition
    // properties, and then finally set the elements
    // values appropriatly.
    
    // Get the computed values of the animated properties
    var $el = $(this);
    var props = $el.data("cssAnimatedProps");
    var cStyle = window.getComputedStyle(this, null);
    var cssValues = {};     
    for(var prop in props){
      prop = prop.replace( rupper, "-$1" ).toLowerCase();
      cssValues[prop] = cStyle.getPropertyValue(prop);
    }
    
    // Remove the CSS Transition CSS
    $el.css({
      '-moz-transition-property': 'none',  
      '-moz-transition-duration': '',  
      '-moz-transition-timing-function': '',
      '-webkit-transition-property': 'none',  
      '-webkit-transition-duration': '',  
      '-webkit-transition-timing-function': ''    
    });
    
    // Set the saved computed properties
    for( var prop in cssValues ){
      $el.css(prop, cssValues[prop]);
    }
    
    // Cancel any onComplete function
    $el.data("cssAnimatedProps", null);
    var timeoutId = $el.data("cssTimeoutId");
    if( timeoutId != null ) {
      clearTimeout(timeoutId);
      $el.data("cssTimeoutId", null);
    }
  });
};

// ----------
// Function: animateWithCSS
// Uses CSS transitions to animate the element. 
// 
// Parameters: 
//   Takes the same properties as jQuery's animate function.
//
//   The only difference is that the easing paramater can now be:
//   bounce, swing, linear, ease-in, ease-out, cubic-bezier, or
//   manually defined as cubic-bezier(x1,y1,x2,y2);
$.fn.animateWithCSS = function(props, speed, easing, callback) {
  var optall = jQuery.speed(speed, easing, callback);  
  
	if ( jQuery.isEmptyObject( props ) ) {
		return this.each( optall.complete );
	}
  
  var easings = {
    bounce: 'cubic-bezier(0.0, 0.35, .5, 1.3)', 
    linear: 'linear',
    swing: 'ease-in-out',
  };
  
  optall.easing = optall.easing || "swing";
  optall.easing = easings[optall.easing] ? easings[optall.easing] : optall.easing;
  
  // The latest versions of Firefox do not animate from a non-explicitly set
  // css properties. So for each element to be animated, go through and
  // explicitly define 'em.
  this.each(function(){
    $(this).data("cssAnimatedProps", props);
    var cStyle = window.getComputedStyle(this, null);      
    for(var prop in props){
      prop = prop.replace( rupper, "-$1" ).toLowerCase();
      $(this).css(prop, cStyle.getPropertyValue(prop));
    }    
  });
  
  this.css({
    '-moz-transition-property': 'all', // TODO: just animate the properties we're changing  
    '-moz-transition-duration': optall.duration + 'ms',  
    '-moz-transition-timing-function': optall.easing,
    '-webkit-transition-property': 'all', // TODO: just animate the properties we're changing  
    '-webkit-transition-duration': optall.duration + 'ms',  
    '-webkit-transition-timing-function': optall.easing,
  });
  
  this.css(props);

  var self = this;
  var timeoutId = setTimeout(function() {    
    self.css({
      '-moz-transition-property': 'none',  
      '-moz-transition-duration': '',  
      '-moz-transition-timing-function': '',
      '-webkit-transition-property': 'none',  
      '-webkit-transition-duration': '',  
      '-webkit-transition-timing-function': ''
    });
    
    self.data("cssAnimatedProps", null); 
    self.data("cssTimeoutId", null);        

    if(jQuery.isFunction(optall.complete))
      optall.complete.apply(self);
  }, optall.duration);
  this.data( "cssTimeoutId", timeoutId );
  
  
  return this;
};

$.fn.fadeOutWithCSS = function(){
  $(this).animateWithCSS({opacity:0}, 300, "linear", function(){
    $(this).hide();
  });
  return this;
};

$.fn.fadeInWithCSS = function(){
  $(this).animateWithCSS({opacity:1, display: "block"}, 300);  
  return this;
};

})(jQuery);