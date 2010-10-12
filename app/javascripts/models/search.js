var Search = SuperModel.setup("Search");
Search.attributes = ["value", "record"];

Search.extend({
  search: function(query){
    this.query = query;
    this.populate([]);
    
    if ( $.isBlank(query) ) return;
    
    this.query = this.query.toLowerCase()
    
    var items = ChannelActivity.all();
    var atts  = ["name", "body"];
    
    for(var i=0, len = items.length; i < len; i++) {
      if ( !items[i].data ) continue;

      for (var j=0; j < atts.length; j++) {
        var value = items[i].data[atts[j]];
        
        if ( value && value.toLowerCase().indexOf(this.query) != -1 ) {
          this.create({
            value:  value, 
            record: items[i]
          });
          break;
        }
      } 
    }
  }
});