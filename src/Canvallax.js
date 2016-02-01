var Canvallax = win.Canvallax = createClass(Group,{

    canvas: null,
    // (Node)
    // Use Canvallax on an existing canvas node, otherwise one is created.

    className: '',
    // (String)
    // Classes to add to the canvas, in addition to the 'canvallax' class automatically added.

    parentElement: body,
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

    /**
     * Constructor
     * @param {Object} [options] Options object
     */
    init: function(options){
      var C = this;

      extend(this,options);

      C.canvas = C.canvas || doc.createElement('canvas');
      C.canvas.className += ' canvallax ' + C.className;

      C.parentElement.insertBefore(C.canvas, C.parentElement.firstChild);

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

      C.render = C.render.bind(C,C.ctx,C);

      if ( C.animating ) { C.play(); }

      return this;
    },

    clearFrames: true,

    _render: function(ctx) {

      if ( this.animating ) { requestAnimationFrame(this.render); }
      if ( this.clearFrames ) { ctx.clearRect(0, 0, this.width, this.height); }

      if ( !this.transform(ctx,false,this.getZScale()) ) { return this; }
    },

    animating: true,
    // (Boolean)
    // Redraw canvas based on the fps setting.

    play: function(){
      this.animating = true;
      requestAnimationFrame(this.render);
      return this;
    },

    pause: function(){
      this.animating = false;
      return this;
    },
  });

