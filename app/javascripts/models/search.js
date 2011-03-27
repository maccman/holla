var Search = Spine.Klass.create();
Search.include(Spine.Events);

Search.models = [];

Search.Model = {
  extended: function(){
    Search.models.push(this);
  }
};

Search.include({
  init: function(){
    this.proxyAll("queryModel", "queryRecord");
    this.results = [];
  },
  
  query: function(params){
    this.clear();
    if ( !params ) return;
    this.params = params.toLowerCase();
    this.parent.models.forEach(this.queryModel);
    this.trigger("change");
  },
    
  clear: function(){
    this.results = [];
    this.trigger("change");
  },
  
  each: function(callback){
    this.results.forEach(callback);
  },
  
  // Private
  
  queryModel: function(model){
    var each  = model.search_each || model.each;
    each.call(model, this.queryRecord);
  },
  
  queryRecord: function(rec) {
    var attributes = (rec.search_attributes || rec.attributes).apply(rec);    
    
    for (var key in attributes) {      
      var value = (attributes[key] + "").toLowerCase();
      
      if (value.indexOf(this.params) != -1)
        this.results.push({
          value:  value,
          record: rec
        });
    }
  }
});