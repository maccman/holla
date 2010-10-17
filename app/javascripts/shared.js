//= require <jquery>
//= require <jquery.md5>

(function($){
  $.findArray = function(array, iterator){
    for(var i in array)
      if (iterator.call(iterator, array[i]))
        return array[i];      
  };
  
  $.truncate = function(str, length, truncation) {
    length     = length || 30;
    truncation = truncation || "...";
    return str.length > length ?
      str.slice(0, length - truncation.length) + truncation : String(str);
  };
  
  $.isBlank = function(obj){
    // if false/nil
    if ( !obj ) 
      return true;
    
    // if array
    if (typeof obj.length == "number")
      return(obj.length == 0);
    
    // if hash/object
    var i = 0;
    for (var k in obj) i ++;
    return(i == 0);
  };
  
  $.camelize = function(str){
    var result = str;
    result = result.replace(/_+(.)?/g, function(match, chr) {
      return chr ? chr.toUpperCase() : '';
    });
    result = result.replace(/(^.)?/, function(match, chr) {
      return chr ? chr.toUpperCase() : '';
    });  
    return result;
  };

  $.singularize = function(str){
    return(str.replace(/s$/, ''));
  };

  $.classify = function(str){
    var result = this.singularize(str);
    return this.camelize(result);
  };

  $.constantize =  function(str){
    return(eval(str.valueOf()));
  };
  
  $.confirm = function(html, callback){
    var confirm = $("<div></div>")
  		.html(html)
  		.dialog({
  			modal:    true,
  			width:    330,
  			resizable: false,
  			closeOnEscape: false,
  			title: "Confirm",
  			buttons: {
  			  "Yes": function(){
  			    $(this).dialog("close");
  			    if (callback) callback();
  			  },
  			  Cancel: function(){
  			    $(this).dialog("close");
  			  }
  			}
  		});
  	return confirm;
  };
  
  $.fn.autolink = function () {
  	return this.each( function(){
  		var re = /((http|https|ftp):\/\/[\w?=&.\/-;#~%-]+(?![\w\s?&.\/;#~%"=-]*>))/g;
  		$(this).html( $(this).html().replace(re, '<a target="_blank" href="$1">$1</a> ') );
  	});
  };

  $.fn.mailto = function () {
  	return this.each( function() {
  		var re = /(([a-z0-9*._+]){1,}\@(([a-z0-9]+[-]?){1,}[a-z0-9]+\.){1,}([a-z]{2,4}|museum)(?![\w\s?&.\/;#~%"=-]*>))/g
  		$(this).html( $(this).html().replace( re, '<a href="mailto:$1">$1</a>' ) );
  	});
  };
  
  $.fn.reload = function(){
    if (!this.selector) throw "No selector";
    return $(this.selector);
  };
  
  $.fn.replaceImageWhenLoaded = function(src){
    var self = $(this);
    var newImage = new Image();
    newImage.src = src;
    var replaceSrc = function(){
      self.fadeOut(200, function(){
        self.attr({src:newImage.src});
        self.fadeIn();              
      });
    };
    if( !newImage.complete ){
      newImage.onload = replaceSrc;
    } else {
      self.attr({src:newImage.src});
    }
  };
  
  $.fn.toggleDisplay = function(bool){
    if ( typeof bool == "undefined" ) {
      bool = !$(this).filter(":first:visible")[0];
    }
    return $(this)[bool ? "show" : "hide"]();
  };
  
  $.fn.fadeOutCustom = function(duration, callback){
    return($(this).animate({opacity:0}, duration, "linear", callback));
  };
  
  $.fn.fadeInCustom = function(duration, callback){
    return($(this).animate({opacity:1}, duration, "linear", callback));
  };
      
	SuperModel.GUID = {
    generateID: function(){
      return(jQuery.md5(
        App.user_id + 
        (new Date).getTime() + 
        Math.random().toFixed(4)
      ).slice(0, 26));
    }
  };
  
  SuperModel.AddCreator = {
    extended: function(base){
      base.attributes.push("creator_id");
      
      base.on("beforeCreate", function(record){
        if ( !record.creator_id ) 
          record.creator_id = App.user_id;
      });
      
      base.include({
        creator: function(){
          return User.exists(this.creator_id);
        }
      });
    }
  };
  
  SuperModel.Timestamp = {
    extended: function(base){
      base.attributes.push("created_at");
      base.attributes.push("updated_at");
      
      base.on("beforeSave", function(item){
        var date = (new Date).toISOString();
        if ( !item.created_at ) item.created_at = date;
        if ( !item.updated_at)  item.updated_at = date;
      });
    }
  };
  
  // Seems only Chrome supports ISO 8601 parsing
  Date.parseISOString = function (string) {
    var regexp = "([0-9]{4})(-([0-9]{2})(-([0-9]{2})" +
        "(T([0-9]{2}):([0-9]{2})(:([0-9]{2})(\.([0-9]+))?)?" +
        "(Z|(([-+])([0-9]{2}):([0-9]{2})))?)?)?)?";
    var d = string.match(new RegExp(regexp));

    var offset = 0;
    var date = new Date(d[1], 0, 1);

    if (d[3]) { date.setMonth(d[3] - 1); }
    if (d[5]) { date.setDate(d[5]); }
    if (d[7]) { date.setHours(d[7]); }
    if (d[8]) { date.setMinutes(d[8]); }
    if (d[10]) { date.setSeconds(d[10]); }
    if (d[12]) { date.setMilliseconds(Number("0." + d[12]) * 1000); }
    if (d[14]) {
        offset = (Number(d[16]) * 60) + Number(d[17]);
        offset *= ((d[15] == '-') ? 1 : -1);
    }

    offset -= date.getTimezoneOffset();
    time = (Number(date) + (offset * 60 * 1000));
    return((new Date).setTime(Number(time)));
  };
  
})(jQuery);