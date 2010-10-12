(function($){

var uploadDefaults = {
  progress: $.noop,
  load:     $.noop,
  method:   "POST"
};

$.upload = function(file, options){
  options = $.extend( {}, uploadDefaults, options);
  
  $.ajax({
    url: options.url,
    type: options.method,
    success: options.success,
    processData: false,
    contentType: "multipart/form-data",
    
    beforeSend: function(xhr){
      var upload = xhr.upload;
      upload.addEventListener("progress", options.progress, false);
      upload.addEventListener("load", options.load, false);
      
      xhr.setRequestHeader("Cache-Control", "no-cache");
      xhr.setRequestHeader("X-File-Name", file.fileName);
      xhr.setRequestHeader("X-File-Size", file.fileSize);
    },
    
    data: file
  });
};

})(jQuery);