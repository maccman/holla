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

$.fn.autolink = function () {
	return this.each( function(){
		var re = /((http|https|ftp):\/\/[\w?=&.\/-;#~%-]+(?![\w\s?&.\/;#~%"=-]*>))/g;
		$(this).html( $(this).html().replace(re, '<a href="$1">$1</a> ') );
	});
};

$.fn.mailto = function () {
	return this.each( function() {
		var re = /(([a-z0-9*._+]){1,}\@(([a-z0-9]+[-]?){1,}[a-z0-9]+\.){1,}([a-z]{2,4}|museum)(?![\w\s?&.\/;#~%"=-]*>))/g
		$(this).html( $(this).html().replace( re, '<a href="mailto:$1">$1</a>' ) );
	});
};

})(jQuery);