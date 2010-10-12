(function($){
  
$.fn.startEditable = function(e){  
  var element = $(this);
  var oldHTML = element.html();
  
  if ( element.hasClass("editable") ) return;
  element.addClass("editable");
  
  var input = $("<input type='text' />");
  input.addClass("editable");
  input.val(element.text());
  
  input.bind("change", function(){    
    element.trigger("edited", input.val());
  });
  
  input.bind("blur", function(){
    input.remove();
    element.html(oldHTML);
    element.removeClass("editable");
  });
  
  element.empty();
  element.append(input);
  input.select();
  
  return this;
}
  
$.fn.editable = function(){
  this.click(function(e){
    e.preventDefault();
    $(this).startEditable();
  });
  return this;
};
  
})(jQuery);