(function($){
  function dragEnter(e) {
    $(e.target).addClass("dragOver");
    e.stopPropagation();
    e.preventDefault();
    return false;
  };
  
  function dragOver(e) {
    // dropEffect needs to be set twice
    e.originalEvent.dataTransfer.dropEffect = "copy";
    e.stopPropagation();
    e.preventDefault();
    return false;    
  };
  
  function dragLeave(e) {
    $(e.target).removeClass("dragOver");
    e.stopPropagation();
    e.preventDefault();
    return false;
  };
      
  $.fn.dropArea = function(){
    this.bind("dragenter", dragEnter).
         bind("dragover",  dragOver).
         bind("dragleave", dragLeave);
    return this;
  };
  
  $(function(){
    $(document.body).bind("dragover", function(e){
      e.stopPropagation();
      e.preventDefault();
      return false
    });
  });
})(jQuery);