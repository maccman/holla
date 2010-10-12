
App.extend({
  mimeIcon: function(ext){
    var type;
    
    switch(ext && ext.toLowerCase()){
      case ".png":
      case ".jpg":
      case ".gif":
        type = "image";
        break;
      case ".mp3":
      case ".acc":
        type = "audio"
        break;
      case ".doc":
      case ".pdf":
        type = "document"
        break;
      case ".csv":
      case ".xls":
        type = "spreadsheet"
        break;
      case ".zip":
      case ".tar":
      case ".gz":
        type = "zip"
        break;
      default:
        type = "unknown"
    }
    
    return("/images/mime/" + type + ".png");
  }
});