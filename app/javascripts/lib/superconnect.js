/*
 * jQuery Templating Plugin
 * Copyright 2010, John Resig
 * Dual licensed under the MIT or GPL Version 2 licenses.
 */
(function(jQuery){
	// Override the DOM manipulation function
	var oldManip = jQuery.fn.domManip;
	
	jQuery.fn.extend({
		render: function( data ) {
			return this.map(function(i, tmpl){
				return jQuery.render( tmpl, data );
			});
		},
		
		// This will allow us to do: .append( "template", dataObject )
		domManip: function( args ) {
			// This appears to be a bug in the appendTo, etc. implementation
			// it should be doing .call() instead of .apply(). See #6227
			if ( args.length > 1 && args[0].nodeType ) {
				arguments[0] = [ jQuery.makeArray(args) ];
			}

			if ( args.length === 2 && typeof args[0] === "string" && typeof args[1] !== "string" ) {
				arguments[0] = [ jQuery.render( args[0], args[1] ) ];
			}
			
			return oldManip.apply( this, arguments );
		}
	});
	
	jQuery.extend({
		render: function( tmpl, data ) {
			var fn;
			
			// Use a pre-defined template, if available
			if ( jQuery.templates[ tmpl ] ) {
				fn = jQuery.templates[ tmpl ];
				
			// We're pulling from a script node
			} else if ( tmpl.nodeType ) {
				var node = tmpl, elemData = jQuery.data( node );
				fn = elemData.tmpl || jQuery.tmpl( node.innerHTML );
			}

			fn = fn || jQuery.tmpl( tmpl );
			
			// We assume that if the template string is being passed directly
			// in the user doesn't want it cached. They can stick it in
			// jQuery.templates to cache it.

			if ( jQuery.isArray( data ) ) {
				return jQuery.map( data, function( data, i ) {
					return fn.call( data, jQuery, data, i );
				});

			} else {
				return fn.call( data, jQuery, data, 0 );
			}
		},
		
		// You can stick pre-built template functions here
		templates: {},

		/*
		 * For example, someone could do:
		 *   jQuery.templates.foo = jQuery.tmpl("some long templating string");
		 *   $("#test").append("foo", data);
		 */

		tmplcmd: {
			"each": {
				_default: [ null, "$i" ],
				prefix: "jQuery.each($1,function($2){with(this){",
				suffix: "}});"
			},
			"if": {
				prefix: "if($1){",
				suffix: "}"
			},
			"else": {
				prefix: "}else{"
			},
			"html": {
				prefix: "_.push(typeof $1==='function'?$1.call(this):$1);"
			},
			"=": {
				_default: [ "this" ],
				prefix: "_.push($.encode(typeof $1==='function'?$1.call(this):$1));"
			}
		},

		encode: function( text ) {
			return text != null ? document.createTextNode( text.toString() ).nodeValue : "";
		},

		tmpl: function(str, data, i) {
			// Generate a reusable function that will serve as a template
			// generator (and which will be cached).
			var fn = new Function("jQuery","$data","$i",
				"var $=jQuery,_=[];_.data=$data;_.index=$i;" +

				// Introduce the data as local variables using with(){}
				"with($data){_.push('" +

				// Convert the template into pure JavaScript
				str
					.replace(/[\r\t\n]/g, " ")
					.replace(/\${([^}]*)}/g, "{{= $1}}")
					.replace(/{{(\/?)(\w+|.)(?:\((.*?)\))?(?: (.*?))?}}/g, function(all, slash, type, fnargs, args) {
						var tmpl = jQuery.tmplcmd[ type ];

						if ( !tmpl ) {
							throw "Template not found: " + type;
						}

						var def = tmpl._default;

						return "');" + tmpl[slash ? "suffix" : "prefix"]
							.split("$1").join(args || def[0])
							.split("$2").join(fnargs || def[1]) + "_.push('";
					})
				+ "');}return $(_.join('')).get();");

			// Provide some basic currying to the user
			return data ? fn.call( this, jQuery, data, i ) : fn;
		}
	});
})(jQuery);

//= require <superclass>
//= require <superevent>

/*
 * jQuery data chaining plugin
 * Copyright 2010, Alex MacCaw
 * Licensed under the MIT license.
 */
var SuperConnect = new SuperClass;

SuperConnect.include(SuperEvent);
SuperConnect.include({
  init: function(element, klass, options){
    this.options    = options || {};
    this.singleton  = this.options.singleton || false;
    this.collection = !this.singleton;
    this.filter     = function(){ return true; };
    this.builder    = this.options.builder;
    
    this.setKlass(klass);
    this.setElement(element);
  },
  
  setKlass: function(klass){
    if ( !klass ) return;
    
    this.klass = klass;
    if (this.collection)
      this.klass.on("populate", this.proxy(function(item){ this.onPopulate() }));
      
    // Not passing function instances so we can easily override
    this.klass.on("create",  this.proxy(function(item){ this.onCreate(item) }));
    this.klass.on("update",  this.proxy(function(item){ this.onUpdate(item) }));
    this.klass.on("destroy", this.proxy(function(item){ this.onDestroy(item) }));    
  },
  
  setElement: function(element){
    if ( !element ) return;    
    
    this.element  = jQuery(element);
    
    if (this.options.custom) return;
    this.template = jQuery.tmpl(this.element.html());
    this.element.empty();
  },
  
  setItem: function(item){
    if ( !this.singleton ) throw "Must be singleton";
    this.item   = item;
    this.filter = function(i){ return(i === item); }
  },
  
  paginate: function(index, length){
    if ( !this.collection ) throw "Must be collection";
    this._paginate = [index, length];
  },
  
  render: function(data){
    if ( !this.klass )   throw "Klass not set";
    if ( !this.element ) throw "Element not set";
    if ( !data ) data = this.allItems();
        
    // Generate and append elements
    var elements = this.renderTemplate(data);
    
    this.trigger("beforeRender", elements, data);
    
    if ( !this.options.custom ) {
      this.element.empty();
      this.element.append(elements);
    }
    
    this.trigger("afterRender");
    this.trigger("render");
  },

  // Private functions
  
  allItems: function(){    
    // Fetch data
    var data = this.collection ? this.klass.all() : [this.item];
        
    // Apply filter
    data = jQuery.grep(data, this.filter);
        
    // Sort array
    if (this.sort)
      data = data.sort(this.sort);

    // Paginate
    if (this._paginate) 
      data = data.splice(this._paginate[0], this._paginate[1]);

    return data;
  },
  
  renderTemplate: function(data){
    data = jQuery.makeArray(data);
    return jQuery.map( data, this.proxy(function( data, i ) {
  		var element  = this.template && this.template.call( data, jQuery, data, i );
      var jElement = jQuery(element || []);
      
      if (this.builder) this.builder.call(jElement, jElement, data);
      
      jElement.attr({"data-id": data.id, "data-klass": this.klass.className});
      jElement.data({id: data.id, klass: this.klass.className});
      jElement.addClass("connect-item");
  		
  		return element;
  	}));
  },
    
  findItem: function(id){
    return(this.element.find("> [data-id='" + id + "']"));
  },
  
  onPopulate: function(){
    this.render();
  },
  
  onCreate: function(item){ 
    if ( !this.filter(item) ) return;
    var elements = this.renderTemplate(item);
    this.element.append(elements);
    this.trigger("render");
  },
  
  onUpdate: function(item){
    if ( !this.filter(item) ) return;
    if (item.id) {
      this.findItem(item.id).replaceWith(
        this.renderTemplate(item)
      );
      this.trigger("render");      
    } else {
      this.render();
    }
  },
  
  onDestroy: function(item){
    if ( !this.filter(item) ) return;
    if (item.id) {
      this.findItem(item.id).remove();
      this.trigger("render");
    } else {
      this.render();
    }
  }
});

SuperConnect.fn.setupEvents([
  "beforeRender", "afterRender"
]);

(function($){

$.fn.item = function(){
  var element = this.hasClass("connect-item") ? 
                this : this.parents(".connect-item");
  
  var id = element.data("id"),
      klass = element.data("klass");
  
  if ( id == undefined || klass == undefined ) return;
  return(eval(klass).find(id));
};

$.fn.connect = function(klass, options){
  return(new SuperConnect($(this), klass, options));
};

})(jQuery);