//= require <superclass>
//= require <superevent>

var SuperApp = new SuperClass;
SuperApp.include(SuperEvent);
SuperApp.include({
  init: function(){
    this.states  = {};
    this.current = new SuperApp.State;
  },
  
  add: function(name){
    var state = new SuperApp.State(this, name);
    this.states[name] = state;
    return state;
  },
  
  find: function(name){
    return(this.states[name]);
  },
  
  change: function(){
    var args = jQuery.makeArray(arguments);  
    var name = args.shift();
    
    var previous = this.current;
    var state    = this.states[name];
    
    if ( !state ) throw "Unknown state: " + name;
        
    state.runSetup();
    previous.beforeExit();
    state.beforeEnter.apply(state, args);
    
    this.current = state;
    
    state.afterEnter();
    previous.afterExit();
    
    this.trigger("change", name, state);
  }
});

SuperApp.State = new SuperClass;
SuperApp.State.include(SuperEvent);

SuperApp.State.include({
  init: function(app, name){
    this.app  = app;
    this.name = name;
    jQuery(this.proxy(function(){
      this.load();
    }));
  },
  
  runSetup: function(){
    if ( !this.hasSetup ) {
      this.hasSetup = true;
      this.setup();
    }
  },
  
  delay: function(func, timeout){
    setTimeout(this.proxy(func, timeout || 0));
  }
});

SuperApp.State.fn.setupEvents([
  "beforeEnter", "afterEnter", 
  "beforeExit", "afterExit",
  "load", "setup"
]);