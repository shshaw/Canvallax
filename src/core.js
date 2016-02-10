/**
 * Core properties used for most Canvallax objects
 * @default
 * @lends canvallax.Group.prototype
 * @lends canvallax.Scene.prototype
 * @lends canvallax.Element.prototype
 */
var core = {

    /**
     * Horizontal offset from the left
     * @type {!number} - `x` coordinate
     * @default
     */
    x: 0,

    /**
     * Vertical offset from the top
     * @type {!number} - `y` coordinate
     * @default
     */
    y: 0,

    /**
     * Distance from the camera
     * @type {!number} - `z` coordinate
     * @default
     */
    z: 0,

    /**
     * Amount of rotation in degrees (typically 0-360),
     * Rotation will occur from the `transformOrigin` property
     * @type {!number} degrees
     * @default
     */
    rotation: 0,

    /**
     * How large the object should be rendered relative to its natural size.
     * Scaling will occur from the `transformOrigin` property and is in addition to the `z` property's scaling.
     * @type {number}
     * @default
     */
    scale: 1,

    /**
     * Object's opacity
     * `0` is fully transparent and will not be rendered, `1` is fully opaque.
     * @type {number}
     * @default
     */
    opacity: 1,

    /**
     * Clip to element or with custom function
     * @type {!function}
     * @param ctx - 2d canvas context
     * @param {object} parent - Parent object, usually a Canvallax scene
     * @default
     */
    _clip: function(ctx,parent){
      var me = this;
      ctx.beginPath();
      if ( me.clip.render ) {
        me.clip.parent = parent || me;
        me.clip.render(ctx,parent);
      } else {
        me.clip.call(me,ctx,parent);
      }
      ctx.clip();
    },

    clear: function(ctx){
      ctx.clearRect(this.x, this.y, this.width, this.height);
    },

    /**
     * Main rendering function
     * @type {!function}
     * @param ctx - 2d canvas context
     * @param {object} parent - Parent object, usually a Canvallax scene
     * @returns {this}
     * @default
     */
    render: function(ctx,parent) {

      if ( !ctx ) { return; }

      var me = this,
          len = me.length || 0,
          i = 0,
          pos, key, o;

      parent = parent || me.parent;

      if ( me.tracker ) {
        pos = me.tracker.render(me,parent);
        // Allow tracker to set many properties.
        if ( pos ) {
          for ( key in pos ) {
            if ( pos.hasOwnProperty(key) ) { me[key] = pos[key]; }
          }
        }
      }

      o = ctx.globalAlpha * me.opacity;
      if ( o <= 0 ) { return me; }

      ctx.save();
      ctx.globalAlpha = o;
      if ( me.blend ) { ctx.globalCompositeOperation = me.blend; }
      if ( me.clearFrames ) { me.clear(ctx,parent); }
      if ( me.clip ) { me._clip(ctx,parent); }
      if ( me.preRender ) { me.preRender(ctx,parent); }
      if ( me._render ) { me._render(ctx,parent); }
      for ( ; i < len; i++ ){ me[i].render(ctx,me); }
      if ( me.postRender ) { me.postRender(ctx,parent); }
      ctx.restore();

      return me;
    },

    /**
     * Get the canvas the object is rendering onto
     * @type {!function}
     * @returns {this}
     * @default
     */
    getCanvas: function(){
      return this.canvas || ( this.parent ? this.parent.getCanvas() : false );
    },

    /**
     * Where the element's transforms will occur
     * Array of coordinates  two keywords separated by a space.
     * The default of `'center center'` means that `rotation` and `scale` transforms will occur from the center.
     * The first keyword can be `left`, `center` or `right` cooresponding to the appropriate horizontal position.
     * The second keyword can be `top`, `center` or `bottom` cooresponding to the appropriate vertical position.
     * @type {string|array}
     * @default
     */
    transformOrigin: 'center center',

    /**
     * Get the coordinates where the transforms should occur based on the transform origin.
     * @type {function}
     * @returns {array} - Array of x & y coordinates, relative to the object's top left.
     * @default
     */
    getTransformPoint: function(){
      var me = this,
          point = me._transformPoint,
          origin;

      // Cache values to avoid recalculation
      if ( !point || me._transformOrigin !== me.transformOrigin ) {

        if ( Array.isArray(me.transformOrigin) ) {
          point = me.transformOrigin;
        } else {

          point = [0,0];

          origin = me.transformOrigin.split(' ');

          if ( !me.width && !me.height ) { return point; }

          if ( origin[0] === 'center' ) {
            point[0] += me.width / 2;
          } else if ( origin[0] === 'right' ) {
            point[0] += me.width;
          }

          if ( origin[1] === 'center' ) {
            point[1] += me.height / 2;
          } else if ( origin[1] === 'bottom' ) {
            point[1] += me.height;
          }

        }
        me._transformOrigin = me.transformOrigin;
        me._transformPoint = point;
      }

      return point;
    },

    /**
     * Returns the scale of the object based on it's current `z` value relative to a `z` of 0.
     * @type {function}
     * @returns {number}
     * @default
     */
    getZScale: function(){ return ( ( this.z + 1 ) / 1 ); },

    /**
     * Returns the object's current `x` and `y` coordinates relative to the parent.
     * @type {function}
     * @params {!object} - Parent object to pull parent coordinates
     * @returns {array}
     * @default
     */
    getCoords: function(offset,zScale){
      var x = this.x,
          y = this.y;

      offset = offset || ( this.parent && this.parent.getCoords ? this.parent.getCoords() : false );

      if ( offset ) {
        x += offset[0];
        y += offset[1];
      }

      if ( zScale ) {
        x *= zScale;
        y *= zScale;
      }

      return [x,y];
    },

    /**
     * Transforms the canvas context based on the object's properties.
     * @type {function}
     * @param ctx - 2d canvas context
     * @params {!object} hasCoords - Coordinates to use, or if coordinates should be relative to this and scaled.
     * @params {!number} scale - Scale of object
     * @returns {this}
     * @default
     */
    transform: function(ctx, offset, zScale) {
      var coords = this.getCoords(offset, zScale),
          scale = this.scale * ( zScale !== undefined ? zScale * this.getZScale() : 1 ),
          transformPoint;

      if ( scale <= 0 || Number.isNaN(scale) ) { return false; }

      if ( scale !== 1 || (this.rotation % 360) !== 0 ) {
        transformPoint = this.getTransformPoint();
        coords[0] += transformPoint[0];
        coords[1] += transformPoint[1];
        ctx.translate(coords[0],coords[1]);
        if ( this.rotation ) { ctx.rotate(this.rotation * rad); }
        ctx.scale(scale,scale);
        ctx.translate(-coords[0],-coords[1]);
      }

      return true;
    },

    /**
     * Create a clone of this object
     * @type {function}
     * @params {!object} - Properties to include on the clone
     * @returns {cloned object}
     * @default
     */
    clone: clone

  };

