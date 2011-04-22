//= require <json2>
//= require <array.ext>
//= require <jquery>
//= require <jquery.tmpl>
//= require <jquery.audio>

//= require <spine>
//= require <spine.model.ajax>
//= require <spine.controller.manager>
//= require <utils>

//= require <models/search>
//= require <models/message>
//= require <models/channel>

//= require <controllers/messages>
//= require <controllers/sidebar>
//= require <controllers/searches>
//= require <controllers/settings>
//= require <controllers/assets>

jQuery(function($){

window.App = Spine.Controller.create({
  el: $("body"),
    
  elements: {
    "#sidebar": "sidebarEl",
    "#messages": "messagesEl",
    "#searches": "searchesEl",
    "#settings": "settingsEl"
  },
  
  init: function(){
    this.messages = Messages.init({el: this.messagesEl});
    this.sidebar  = Sidebar.init({el: this.sidebarEl});
    this.searches = Searches.init({el: this.searchesEl});    
    this.settings = Settings.init({el: this.settingsEl});
    this.assets   = Assets.init({messages: this.messages});
        
    // Make sure only one view is visible
    this.manager = Spine.Controller.Manager.init();
    this.manager.addAll(this.messages, this.searches, this.settings);
    
    // Remove selected sidebar items when searching
    this.manager.bind("change", this.proxy(function(current){
      if (current == this.searches) this.sidebar.deactivate();
    }));
    
    Message.fetch();
    Channel.fetch();
  }
}).init();

});

//= require <juggernaut>