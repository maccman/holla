(function($){

$.fn.item = function(){
  var item = $(this).tmplItem().data;
  return($.isFunction(item.reload) ? item.reload() : null);
};

$.fn.forItem = function(item){
  $(this).each(function(){
    var compare = $(this).data("tmplItem");
    if (item.eql && item.eql(compare) || item === compare)
      return $(this);
  });
};

})(jQuery);