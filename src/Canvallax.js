  var win = window,
      doc = document,
      root = doc.documentElement,
      body = doc.body,
      noop = function(){},
      slice = Array.prototype.slice,
      requestAnimationFrame = win.requestAnimationFrame || win.mozRequestAnimationFrame || win.webkitRequestAnimationFrame || win.msRequestAnimationFrame || win.oRequestAnimationFrame || function(callback){ win.setTimeout(callback, 20); };

  // Check for canvas support, exit out if no supprt
  if ( !win.CanvasRenderingContext2D ) { return win.Canvallax = function(){ return false; }; }

  // Default options
  var Canvallax,
      defaults = {

        tracker: false,
        // (`false`||Canvallax.TrackScroll()||Canvallax.TrackPointer())
        // Set to false if you want to control the scene's X and Y manually, perfect for animating with GSAP.

        x: 0,
        // (Number)
        // Starting x position.
        // If `tracking` is enabled, this will be overridden on render.

        y: 0,
        // (Number)
        // Starting y position.
        // If `tracking` is enabled, this will be overridden on render.

        canvas: undefined,
        // (Node)
        // Use Canvallax on an existing canvas node, otherwise one is created.

        className: '',
        // (String)
        // Classes to add to the canvas, in addition to the 'canvallax' class automatically added.

        parent: body,
        // (Node)
        // Canvas is prepended to document.body by default. Override with your own Node if you want it within a certain container.

        elements: undefined,
        // (Array)
        // Collection of elements to render on the Canvallax instance

        animating: true,
        // (Boolean)
        // Update canvas every requestAnimationFrame call.

        fullscreen: true,
        // (Boolean)
        // Set the canvas width and height to the size of the window, and update on window resize.

        width: null,
        // (Number)
        // Canvas width, overridden if `fullscreen` is true.

        height: null,
        // (Number)
        // Canvas height, overridden if `fullscreen` is true.

        preRender: noop,
        // (Function)
        // Callback before elements are rendered.

        postRender: noop
        // (Function)
        // Callback after elements are rendered.

      };

  function extend(target) {
    target = target || {};

    var length = arguments.length,
        i = 1;

    if ( arguments.length === 1 ) {
      target = this;
      i = 0;
    }

    for ( ; i < length; i++ ) {
      if ( !arguments[i] ) { continue; }
      for ( var key in arguments[i] ) {
        if ( arguments[i].hasOwnProperty(key) ) { target[key] = arguments[i][key]; }
      }
    }

    return target;
  }

  function createClass(){

    function C(options) {
      if ( !(this instanceof C) ) { return new C(options); }

      extend(this,options);
      this.init.apply(this,arguments);

      return this;
    }

    var args = slice.call(arguments),
        parent = null,
        fn = C.prototype = { init: noop };

    if ( args.length > 1 && args[0].prototype ) {
      parent = args[0];
      args[0] = args[0].prototype;
      fn._parent = parent;
    }

    args.unshift(fn);
    extend.apply(fn, args);

    fn.constructor = C;

    return C;
  }

////////////////////////////////////////

  function zIndexSort(a,b){
    var sort = ( a.zIndex === b.zIndex ? 0 : a.zIndex < b.zIndex ? -1 : 1 );
    return sort || ( a.z === b.z ? 0 : a.z < b.z ? -1 : 1 );
  }

  function clone(properties){
    var props = extend({}, this, properties);
    return new this.constructor(props);
  }

  win.Canvallax = Canvallax = createClass({

    add: function(el){
      var elements = el && el.length ? el : arguments,
          len = elements.length,
          i = 0;

      for ( ; i < len; i++ ) {
        if ( elements[i] ) { // Prevent adding `false` or `undefined` elements
          this.elements.push(elements[i]);
        }
      }

      return this.sort();
    },

    init: function(options){
      var C = this;

      Canvallax.extend(this,defaults,options);

      C.canvas = C.canvas || doc.createElement('canvas');
      C.canvas.className += ' canvallax ' + C.className;

      C.parent.insertBefore(C.canvas, C.parent.firstChild);

      if ( C.fullscreen ) {
        C.resizeFullscreen();
        win.addEventListener('resize', C.resizeFullscreen.bind(C));
      } else {
        C.resize(C.width,C.height);
      }

      C.ctx = C.canvas.getContext('2d');

      C.elements = [];
      if ( options && options.elements ) { C.addElements(options.elements); }

      C.damping = ( !C.damping || C.damping < 1 ? 1 : C.damping );

      C.render();

      return this;
    },

    play: function(){
      this.animating = true;
      return this.render();
    },

    pause: function(){
      this.animating = false;
      return this;
    },

    remove: function(element){
      var index = this.elements.indexOf(element);

      if ( index > -1 ) {
        this.elements.splice(index, 1);
      }

      return this;
    },

    render: function() {
      var C = this,
          i = 0,
          len = C.elements.length;

      if ( C.animating ) { C.animating = requestAnimationFrame(C.render.bind(C)); }

      C.ctx.clearRect(0, 0, C.width, C.height);

      if ( C.tracker ) {
        var pos = C.tracker.render(C);
        C.x = pos.x;
        C.y = pos.y;
      }

      C.preRender(C.ctx,C);

      for ( ; i < len; i++ ){
        C.ctx.save();
        C.elements[i].render(C.ctx,C);
        C.ctx.restore();
      }

      C.postRender(C.ctx,C);

      return this;
    },

    resize: function(width,height){
      this.width = this.canvas.width = width;
      this.height = this.canvas.height = height;
      return this;
    },

    resizeFullscreen: function() {
      return this.resize(win.innerWidth,win.innerHeight);
    },

    sort: function(){
      this.elements.sort(zIndexSort);
      return this;
    },

    clone: clone
  });

  // Utility functions outside of prototype.
  Canvallax.createClass = createClass;
  Canvallax.extend = extend;
  Canvallax.clone = clone;