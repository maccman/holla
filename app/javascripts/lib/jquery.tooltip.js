(function($){
  
  var showTip = function(e){
    var element = $(this);
    var val = element.attr("data-title");
    
    var tip = $("<div />").addClass("tip")
    tip.text(val);
      
    var position = element.position();
    
    if (element.attr("data-position") == "left") {
      position.left -= element.width() + 10;      
    } else {    
      position.left += element.width() + 10;
    }
    
    position.top  += 20;    
    
    tip.css({
      position: "absolute",
      left: position.left,
      top:  position.top,
      zIndex: 1000
    });
    
    element.after(tip);
            
    element.bind("mouseout", function(){
      tip.fadeOut(300, function(){ tip.remove(); });
    });
  };
  
  $.fn.tooltip = function(){
    $(this).bind("mouseover", showTip);
  };
  
})(jQuery);