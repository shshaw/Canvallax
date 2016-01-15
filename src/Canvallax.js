var Canvallax = win.Canvallax = createClass(Core,{

    canvas: undefined,
    // (Node)
    // Use Canvallax on an existing canvas node, otherwise one is created.

    className: '',
    // (String)
    // Classes to add to the canvas, in addition to the 'canvallax' class automatically added.

    parent: body,
    // (Node)
    // Canvas is prepended to document.body by default. Override with your own Node if you want it within a certain container.

    fullscreen: true,
    // (Boolean)
    // Set the canvas width and height to the size of the window, and update on window resize.

    width: null,
    // (Number)
    // Canvas width, overridden if `fullscreen` is true.

    height: null,
    // (Number)
    // Canvas height, overridden if `fullscreen` is true.

    resize: function(width,height){
      this.width = this.canvas.width = width;
      this.height = this.canvas.height = height;
      return this;
    },

    resizeFullscreen: function() {
      return this.resize(win.innerWidth,win.innerHeight);
    },

    elements: undefined,
    // (Array)
    // Collection of elements to render on the Canvallax instance

    sort: function(){
      this.elements.sort(zIndexSort);
      return this;
    },

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

    remove: function(element){
      var index = this.elements.indexOf(element);

      if ( index > -1 ) {
        this.elements.splice(index, 1);
      }

      return this;
    },

    init: function(options){
      var C = this;

      Canvallax.extend(this,options);

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

    preTranslate: false,

    render: function() {
      var C = this,
          i = 0,
          len = C.elements.length,
          pos,
          scale;

      if ( C.animating ) { C.animating = requestAnimationFrame(C.render.bind(C)); }

      C.ctx.clearRect(0, 0, C.width, C.height);

      if ( C.tracker ) {
        pos = C.tracker.render(C);
        // Allow tracker to set many properties.
        for ( var key in pos ) {
          if ( pos.hasOwnProperty(key) ) { C[key] = pos[key]; }
        }
      }

      C.ctx.save();
//      C.transform(C.ctx,C.getZScale());

/*
      if ( C.z ) {
        scale = C.getZScale();
        C.ctx.translate(C.width / 2, C.height / 2);
        C.ctx.scale(scale, scale);
        C.ctx.translate(C.width / -2, C.height / -2);
      }
*/

      C.preRender(C.ctx);

      for ( ; i < len; i++ ){
        C.ctx.save();
        C.elements[i].render(C.ctx,C);
        C.ctx.restore();
      }

      C.postRender(C.ctx);
      C.ctx.restore();

      return this;
    },

    animating: true,
    // (Boolean)
    // Update canvas every requestAnimationFrame call.

    play: function(){
      this.animating = true;
      return this.render();
    },

    pause: function(){
      this.animating = false;
      return this;
    },
  });

  // Utility functions outside of prototype.
  Canvallax.createClass = createClass;
  Canvallax.Core = Core;
  Canvallax.extend = extend;
  Canvallax.clone = clone;
