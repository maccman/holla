//= require <superclass>
// 
// SuperRoute.route({
//   "/maccman": function(){
//     console.log("maccman!");
//   }
// });
// 
// var App = new SuperApp;
// App.route({
//   "/config": "config",
//   "/users/:id": function(route){
//     this.change("users", User.find(route.id));
//   }
// });
// 
// App.navigate("/users", 1);

var SuperRoute = new SuperClass;

SuperRoute.extend({
  route: function(routes){
    return(new this(routes));
  },
  
  navigate: function(){
    window.location.hash = "#!" + arguments.join("/");
  }
});

SuperRoute.include({
  init: function(routes){
    // TODO - generate regexes
    this.routes = routes;
    
    jQuery(window).bind(
      "hashchange", 
      this.proxy(this.hashChange)
    );
  },
  
  // TODO - check and execute
  check: function(hash){
    
    if (value.apply(value, result) !== false) return;
  },
  
  hashChange: function(){
    this.check(window.location.hash);
  }
});

if (typeof SuperApp != "undefined") {
  
SuperApp.fn.route = function(routes){
  for (var key in routes) {
    var value   = routes[key]
    routes[key] = this.proxy(function(){
      if (typeof value == "string")
        this.change(value);
      else
        value.apply(this, arguments);
    });
  }
  
  return(SuperRoute.route(routes));
};

SuperRoute.fn.navigate = SuperRoute.navigate;

}