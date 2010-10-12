var Roster = SuperModel.setup("Roster");
Roster.attributes = ["user_id", "user_name", "count"];

Roster.extend(SuperModel.Timestamp);

Roster.extend({
  update: function(id, atts){
    // We don't care if it fails
    try {
      this.find(id).updateAttributes(atts);
    } catch(e){
      this.create(atts);
    }
  },
  
  destroy: function(id){
    try {
      this.find(id).destroy();
    } catch(e){}
  }
});