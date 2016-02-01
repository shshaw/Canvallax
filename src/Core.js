/**
 * Core class used for most Canvallax objects
 * @class Core
 * @type {!number}
 * @default
 */

var Core = util.Core = createClass({

    /**
     * `x` coordinate (horizontal offset from the left)
     * @type {!number}
     * @default
     */
    x: 0,

    /**
     * `y` coordinate (vertical offset from the top)
     * @type {!number}
     * @default
     */
    y: 0,

    /**
     * `z` coordinate (distance from the camera)
     * @type {!number}
     * @default
     */
    z: 0,

    /**
     * Amount of rotation in degrees (typically 0-360), affected by the `transformOrigin` property
     * @type {!number} degrees
     * @default
     */
    rotation: 0,

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
     * @param {object} parent - Parent object, usually a Canvallax instance
     * @default
     */
    preRender: null,

    /**
     * Callback function to render
     * @type {!function}
     * @param ctx - 2d canvas context
     * @param {object} parent - Parent object, usually a Canvallax instance
     * @default
     */
    _render: null,

    /**
     * Callback function triggered after rendering
     * @type {!function}
     * @param ctx - 2d canvas context
     * @param {object} parent - Parent object, usually a Canvallax instance
     * @default
     */
    postRender: null,

    /**
     * Main rendering function
     * @type {!function}
     * @param ctx - 2d canvas context
     * @param {object} parent - Parent object, usually a Canvallax instance
     * @returns {this}
     * @default
     */
    render: function(ctx,parent) {

      var pos, i, len;

      ctx = ctx || this.ctx;
      parent = parent || this.parent || this;

      if ( !ctx ) { return; }

      if ( this.tracker ) {
        pos = this.tracker.render(this,parent);
        // Allow tracker to set many properties.
        for ( var key in pos ) {
          if ( pos.hasOwnProperty(key) ) { this[key] = pos[key]; }
        }
      }

      ctx.save();
      if ( this.preRender ) { this.preRender(ctx,parent); }
      if ( this._render ) { this._render(ctx,parent); }
      if ( this.children && this.children.length ) {
        len = this.children.length;
        i = 0;
        for ( ; i < len; i++ ){
          this.children[i].render(ctx,this);
        }
      }
      if ( this.postRender ) { this.postRender(ctx,parent); }
      ctx.restore();

      return this;
    },

    /**
     * Callback function triggered when an intance is first created.
     * Receives all arguments passed to the Object's creation function.
     * @type {function}
     * @default
     */
    init: noop,

    /**
     * Where the element's transforms will occur
     * Array of coordinates  two keywords separated by a space.
     * The default of `'center center'` means that `rotation` and `scale` transforms will occur from the center.
     * The first keyword can be `left`, `center` or `right` cooresponding to the appropriate horizontal position.
     * The second keyword can be `top`, `center` or `bottom` cooresponding to the appropriate vertical position.
     * @type {{String|Array}}
     * @default
     */
    transformOrigin: 'center center',

    /**
     * Get the coordinates where the transforms should occur based on the transform origin.
     * @type {{String|Array}}
     * @returns {array} Array of x & y coordinates, relative to the object's top left.
     * @default
     */
    getTransformPoint: function(){
      var el = this,
          point = el._transformPoint,
          origin;

      // Cache values to avoid recalculation
      if ( !point || el._transformOrigin !== el.transformOrigin ) {

        if ( Array.isArray(el.transformOrigin) ) {
          point = el.transformOrigin;
        } else {

          point = [0,0];

          origin = el.transformOrigin.split(' ');

          if ( (!el.width && !el.height) && !el.radius ) { return point; }

          if ( origin[0] === 'center' ) {
            point[0] += ( el.width ? el.width / 2 : el.radius );
          } else if ( origin[0] === 'right' ) {
            point[0] += ( el.width ? el.width : el.radius * 2 );
          }

          if ( origin[1] === 'center' ) {
            point[1] += ( el.height ? el.height / 2 : el.radius );
          } else if ( origin[1] === 'bottom' ) {
            point[1] += ( el.height ? el.height : el.radius * 2 );
          }

        }
        el._transformOrigin = el.transformOrigin;
        el._transformPoint = point;
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
    getCoords: function(parent){
      var x = this.x,
          y = this.y,
          zScale;

      if ( parent ) {
        zScale = this.getZScale();
        x += ( parent.x * zScale );
        y += ( parent.y * zScale );
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
    transform: function(ctx, hasCoords, scale) {

      var el = this,
          coords = ( hasCoords ? hasCoords : el.getCoords() ),
          x = coords ? coords[0] : el.x,
          y = coords ? coords[1] : el.y,
          transformPoint;

      scale = ( scale === undefined ? el.scale : scale );

      if ( scale <= 0 || scale === undefined ) { return false; }

      if ( !hasCoords ) {
        scale *= el.getZScale();
        x *= scale;
        y *= scale;
      }

      if ( scale !== 1 || (el.rotation % 360) !== 0 ) {
        transformPoint = el.getTransformPoint();
        x += transformPoint[0];
        y += transformPoint[1];
        ctx.translate(x,y);
        if ( el.rotation ) { ctx.rotate(el.rotation * rad); }
        ctx.scale(scale,scale);
        ctx.translate(-x,-y);
      }


      return el;
    },

    /**
     * Create a clone of this object
     * @type {function}
     * @params {!object} - Properties to include on the clone
     * @returns {cloned object}
     * @default
     */
    clone: clone
    // Create a copy with all the same properties

  });
