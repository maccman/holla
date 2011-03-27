(function($){

$.fn.item = function(){
  var item = $(this).tmplItem().data;
  return($.isFunction(item.reload) ? item.reload() : null);
};

})(jQuery);