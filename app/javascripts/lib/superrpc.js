//= require <superclass>
//= require <superevent>

var SuperRPC = new SuperClass;

SuperRPC.extend(SuperEvent);
SuperRPC.extend({
  endpoint: "/ria/rpc",
  
  // Usage: invoke(klass, method, *args)
  invoke: function(){
    var args   = jQuery.makeArray(arguments);
    var klass  = args.shift();
    var method = args.shift();
    
    var callback = args.pop();
    if(typeof(callback) != "function" && 
       typeof(callback) != "undefined"){
      callback = null;
      args.push(callback);
    }
    
    var message = {
      klass:klass, 
      method:method,
      args:args
    };
    
    this.log("Invoking", klass, method, args);
    
    jQuery.ajax({
      url: this.endpoint,
      type: "POST",
      contentType: "application/json; charset=utf-8",
      success:     this.callback(callback),
      dataType:    "json",
      data:        JSON.stringify(message),
      beforeSend:  this.proxy(function(xhr){
        this.trigger("beforeSend", xhr);
      })
    });
  },
  
  // Private methods
  
  callback: function(callback){
    return(this.proxy(function(result){
      // We're not throwing the error, so it can be caught
      if (result && result.error)
        this.log("RPC Error -", result.name, result.message);
      
      if (callback)
        callback.call(callback, result);
    }));
  },
  
  trace: false,
  
  log: function(){
    if ( !this.trace ) return;
    if (typeof console == "undefined") return;
    var args = jQuery.makeArray(arguments);
    args.unshift("(App)");
    console.log.apply(console, args);
  }
});

if (typeof SuperModel != "undefined") {
  
  SuperModel.extend({
    invoke: function(){
      var args   = jQuery.makeArray(arguments);      
      args.unshift(this.className);
      SuperRPC.invoke.apply(SuperRPC, args);
    }
  })
  
  SuperModel.include({
    createRemote: function(callback){
      this._class.invoke(
        "create",
        this.attributes(),
        callback
      );
    },
    
    updateRemote: function(callback){
      this._class.invoke(
        "update",
        this.id,
        this.attributes(),
        callback
      );
    },
    
    destroyRemote: function(callback){
      this._class.invoke(
        "destroy",
        this.id,
        callback
      );
    }
  });
  
}