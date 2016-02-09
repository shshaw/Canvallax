canvallax.Scene = createClass(canvallax.Group,
  /** @lends canvallax.Scene.prototype */
  {
    /**
     * Object type
     * @type {string}
     * @default
     */
    type: 'scene',

    canvas: null,
    // (Node)
    // Draw scene on an existing canvas node, otherwise one is created.

    className: null,
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
      var me = this;

      if ( !me.canvas ) {
        me.canvas = doc.createElement('canvas');
        me.parentElement.insertBefore(me.canvas, me.parentElement.firstchild);
      }
      me.canvas.className += ' canvallax ' + me.className;
      me.ctx = me.canvas.getContext('2d');

      if ( me.fullscreen ) {
        me.resizeFullscreen();
        win.addEventListener('resize', me.resizeFullscreen.bind(me));
      } else {
        me.resize(me.width || me.canvas.width, me.height || me.canvas.height);
      }

      if ( options && options.children ) { me.add(options.children); }

      me.render = me.render.bind(me,me.ctx,me);
      if ( me.animating ) { me.play(); }
    },

    clearFrames: true,

    _render: function(ctx) {

      if ( this.animating ) { requestAnimationFrame(this.render); }
      if ( this.clearFrames ) { ctx.clearRect(0, 0, this.width, this.height); }

      //if ( !this.transform(ctx,false,this.getZScale()) ) { return this; }
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
    }

  });

