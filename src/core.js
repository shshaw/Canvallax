/**
 * Core properties used for most Canvallax objects
 * @default
 */
var core =
  /** @lends canvallax.Group.prototype */
  /** @lends canvallax.Scene.prototype */
  /** @lends canvallax.Element.prototype */
  {

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
     * How large the element should be rendered relative to its natural size.
     * Scaling will occur from the `transformOrigin` property and is in addition to the `z` property's scaling.
     * @type {!number}
     * @default
     */
    scale: 1,

    /**
     * Tracker instance to tie coordinates to scroll, pointer, etc, instead of manually controlling the `x` and `y`
     * @type {!function}
     * @default
     */
    tracker: null,

    /**
     * Callback function triggered before rendering
     * @type {!function}
     * @param ctx - 2d canvas context
     * @param {object} parent - Parent object, usually a Canvallax scene
     * @default
     */
    preRender: null,

    /**
     * Callback function for object specific rendering
     * @type {!function}
     * @param ctx - 2d canvas context
     * @param {object} parent - Parent object, usually a Canvallax scene
     * @default
     */
    _render: null,

    /**
     * Callback function triggered after rendering
     * @type {!function}
     * @param ctx - 2d canvas context
     * @param {object} parent - Parent object, usually a Canvallax scene
     * @default
     */
    postRender: null,

    /**
     * Main rendering function
     * @type {!function}
     * @param ctx - 2d canvas context
     * @param {object} parent - Parent object, usually a Canvallax scene
     * @returns {this}
     * @default
     */
    render: function(ctx,parent) {

      var me = this,
          pos, i, len;

      ctx = ctx || me.ctx;
      parent = parent || me.parent;

      if ( !ctx ) { return; }

      if ( me.tracker ) {
        pos = me.tracker.render(me,parent);
        // Allow tracker to set many properties.
        if ( pos ) {
          for ( var key in pos ) {
            if ( pos.hasOwnProperty(key) ) { me[key] = pos[key]; }
          }
        }
      }

      ctx.save();
      if ( me.clearFrames ) { ctx.clearRect(me.x, me.y, me.width, me.height); }
      if ( me.preRender ) { me.preRender(ctx,parent); }
      if ( me._render ) { me._render(ctx,parent); }
      if ( me.length > 0 ) {
        len = me.length;
        i = 0;
        for ( ; i < len; i++ ){ me[i].render(ctx,me); }
      }
      if ( me.postRender ) { me.postRender(ctx,parent); }
      ctx.restore();

      return me;
    },

    /**
     * Callback function triggered when an intance is first created.
     * Receives all arguments passed to the Object's creation function.
     * @type {function}
     * @default
     */
    init: null,

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

          if ( (!me.width && !me.height) && !me.radius ) { return point; }

          if ( origin[0] === 'center' ) {
            point[0] += ( me.width ? me.width / 2 : me.radius );
          } else if ( origin[0] === 'right' ) {
            point[0] += ( me.width ? me.width : me.radius * 2 );
          }

          if ( origin[1] === 'center' ) {
            point[1] += ( me.height ? me.height / 2 : me.radius );
          } else if ( origin[1] === 'bottom' ) {
            point[1] += ( me.height ? me.height : me.radius * 2 );
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

      return this;
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
