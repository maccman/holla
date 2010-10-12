//= require <jquery>

//= require <rails>
//= require <rails.application>

//= require <superclass>
//= require <superevent>
//= require <superapp>
//= require <superapp.view>
//= require <supermodel>
//= require <superconnect>
//= require <superrpc>

//= require <shared>

var App = new SuperClass;
App.extend(SuperEvent);

App.extend({
  state: new SuperApp,
    
  init: function(){
    this.trigger("init");
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

App.trace = true;
SuperRPC.trace = true;

jQuery(function($){
  App.state.view = new SuperApp.View($("#views"));
  App.user_id = $("meta[name=user-id]").attr("content");
  
  App.init();
    
  App.on("loaded", function(){
    App.log("Loaded");
    
    var channel = Channel.first();
    if (channel)
      App.state.change("channel", channel);
    else
      App.state.change("intro");
  });
  
  App.state.change("loading");
});

//= require <application.utils>
//= require <application.juggernaut>

//= require <models/asset>
//= require <models/activity>
//= require <models/channel>
//= require <models/channel_activity>
//= require <models/user>
//= require <models/search>
//= require <models/roster>

//= require <states/loading>
//= require <states/channel>
//= require <states/activity>
//= require <states/menu>
//= require <states/search>
//= require <states/settings>
//= require <states/intro>

//= require <loader>