  var win = window;

  // Check for canvas support, exit out if no supprt
  if ( !win.CanvasRenderingContext2D ) { return win.Canvallax = function(){ return false; }; }

  var doc = document,
      root = doc.documentElement,
      body = doc.body,
      requestAnimationFrame = win.requestAnimationFrame || win.mozRequestAnimationFrame || win.webkitRequestAnimationFrame || win.msRequestAnimationFrame || win.oRequestAnimationFrame || function(callback){ win.setTimeout(callback, 20); },

      noop = function(){},

      // Default options
      defaults = {

        tracker: false,
        // (false||Canvallax.TrackScroll()||Canvallax.TrackPointer())
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

        parent: document.body,
        // (Node)
        // Canvas is prepended to document.body by default. Override with your own node if you want it within a certain container.

        elements: undefined,
        // (Array)
        // Collection of elements to render on the Canvallax instance

        animating: true,
        // (Boolean)
        // Update canvas every requestAnimationFrame call.

        fullscreen: true,
        // (Boolean)
        // Set the canvas width and height to the size of the window, and update on window resize. Otherwise, the provided with and height will be used.

        preRender: noop,
        // (Function)
        // Callback before elements are rendered.

        postRender: noop
        // (Function)
        // Callback after elements are rendered.

      };

  win.Canvallax = function Canvallax(options) {
    // Make new instance if not called with `new Canvallax`
    if ( !(this instanceof Canvallax) ) { return new Canvallax(options); }

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

    C.render();

    return C;
  }

////////////////////////////////////////

  function _zIndexSort(a,b){
    return (a.zIndex === b.zIndex ? 0 : a.zIndex < b.zIndex ? -1 : 1 );
  }

  Canvallax.prototype = {

    add: function(el){

      var elements = el.length ? el : arguments,
          len = elements.length,
          i = 0;

      for ( ; i < len; i++ ) {
        this.elements.push(elements[i]);
      }

      this.elements.sort(_zIndexSort);
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
          len = C.elements.length,
          offsetLeft = 0,
          offsetTop = 0,
          inBounds = C.fullscreen || C.tracking !== 'pointer';

      if ( C.animating ) { C.animating = requestAnimationFrame(C.render.bind(C)); }

      C.ctx.clearRect(0, 0, C.width, C.height);

      if ( C.tracker ) {
        var pos = C.tracker._render(C);
        C.x = pos.x;
        C.y = pos.y;
      }

      C.preRender(C.ctx,C);

      for ( ; i < len; i++ ){
        C.ctx.save();
        C.elements[i]._render(C.ctx,C);
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

    play: function(){
      this.animating = true;
      return this.render();
    },

    pause: function(){
      this.animating = false;
      return this;
    }
  };