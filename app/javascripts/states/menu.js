jQuery(function($){
  var elements = $("#content .east [data-menu]");
  
  elements.live("click", function(){
    var state = $(this).attr("data-menu");
    App.state.change(state);
  });
  
  App.state.bind("change", function(name){
    elements.removeClass("active");
    elements.filter("[data-menu='" + name + "']").addClass("active");
  });
});

jQuery(function($){
  var element  = $("#channels");
  
  element.delegate("li", "click", function(){    
    var channel = $(this).item();
    App.state.change("channel", channel);
  });
    
  var currentChannel = function(){
    return(App.state.find("channel").current);
  };
  
  var connector = new SuperConnect(Channel, element, {
    builder: function(element, item){
      var channel      = currentChannel();
      var channelState = App.state.current.name == "channel";
      element.toggleClass("active", channelState && channel && 
                                    item.id == channel.id);
    }
  });
  
  App.state.bind("change", function(){ connector.render(); });
});