//= require <jquery.ui>
//= require <jquery.audio>

(function($){
  var state = App.state.find("channel");
  
  var builders = {};
  
  builders.Message = function(element, item){
    element.find(".text").text(item.data.body).
                          autolink().
                          mailto();
  };
  
  builders.Paste = function(element, item){
    var pre  = $("<pre />");
    var code = $("<code />");
    
    pre.append(code);
    element.find(".text").append(pre);
    
    code.text(item.data.body);
  };
  
  builders.Email = function(element, item){
    element.find(".text").text(item.data.body);
    
    element.find(".avatar img").replaceImageWhenLoaded(
      "/images/email.png"
    );
  };
  
  builders.Twitter = function(element, item){
    element.find(".text").text(item.data.body);
    
    element.find(".avatar img").replaceImageWhenLoaded(
      "/images/twitter.png"
    );
  };
  
  builders.Broadcast = function(element, item){
    element.find(".text").text(item.data.body);
    
    element.find(".avatar img").replaceImageWhenLoaded(
      "/images/broadcast.png"
    );
  };
  
  builders.Asset = function(element, item){
    var setup = element.data("setup");
    element.data("setup", true);
    
    element.find(".text").text(item.data.name);
    
    var preview = element.find(".preview");
    var previewImg = preview.find("img");
        
    var previewData   = item.preview || item.data.preview;
    var previewImgSrc = previewData || App.mimeIcon(item.data.ext);
        
    if (previewImg.attr("src") != previewImgSrc)
      previewImg.attr("src", previewImgSrc);
    
    preview.toggleClass("mime", !previewData);
    preview.attr("draggable", item.data.uploaded);
    
    if ( item.data.uploaded ) {
      preview.bind("dragstart", function(e){
        e.originalEvent.dataTransfer.setData("DownloadURL", [
          "application/octet-stream", item.data.name, 
          "http://" + window.location.host + item.data.url
        ].join(":"));
      });
    
      element.find(".text").add(preview).click(function(){
        document.location = item.data.url;
      });
    };
        
    if ( !item.data.uploaded ) {
      var progress    = element.find(".progress").fadeIn(800);
      var progressBar = progress.find(".bar");
      progressBar.progressbar({value: item.data.per});
  
      progressBar.toggleClass("interminate", item.data.per >= 100 && item.data.interminate);
    } else {
      element.find(".progress").fadeOut(800, function(){
        $(this).hide();
      });
    }
  };
  
  state.activityBuilder = function(element, item){
    element.addClass("klass" + item.klass);
    
    if (item.creator_id)
      element.find(".avatar img").attr({
        title: item.creator_name
      }).replaceImageWhenLoaded(
        "/users/" + item.creator_id + "/avatar"
      );
    
    var builder = builders[item.klass];
    if (builder) builder(element, item);
  };
    
  state.setup(function(){    
    this.connector = this.items.connect(ChannelActivity);
        
    this.connector.filter = this.proxy(function(i){ 
      return(i.channel_id == this.current.id);
    });
  
    this.connector.sort = function(a, b){
      return(Date.parseISOString(b.created_at) - Date.parseISOString(a.created_at));
    };
  
    this.connector.builder = this.activityBuilder;
      
    // We've got a custom renderer which creates
    // a pretty animation for incoming activity.
    this.connector.onCreate = $.proxy(function(item){
      if ( !this.filter(item) ) return;
      var elements = this.renderTemplate(item);
      elements = jQuery(elements);

      var scroll = this.element.scrollTop();
      this.element.prepend(elements);
      var height = elements.outerHeight() + 15;

      this.element.scrollTop(scroll + height);
      
      if (scroll <= 0) 
        this.element.scrollTop(0);

      // Slide in effect
      // this.element.animate({scrollTop: 0}, 300);
      
      $.playAudio("/audio/new.mp3");
      
    }, this.connector);
    
    // Don't replace content on update
    this.connector.onUpdate = $.proxy(function(item){
      if ( !this.filter(item) ) return;
      var element = this.findItem(item.id);
      this.builder.call(element, element, item);
    }, this.connector);    
  });
  
  state.afterEnter(function(){
    this.connector.render();
  })
})(jQuery);