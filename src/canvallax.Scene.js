canvallax.Scene = createClass(canvallax.Group,
  /** @lends canvallax.Scene.prototype */
  {
    /**
     * Object type
     * @type {string}
     * @default
     */
    type: 'scene',

    parentElement: body,
    // (Node)
    // Canvas is prepended to document.body by default. Override with your own Node if you want it within a certain container.

    fullscreen: true,
    // (Boolean)
    // Set the canvas width and height to the size of the window, and update on window resize.

    resize: function(width,height){
      this.width = this.canvas.width = width;
      this.height = this.canvas.height = height;
    },

    resizeFullscreen: function() {
      this.resize(win.innerWidth,win.innerHeight);
    },

    clearFrames: true,

    clear: function(ctx){
      ctx.clearRect(0, 0, this.width, this.height);
    },

    /**
     * Constructor
     * @param {Object} [options] Options object
     */
    init: function(options){
      var me = this;

      if ( !me.canvas ) {
        me.canvas = doc.createElement('canvas');
        me.parentElement.insertBefore(me.canvas, me.parentElement.firstChild);
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
      if ( me.playing ) { me.play(); }
    },

    _render: function(ctx) {
      if ( this.playing ) { requestAnimationFrame(this.render); }
    },

    playing: true,
    // (Boolean)
    // Redraw canvas based on the fps setting.

    play: function(){
      this.playing = true;
      requestAnimationFrame(this.render);
    },

    pause: function(){
      this.playing = false;
    }

  });

