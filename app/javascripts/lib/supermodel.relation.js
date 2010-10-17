//= require <supermodel>

(function(){
  var camelize = function(str){
    var result = str;
    result = result.replace(/_+(.)?/g, function(match, chr) {
      return chr ? chr.toUpperCase() : '';
    });
    result = result.replace(/(^.)?/, function(match, chr) {
      return chr ? chr.toUpperCase() : '';
    });  
    return result;
  };

  var singularize = function(str){
    return(str.replace(/s$/, ''));
  };
  
  var classify = function(str){
    var result = singularize(str);
    return camelize(result);
  };
  
  var underscore = function(str){
    return str.replace(/::/g, '/')
              .replace(/([A-Z]+)([A-Z][a-z])/g, '$1_$2')
              .replace(/([a-z\d])([A-Z])/g, '$1_$2')
              .replace(/-/g, '_')
              .toLowerCase();
  };

  var constantize =  function(str){
    return(eval(str.valueOf()));
  };

  SuperModel.extend({
    belongsTo: function(to_model, options){
      if ( !options ) options = {};
      
      var class_name  = options.class_name  || classify(to_model);
      var foreign_key = options.foreign_key || to_model + "_id";
      var primary_key = options.primary_key || "id";
      var model = function(){ return(constantize(class_name)) };
      
      this.attributes.push(foreign_key);

      this.fn["get" + class_name] = function(){
        return(this[foreign_key] && model().find(this[foreign_key]));
      };
      
      this.fn["set" + class_name] = function(value){
        this[foreign_key] = value && value.id;
      };
    },
  
    hasMany: function(to_model, options){
      if ( !options ) options = {};
      
      var class_name  = options.class_name  || classify(to_model);
      var foreign_key = options.foreign_key || underscore(this.className) + "_id";
      var primary_key = options.primary_key || "id";
      var model = function(){ return(constantize(class_name)) };
            
      this.fn["get" + class_name + "s"] = function(){
        return(model().findAllByAttribute(foreign_key, this[primary_key]));
      };
      
      this.fn["has" + class_name] = function(item){
        var items    = this["get" + class_name + "s"]();
        var item_ids = jQuery.map(items, function(i){ return i.id });
        return(jQuery.inArray(item.id, item_ids) != -1);
      };
    }
  });
})();