(function($){
  
$.fn.startEditable = function(options){  
  if ( !options ) options = {};
  
  var element = $(this);
  var oldHTML = element.html();
  
  if ( element.hasClass("editable") ) return;
  element.addClass("editable");
  
  var input;
  
  if (options.textarea)
    input = $("<textarea />");
  else
    input = $("<input type='text' />");

  input.addClass("editable");
  input.val(element.text());
  
  element.bind("finish.edit", function(){
    input.trigger("finish.edit");
  });
  
  input.bind("change blur finish.edit", function(){
    var result = input.val();

    input.remove();
    element.html(oldHTML);
    element.removeClass("editable");
    
    element.trigger("value.edit", result);
  });
  
  input.bind("keydown", function(e){
    var enter  = (e.which == 13 && (!options.textarea || (e.metaKey || e.altKey)));
    var escape = (e.which == 27);
    
    if (enter || escape)
      input.trigger("finish.edit");
  });
  
  element.empty();
  element.append(input);
  input.select();
  
  return this;
}
  
$.fn.editable = function(options){
  this.attr("title", "Click to edit");
  
  this.bind("click start.edit", function(e){
    e.preventDefault();
    $(this).startEditable(options);
  });
  return this;
};
  
})(jQuery);