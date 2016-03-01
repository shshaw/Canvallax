var _transformAttr = ['width','height'];

/**
 * Core properties used for most Canvallax objects
 *
 * @mixin core
 *
 * @property {number} x=0 - `x` coordinate, horizontal offset from the left
 * @property {number} y=0 - `y` coordinate, vertical offset from the top
 * @property {number} z=1 - `z` coordinate, scale relative to the parent. Affects the final rendered coordinates.
 * @property {number} opacity=1 - Object's opacity with `1` as fully opaque and `0` as fully transparent, with rendering skipped. Relative to the parent's opacity.
 * @property {number} scale=1 - How large the object should be rendered relative to its natural size, from the `transformOrigin` property]
 * @property {number} rotation=0 - Amount of rotation in degrees from the `transformOrigin` property
 *
 * @property {core.preRender} preRender - Callback before the object is rendered.
 * @property {core._render} _render - Object specific callback to render to the context.
 * @property {core.postRender} postRender - Callback after the object is rendered.
 *
 * @todo Simplify `z` to a scale-like value, positive integer with 0 being the minimum.
 * @todo Make `z` relative to parent's `z` to allow for better camera movements into and out of a scene.
 */

var core = {

    x: 0,
    y: 0,
    z: 1,
    opacity: 1,
    scale: 1,
    rotation: 0,

    /**
     * Main rendering function that calls all callbacks, gets tracker values, sets the context alpha & blend, and renders children, if any.
     * @type {function}
     * @returns {this}
     *
     * @param {CanvasRenderingContext2D} ctx - 2d canvas context
     * @param {canvallax.Scene|canvallax.Group=} parent - Parent object, usually a `{@link canvallax.Scene}`
     *
     * @memberof! core
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
        for ( key in pos ) {
          if ( pos.hasOwnProperty(key) ) { me[key] = pos[key]; }
        }
      }

      o = ctx.globalAlpha * me.opacity;
      if ( o <= 0 ) { return me; }

      ctx.save();
      ctx.globalAlpha = o;
      if ( me.blend ) { ctx.globalCompositeOperation = me.blend; }
      if ( me.clearFrames && me.clear ) { me.clear(ctx,parent); }
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
     * @type {function}
     * @memberof! core
     */
    getCanvas: function(){
      return this.canvas || ( this.parent ? this.parent.getCanvas() : false );
    },

    /**
     * Where the object's transforms will occur, either as an array of coordinates or two keywords separated by a space.
     *
     * The default of `'center center'` means that `rotation` and `scale` transforms will be relative to the center of the object's `width` and `height`.
     *
     * As a string, the first keyword can be `left`, `center` or `right` cooresponding to the appropriate horizontal position, and the second keyword can be `top`, `center` or `bottom` cooresponding to the appropriate vertical position.
     *
     * @type {string|number[]}
     * @default
     * @memberof! core
     */
    transformOrigin: 'center center',

    /**
     * Calculate the transform coordinates based on width/height.
     * @private
     */
    calcTransformPoint: function() {
      var me = this,
          point = [0,0],
          origin = me.transformOrigin.split(' '),
          i = 0,
          val, multiplier;

      for ( ; i < 2; i++) {
        val = origin[i];
        multiplier = (
            val === 'center' ? 0.5 :
            val === 'right' || val === 'bottom' ? 1 :
            val.indexOf('%') ? parseFloat(val)/100 :
            0
          );

        if ( multiplier ) { point[i] = me[_transformAttr[i]] * multiplier; }
      }

      return point;
    },

    /**
     * Get the coordinates where the transforms should occur based on the transform origin.
     * @private
     * @type {function}
     * @returns {array} - Array of `x` & `y` coordinates.
     * @memberof! core
     */
    getTransformPoint: function(force){
      var me = this,
          point = me._transformPoint,
          origin = me.transformOrigin,
          isArr = Array.isArray(origin);

      // If this is a `canvallax.Group` with a parent `canvallax.Scene` and no exact width & height or array of transformOrigin coordinates, then render relative to the parent scene's coordinates
      if ( !isArr && !me.width && !me.height && this.length && this.parent ) { return me.parent.getTransformPoint(); }

      // Cache values to avoid recalculation
      if ( force || (!point || me._transformOrigin !== origin) ) {
        point = ( isArr ? origin : me.calcTransformPoint() );
        me._transformOrigin = me.transformOrigin;
        me._transformPoint = point;
      }

      return point;
    },

    /**
     * Returns the object's current `x` and `y` coordinates relative to the parent.
     * @private
     * @type {function}
     * @param {array=} offset - Array of coordinates to offset the return coordinates
     * @param {number=} relativeZ - `z`, typically of the child, value to base the coordinate scaling on.
     * @returns {array}
     * @memberof! core
     */
    getCoords: function(offset,relativeZ){
      var x = this.x,
          y = this.y;

      offset = offset || ( this.parent && this.parent.getCoords ? this.parent.getCoords() : false );

      if ( offset ) {
        x += offset[0];
        y += offset[1];
      }

      if ( relativeZ ) {
        x *= relativeZ;
        y *= relativeZ;
      }

      return [x,y];
    },

    /**
     * Transforms the canvas context based on the object's properties.
     * @private
     * @type {function}
     * @param {CanvasRenderingContext2D} ctx - 2d canvas context
     * @param {array} offset - Array of coordinates to offset the return coordinates
     * @param {number=} relativeZ - `z` value to base the scaling on, typically of the child.
     * @returns {boolean}
     * @memberof! core
     */
    transform: function(ctx, offset, relativeZ) {
      var coords = this.getCoords(offset, relativeZ),
          scale = this.scale * ( relativeZ !== undefined ? (this.z * relativeZ) : 1 ),
          transformPoint;

      if ( scale <= 0 ) { return false; }

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
     * Element or custom function to clip object to for masking effects.
     * @name clip
     * @type {function|canvallax.Element}
     * @memberof! core
     * @example
     * // circular image!
     * var circle = canvallax.Ellipse({ width: 100, height: 100 }),
     *      image = canvallax.Image({ src: 'myimage.jpg', clip: circle });
     */

    /**
     * Clip to element or with custom function
     * @private
     * @type {function}
     * @param {CanvasRenderingContext2D} ctx - 2d canvas context
     * @param {canvallax.Scene|canvallax.Group} parent - Parent object, usually a `{@link canvallax.Scene}`
     * @memberof! core
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

    /**
     * Create a clone of this object
     * @borrows clone as clone
     * @method
     * @param {object=} options - Properties to be applied to the cloned object
     * @memberof! core
     */
    clone: clone

    /**
     * Callback function triggered when an intance is first created.
     * Receives all arguments passed to the Object's creation function.
     * @callback init
     * @type {function}
     * @memberof! core
     */

    /**
     * Tracker instance to tie coordinates to scroll, pointer, etc, instead of manually controlling the `x` and `y`
     * @name tracker
     * @type {canvallax.Tracker}
     * @memberof! core
     */

    /**
     * Callback before the object is rendered. Ideal for updating properties before object is drawn to canvas.
     * @callback preRender
     * @param {CanvasRenderingContext2D} ctx - 2d canvas context
     * @param {canvallax.Scene|canvallax.Group} parent - Parent object, usually a `{@link canvallax.Scene}`
     * @memberof! core
     */

    /**
     * Object specific rendering callback
     * @callback _render
     * @param {CanvasRenderingContext2D} ctx - 2d canvas context
     * @param {canvallax.Scene|canvallax.Group} parent - Parent object, usually a `{@link canvallax.Scene}`
     * @memberof! core
     */

    /**
     * Callback after the object is rendered.
     * @callback postRender
     * @param {CanvasRenderingContext2D} ctx - 2d canvas context
     * @param {canvallax.Scene|canvallax.Group} parent - Parent object, usually a `{@link canvallax.Scene}`
     * @memberof! core
     */

  };

