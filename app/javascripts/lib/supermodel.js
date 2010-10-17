//= require <superclass>
//= require <superevent>

var SuperModel = new SuperClass();

SuperModel.extend(SuperEvent);
SuperModel.extend({
  records:    {},
  attributes: [],
  isModel:    true,
  
  // records is an object, since we want
  // to be able to use non-integer ids
  recordsValues: function(){
    var result = []
    for (var key in this.records)
      result.push(this.records[key])
    return result;
  },
  
  setup: function(name){
    var result = new SuperClass(SuperModel);
    // Can't use .name, so we use .className
    result.className = name;
    return result;
  },
  
  rawFind: function(id){
    var record = this.records[id];
    if( !record ) throw(this.className + ": Unknown Record #" + id);
    return record;
  },

  find: function(id){
    var record = this.rawFind(id);
    return(record.dup());
  },
  
  exists: function(id){
    try {
      return this.find(id);
    } catch (e) {
      return false;
    }
  },

  all: function(){
    return this.dupArray(this.recordsValues());
  },

  first: function(){
    var record = this.recordsValues()[0];
    return(record && record.dup());
  },

  last: function(){
    var values = this.recordsValues()
    var record = values[values.length - 1];
    return(record && record.dup());
  },
  
  select: function(callback){
    var result = [];
    
    for (var key in this.records)
      if (callback(this.records[key]))
        result.push(this.records[key]);
    
    return this.dupArray(result);
  },
  
  findByAttribute: function(name, value){
    for (var key in this.records)
      if (this.records[key][name] == value)
        return this.records[key].dup();
  },
  
  findAllByAttribute: function(name, value){
    return(this.select(function(item){
      return(item[name] == value);
    }));
  },
  
  each: function(callback){
    for (var key in this.records) {
      callback(this.records[key]);
    }
  },

  count: function(){
    return this.recordsValues().length;
  },

  deleteAll: function(){
    for (var key in this.records)
      delete this.records[key];
  },

  destroyAll: function(){
    for (var key in this.records)
      this.records[key].destroy();
  },

  update: function(id, atts){
    this.find(id).updateAttributes(atts);
  },
  
  create: function(atts){
    var record = new this(atts);
    record.save();
    return record;
  },

  destroy: function(id){
    this.find(id).destroy();
  },
  
  populate: function(values){
    this.records = {};
    for (var i=0, il = values.length; i < il; i++) {    
      var record = new this(values[i])
      record.newRecord = false;
      this.records[record.id] = record;
    }
    this.trigger("populate");
  },
  
  fromArray: function(array){
    var result = [];
    for (var i in array)
      result[i] = new this(array[i]);
    return result;
  },

  dupArray: function(array){
    return array.map(function(item){
      return item.dup();
    });
  }
});
  
SuperModel.include({
  init: function(atts){
    this.newRecord = true;
    this.load(atts);
    this.reloadChanges();
  },
  
  isNew: function(){
    return this.newRecord;
  },
  
  save: function(){
    this.trigger("beforeSave");
    this.isNew() ? this.create() : this.update();
    this.trigger("afterSave");
    this.trigger("save");
  },
  
  load: function(attributes){
    for(var name in attributes){
      this[name] = attributes[name];
    }
  },
  
  updateAttribute: function(name, value){
    this[name] = value;
    return this.save();
  },
  
  updateAttributes: function(attributes){
    this.load(attributes);
    return this.save();
  },
    
  dup: function(){
    var result = new this._class(this.attributes());
    result.newRecord = this.newRecord;
    return result;
  },
  
  attributes: function(){
    var result = {};
    for(var i in this._class.attributes) {
      var attr = this._class.attributes[i];
      result[attr] = this[attr];
    }
    result.id = this.id;
    return result;
  },
  
  changes: function(){
    var result = {};
    var atts   = this.attributes();
    var patts  = this.previousAttributes;
    for (var key in atts) {
      if (atts[key] != patts[key])
        result[key] = [patts[key], atts[key]];
    }
    return result;
  },
  
  // Private
  
  trigger: function(name){
    this._class.trigger(name, this);
  },
  
  reloadChanges: function(){
    this.previousChanges    = (this.previousAttributes ? this.changes() : {});
    this.previousAttributes = this.attributes();
  },
  
  generateID: function(){
    var last   = this._class.last();
    var lastId = last ? last.id : 0;    
    return(lastId += 1);
  },
  
  rawDestroy: function(){
    delete this._class.records[this.id];
  },
  
  destroy: function(){
    this.trigger("beforeDestroy");
    this.rawDestroy();
    this.trigger("afterDestroy");
    this.trigger("destroy");
  },
  
  rawCreate: function(){
    if( !this.id ) return;
    this._class.records[this.id] = this.dup();
  },
  
  create: function(){
    this.trigger("beforeCreate");
    if( !this.id ) this.id = this.generateID();
    this.newRecord = false;
    this.rawCreate();
    this.reloadChanges();
    this.trigger("afterCreate");
    this.trigger("create");
    return this.id;
  },
  
  rawUpdate: function(){
    var item = this._class.rawFind(this.id);
    item.load(this.attributes());
  },
  
  update: function(){
    this.trigger("beforeUpdate");
    this.rawUpdate();
    this.reloadChanges();
    this.trigger("afterUpdate");
    this.trigger("update");
    return true;
  }
});

SuperModel.setupEvents([
  "beforeSave", "afterSave", 
  "beforeUpdate", "afterUpdate",
  "beforeCreate", "afterCreate",
  "beforeDestroy", "afterDestroy"
]);

// Setters and Getters

SuperModel.setters = function(obj){
  for(var key in obj)
    this.__defineSetter__(key, obj[key]);
};
SuperModel.fn.setters = SuperModel.setters;

SuperModel.getters = function(obj){
  for(var key in obj)
    this.__defineGetter__(key, obj[key]);
};
SuperModel.fn.getters = SuperModel.getters;

// Serialization

SuperModel.serializeRecords = function(){
  var result = {};
  for(var key in this.records)
    result[key] = this.records[key].attributes();
  return result;
};