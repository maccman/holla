jQuery(function($){
  App.trigger("loading");

  var loader = function(data){
    for (var name in data) {
      var model = $.constantize($.classify(name));
      model.populate(data[name]);
    }
    
    App.trigger("loaded");
  };

  $.ajax({
    url: "/ria/loader",
    dataType: "json",
    cache: false,
    success: loader
  });
});