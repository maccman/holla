//= require <jquery.drop>
//= require <jquery.upload>

(function($){

window.Assets = Spine.Controller.create({
  scoped: ["drop"],
  
  handle: $("meta[name=handle]").attr("content"),
  
  init: function(){
    if ( !this.messages )
      throw("`messages` option required");
    
    $("#wrapper").dropArea().bind("drop", this.drop);
  },
  
  drop: function(e){
    e.stopPropagation();
    e.preventDefault();
    e = e.originalEvent;
    
    var files = e.dataTransfer.files;
    for ( var i = 0; i < files.length; i++)
      this.upload(files[i]);
  },
  
  upload: function(file){
    if ( !this.messages.channel ) return;
    
    var message = Message.create({
      name:       this.handle,
      body:       "Uploading " + file.name,
      channel_id: this.messages.channel.id
    });
        
    $.upload("/assets", {file: file}, {
      dataType: "json",
      
      upload: {
        progress: function(e){
          // var per = Math.round((e.position / e.total) * 100);
          // message.updateAttributes({per: per});
        }
      }
    }).success(function(data){
      message.updateAttributes({
        body: file.name + ": " + data.url
      });
    });
  }
});

})(jQuery);