jQuery(function($){
  if (typeof Juggernaut == "undefined") return;
  
  var user_id = App.user_id;
  
  if ( !user_id || user_id == "" ) return;
  
  var process = function(msg){
    App.log("Juggernaut -", msg);
    
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
  };
  
  var jug = new Juggernaut;
  
  jug.meta = {user_id:user_id};
  
  var offline = $("<div></div>")
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
  
  jug.on("connect", function(){ 
    App.log("Jug connected");
    offline.dialog("close");
  });

  jug.on("disconnect", function(){ 
    offline.dialog("open");
    App.log("Jug disconnected") 
  });

  jug.on("reconnect", function(){ App.log("Jug reconnecting") });  
    
  SuperRPC.bind("beforeSend", function(xhr){
    xhr.setRequestHeader("X-Session-ID", jug.sessionID);
  });
  
  App.log("Jug subscribing to: ", "/observer/" + user_id);
  
  jug.subscribe("/observer/" + user_id, process);
  
  // Expose
  App.jug = jug;
});