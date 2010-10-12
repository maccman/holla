(function($){

var state = App.state.add("search");

state.load(function(){
  this.searchInput = $("#content .east .search");
  this.searchInput.bind("keyup", function(){
    App.state.change("search", $(this).val());
  });
  
  this.searchInput.bind("focus", function(){
    var value = $(this).val();
    if (value != "") App.state.change("search", value);
  });
});

state.setup(function(){
  this.connector = new SuperConnect(Search, this.items);
  
  var channelState = App.state.find("channel");
  this.connector.builder = function(element, item) { 
    channelState.activityBuilder(element, item.record);
  };
});

state.beforeEnter(function(query){
  this.query = query;
  
  this.results.text("Results for: " + this.query);

  Search.search(query);
});

state.hasView = true;

})(jQuery);