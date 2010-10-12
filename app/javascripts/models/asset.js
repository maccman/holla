//= require <jquery.upload>
//= require <supermodel>
//= require <superrpc>

var Asset = SuperModel.setup("Asset");

(function($){

Asset.attributes = ["name", "size"];

Asset.extend(SuperModel.Timestamp);
Asset.include(SuperModel.GUID);

Asset.include({
  upload: function(file, options){
    var options = $.extend({}, {
      url:    "/assets/" + this.id,
      method: "PUT"
    }, options);
    
    $.upload(file, options);
  },
  
  getExt: function(){
    return(this.name.substr(this.name.lastIndexOf(".")));
  }

  // Private  
});

})(jQuery);