//= require <jquery.drop>

(function($){ 
  
  var state = App.state.find("channel");
  
  state.createAsset = function(file){
    var asset  = new Asset;
    asset.name = file.fileName;
    asset.size = file.size;
    asset.save();
    
    var ca        = new ChannelActivity;
    ca.klass      = "Asset";
    ca.klass_id   = asset.id;
    ca.type       = "create";
    ca.channel_id = this.current.id;
    ca.data = {
      name: asset.name, 
      size: asset.size,
      ext:  asset.getExt(),
      url:  "/assets/" + asset.id
    };
    ca.save();
    
    if (typeof FileReader != "undefined" && 
        file.type.match(/image.*/) && 
          file.size < 50000000) {
            
      var reader = new FileReader();  
      reader.onload = function(e) { 
        ca.preview = e.target.result;
        ca.save();
      };
      reader.readAsDataURL(file);
    }
    
    asset.createRemote(function(e){
      if (e.error) throw e.message;
      
      ca.createRemote();
      
      var startStamp = new Date();
      var throttleTime;
      
      asset.upload(file, {
        progress: function(e){
          var per    = Math.round((e.position / e.total) * 100);
          var lapsed = startStamp - e.timeStamp;
          var eta    = lapsed * e.total / e.position - lapsed;
          
          // Percentages are rounded, so sometimes they can be off
          if (ca.data.per && ca.data.per > per) return;
                    
          ca.data.per = per;
          ca.data.eta = eta;
          ca.save();
          
          // Only update remote clients every half a second
          if (!throttleTime || throttleTime < ((new Date) - 500)) {
            ca.updateRemote();
            throttleTime = new Date;
          }
        },
        
        load: function(){
          ca.data.interminate = true;
          ca.save();
          ca.updateRemote();
        },
        
        success: function(){
          ca.data.uploaded = true;
          ca.save();
          ca.updateRemote();
        }
      });
    });      
  };
  
  state.load(function(){
    this.view.dropArea();
    this.view.bind("drop", this.proxy(function(e){      
      e.stopPropagation();
      e.preventDefault();
      
      var files = e.originalEvent.dataTransfer.files;
      for ( var i = 0; i < files.length; i++)
        this.createAsset(files[i]);
        
      return false;
    }));
  });
  
  state.setup(function(){
    $(document.body).bind("paste", this.proxy(function(e){
      if (e.target == this.input.get(0)) return;

      var code = e.originalEvent.clipboardData.getData("text/plain");
      if (code == "") return;
      
      this.input.val(code);
      this.share.submit();
      
      return false;
    }));
    
    
    this.input.bind("paste", this.proxy(function(e){
      var files = e.originalEvent.clipboardData.files;
      for ( var i = 0; i < files.length; i++)
        this.createAsset(files[i]);
        
      if (files.length > 0) return false;
    }));
  });

})(jQuery);