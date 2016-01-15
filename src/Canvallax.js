var Canvallax = win.Canvallax = createClass(Group,{

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

      C.children = [];
      if ( options && options.elements ) { C.addElements(options.elements); }

      C.damping = ( !C.damping || C.damping < 1 ? 1 : C.damping );

      C.render(C.ctx,C);

      return this;
    },

    preTranslate: false,

    _render: function(ctx) {
      var el = this;

      if ( el.animating ) { el.animating = requestAnimationFrame(el.render.bind(el,ctx,el)); }

      ctx.clearRect(0, 0, el.width, el.height);

    },

    animating: true,
    // (Boolean)
    // Update canvas every requestAnimationFrame call.

    play: function(){
      this.animating = true;
      return this.render(this.ctx,this);
    },

    pause: function(){
      this.animating = false;
      return this;
    },
  });

  // Utility functions outside of prototype.
  Canvallax.Group = Group;
  Canvallax.createClass = createClass;
  Canvallax.Core = Core;
  Canvallax.extend = extend;
  Canvallax.clone = clone;
