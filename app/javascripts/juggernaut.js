//= require <jquery.ui>

jQuery(function($){
  if (typeof Juggernaut == "undefined") return;
  
  var JuggernautApp = Spine.Klass.create({
    init: function(){
      this.socket = new Juggernaut;
      this.offline = $("<div></div>")
    		.html("The connection has been disconnected! <br /> " + 
    		      "Please go back online to use this service.")
    		.dialog({
    			autoOpen: false,
    			modal:    true,
    			width:    330,
    			resizable: false,
    			closeOnEscape: false,
    			title: "Connection"
    		});
    		
    	this.proxyAll("connect", "disconnect", "reconnect", "process");
  
    	this.socket.on("connect", this.connect);
    	this.socket.on("disconnect", this.disconnect);
    	this.socket.on("reconnect", this.reconnect);
    	this.socket.subscribe("/observer", this.process)
    },
    
    connect: function(){
      this.log("connected");
      this.offline.dialog("close");
    },
    
    disconnect: function(){
      this.offline.dialog("open");
      this.log("disconnected")
    },
    
    reconnect: function(){
      this.log("reconnecting");
    },
    
    process: function(msg){
      this.log("process", msg);
      
      var klass = eval(msg.klass);
      switch(msg.type) {
        case "create":
          if ( !klass.exists(msg.record.id) )
            klass.create(msg.record);
          break;
        case "update":
          klass.update(msg.id, msg.record);
          break;
        case "destroy":
          klass.destroy(msg.id);
          break;
        default:
          throw("Unknown type:" + type);
      }
    }
  });
  
  // Add logging
  JuggernautApp.fn.logPrefix = "(Juggernaut)";
  JuggernautApp.include(Spine.Log);

  window.App.Juggernaut = new JuggernautApp;
});