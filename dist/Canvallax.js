/*! canvallax v2.0.0 ( built 2016-04-22 ) https://github.com/shshaw/Canvallax.js @preserve */

(function(win){

  'use strict';

  var /**
       * Canvallax object containing all classes & methods
       * @namespace {object} canvallax
       * @public
       */
      canvallax = win.canvallax = win.canvallax || {},

      doc = document,
      root = doc.documentElement,
      body = doc.body,
      arr = Array.prototype,
      // requestAnimationFrame polyfill
      requestAnimationFrame = win.requestAnimationFrame || win.webkitRequestAnimationFrame || win.mozRequestAnimationFrame || win.msRequestAnimationFrame || function(callback){ win.setTimeout(callback, 20); }; // IE Fallback

  // Exit if browser does not support canvas
  if ( !win.CanvasRenderingContext2D ) { return false; }

  // Shorthand name
  win.clx = canvallax;

  var rad = Math.PI / 180,
      twoPI = 2 * Math.PI,
      noop = function(){},
      fnType = typeof noop,
      isFunction = function(fn){ return typeof fn === fnType; };

////////////////////////////////////////

  /**
   * Extend an object with properties from other objects.
   *
   * If only one argument is provided, the `target` is assumed to be `this` in the current context.
   *
   * @type method
   * @memberof canvallax
   *
   * @param {object} target - Target object to receive properties from the other objects.
   * @param {...object} - Objects to merge
   *
   * @returns {object} - Object with merged properties
   */

  function extend() {

    var a = arguments,
        target = a[0] || {},
        length = a.length,
        i = 1,
        key;

    if ( length === 1 ) {
      target = this;
      i = 0;
    }

    for ( ; i < length; i++ ) {
      if ( a[i] ) {
        for ( key in a[i] ) {
          if ( a[i].hasOwnProperty(key) ) { target[key] = a[i][key]; }
        }
      }
    }

    return target;
  }

  canvallax.extend = extend;

////////////////////////////////////////

  /**
   * Create a clone of an object or Class
   *
   * @type method
   * @memberof canvallax
   *
   * @param {!object} target - Original to clone. If not included, will default to `this`
   * @param {!object} properties - Properties to include on the clone
   *
   * @returns {object} - Cloned object containing extra properties from the provided object.
   */

  function clone(target,properties){
    if ( arguments.length <= 1 ) {
      properties = target;
      target = this;
    }
    var props = extend({}, target, properties);
    return new target.constructor(props);
  }

  canvallax.clone = clone;

////////////////////////////////////////


  // Gets around using `.apply` for creating new instances of a class, adapted from http://stackoverflow.com/a/1608546/1012919
  function construct(constructor, args) {
    function C(){ return constructor.apply(this, args); }
    C.prototype = constructor.prototype;
    return new C();
  }

  /**
   * Create a new Class with the properties provided
   *
   * @type method
   * @memberof canvallax
   *
   * @param {!object} target - Original to clone. If not included, will default to `this`
   * @param {!object} properties - Properties to include on the clone
   *
   * @returns {object} - Cloned object containing extra properties from the provided object.
   */

  function createClass(){

    function C(options) {
      var me = this,
          len = arguments.length,
          args,
          i = 0;

      // Ensure class is always created as `new Class` even if `new` isn't used.
      if ( !(me instanceof C) ) {
        args = new Array(len);
        for(; i < len; i++) { args[i] = arguments[i]; }
        return construct(C,args);
      }

      // If
      if ( len === 1 ) { extend(me,options); }

      me.fn = C.fn;

      if ( me.init ) { me.init.apply(me,arguments); }
      if ( me.playing && me.play ) { me.play(); }

      return me;
    }

    var len = arguments.length,
        args = new Array(len),
        i = 0,
        parents = [],
        fn = {
          init: noop,
          extend: extend,
          clone: clone
        };

    for(; i < len; i++) {
      args[i] = arguments[i];
      if ( args[i].fn ) {
        //console.log(args[i].fn.type);
        parents.push(args[i]);
        args[i] = args[i].fn;
      }
    }

/*
    if ( len > 1 && args[0].prototype ) {
      parent = args[0];
      args[0] = args[0].prototype;
      fn._parent = parent;
    }
*/

    args.unshift(fn);
    extend.apply(fn, args);
    fn._parents = parents;

    fn.constructor = C;
    C.fn = C.prototype = fn;

    return C;
  }

  canvallax.createClass = createClass;

/**
 * Array-like properties used for some Canvallax classes
 *
 * @mixin arrayLike
 */

var arrayLike = {
      length: 0,
      indexOf: arr.indexOf,
      push: arr.push,
      splice: arr.splice,
      sort: arr.sort,

      /**
       * Add an element, group or array of elements to collection
       *
       * @param {...object|object[]} element - Element or array of elements to be added
       * @returns {this}
       * @memberof! arrayLike
       */
      add: function(el){
        var me = this,
            elements = ( el && el.length > -1 && Array.isArray(el) ? el : arguments ),
            len = elements.length,
            i = 0;

        for ( ; i < len; i++ ) {
          // Prevent adding `false` or `undefined` elements
          if ( elements[i] ) { me.push(elements[i]); }
        }

        return me;
      },

      /**
       * Run a function for each item in collection
       * @param {function} callback - Callback function run for each item
       * @param thisArg - Overrride `this` in the callback function
       * @returns {this}
       * @memberof! arrayLike
       */
      each: function(callback,thisArg){
        var me = this,
            length = this.length,
            i = 0,
            t;

        for ( ; i < length; i++ ) {
          t = thisArg || me[i];
          if ( callback.call( t, me[ i ], i ) === false ) { break; }
        }

        return this;
      },

      /**
       * Remove an element from collection
       * @param {object} element - Element to be removed
       * @returns {this}
       * @memberof! arrayLike
       */
      remove: function(element){
        var index = this.indexOf(element);
        if ( index > -1 ) { this.splice(index, 1); }
        return this;
      }
    };

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
 * @todo Remove `parent` property from elements, make it relative to what is calling the render.
 */

var core = {

    x: 0,
    y: 0,
    z: 1,
    opacity: 1,
    scale: 1,
    rotation: 0,

    /**
     * Add object to a parent
     * @type {function}
     * @param {...object|object[]} element - Parent or array of parents for the object to be added to
     * @returns {this}
     * @memberof! core
     *
     * @example
     * var scene = canvallax.Scene(),
     *     rect = canvallax.Rectangle();
     *
     * rect.addTo(scene);
     */
    addTo: function(el){
      var elements = ( el && el.length > -1 && Array.isArray(el) ? el : arguments ),
          len = elements.length,
          i = 0;

      for ( ; i < len; i++ ) {
        if ( elements[i] && elements[i].add ) { elements[i].add(this); }
      }

      return this;
    },

    /**
     * Main rendering function that calls all callbacks, sets the context alpha & blend, and renders children, if any.
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
          len = me.length,
          i = 0,
          pos, key, o;

      parent = parent || me.parent;

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
     * @param {boolean} force - force an update of the coordinate cache.
     * @returns {array} - Array of `x` & `y` coordinates.
     * @memberof! core
     */
    getTransformPoint: function(force){
      var me = this,
          point = me._transformPoint,
          origin = me.transformOrigin,
          isArr = Array.isArray(origin);

      // If this is a `canvallax.Group` with a parent `canvallax.Scene` and no exact width & height or array of transformOrigin coordinates, then render relative to the parent scene's coordinates
      if ( !isArr && !me.width && !me.height && me.length && me.parent ) { return me.parent.getTransformPoint(); }

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
     * @param {number=} coordScale - Scale of the coordinates, typically the child's `z`
     * @returns {array}
     * @memberof! core
     */
    getCoords: function(coordScale){
      var x = this.x,
          y = this.y,
          offset = this.offset,
          parent = this.parent,
          parentOffset = !this.fixed && parent && parent.getCoords ? parent.getCoords() : false;

      if ( parentOffset ) {
        x += parentOffset[0];
        y += parentOffset[1];
      }

      if ( coordScale !== undefined ) {
        x *= coordScale;
        y *= coordScale;
      }

      if ( offset ) {
        x += offset.x || 0;
        y += offset.y || 0;
      }

      return [x,y];
    },

    /**
     * Transforms the canvas context based on the object's properties.
     * @private
     * @type {function}
     * @param {CanvasRenderingContext2D} ctx - 2d canvas context
     * @param {number=} relativeZ - `z` value to base the scaling on, typically of the child.
     * @returns {boolean}
     * @memberof! core
     */
    transform: function(ctx, relativeZ) {
      var scale = this.scale * ( relativeZ !== undefined ? relativeZ : 1 ) * this.z,
          coords, transformPoint;

      if ( scale <= 0 ) { return false; }

      if ( scale !== 1 || (this.rotation % 360) !== 0 ) {
        coords = this.getCoords(relativeZ);
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

    /**
     * Callback function triggered when an intance is first created.
     * Receives all arguments passed to the Object's creation function.
     * @callback init
     * @type {function}
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



/**
 * An array-like object that groups all `requestAnimationFrame` calls into one.
 */

var animations = extend({},arrayLike,{

  animate: function(){

    var len = animations.length,
        i = 0,
        el;

    if ( !animations.playing || len === 0  ) { animations.stop(); return; }
    for (; i < len; i++) {
      el = animations[i];
      if ( el && el.playing && ( el.render && !el.render() )) { el.stop(); }
    }

    animations.frame = requestAnimationFrame(animations.animate);

  },

  play: function(){
    animations.frame = animations.frame || requestAnimationFrame(animations.animate);
    animations.playing = true;
  },

  stop: function(){
    animations.playing = false;
    animations.frame = null;
  },

  kill: function(){
    animations.stop();
    return animations.splice(0);
  }
});

canvallax.animations = animations;


/**
 *
 * Shared properties for classes that need to re-render every `requestAnimationFrame`.
 *
 * @mixin animateCore
 *
 */

var animateCore = {

    /**
     * Play the animation by adding it to the main `requestAnimationFrame` call.
     *
     * @method
     * @memberof! animateCore
     */

    play: function(){
      this.playing = true;

      var index = animations.indexOf(this);
      if ( index == -1 ) { animations.push(this); }
      animations.play();
      return this;
    },

    /**
     * Stop the animation by removing it from the main `requestAnimationFrame` call.
     *
     * @method
     * @memberof! animateCore
     */
    stop: function(){
      this.playing = false;
      var index = animations.indexOf(this);
      if ( index > -1 ) { animations.splice(index, 1); }
      return this;
    }

  };

/**
 * Easing functions for animations, adapted from {@link http://greweb.me/2012/02/bezier-curve-based-easing-functions-from-concept-to-implementation/}
 *
 * @memberof! canvallax
 *
 * @property {function} linear - Linear easing
 * @property {function} inQuad - Quadratic easing in
 * @property {function} outQuad - Quadratic easing out
 * @property {function} inOutQuad - Quadratic easing in & out, the default animation easing.
 * @property {function} inCubic - Cubic easing in
 * @property {function} outCubic - Cubic easing out
 * @property {function} inOutCubic - Cubic easing in & out
 * @property {function} inQuart - Quart easing in
 * @property {function} outQuart - Quart easing out
 * @property {function} inOutQuart - Quart easing in & out
 *
 */

canvallax.ease = {

  linear: function(t){ return t; },

  inQuad: function(t){ return t*t; },
  outQuad: function(t){ return t*(2-t); },
  inOutQuad: function(t){ return t<0.5 ? 2*t*t : -1+(4-2*t)*t; },

  inCubic: function(t){ return t*t*t; },
  outCubic: function(t){ return (--t)*t*t+1; },
  inOutCubic: function(t){ return t<0.5 ? 4*t*t*t : (t-1)*(2*t-2)*(2*t-2)+1; },

  inQuart: function (t){ return t*t*t*t; },
  outQuart: function (t){ return 1-(--t)*t*t*t; },
  inOutQuart: function(t){ return t<0.5 ? 8*t*t*t*t : 1-8*(--t)*t*t*t; }

};

/**
 * Animate an object's properties to new values
 * @class
 * @returns {object} Animate instance
 * @memberof canvallax
 * @mixes animateCore
 *
 * @param {object} target - Object to animate.
 * @param {number} duration - Duration in seconds.
 * @param {object} properties - Properties &amp; values to animate.
 * @param {object} options - Animation specific options, applied to the animation as properties.
 *
 * @param {number} options.repeat=0 - Number of times to repeat the animation. -1 is infinite
 * @param {boolean} options.yoyo - Reverse animation on repeat
 * @param {function} options.ease=canvallax.ease.inOutQuad - Easing to use from {@link canvallax.ease}
 * @param {boolean} options.reversed - Play animation backwards
 * @param {canvallax.Animate.onStart} options.onStart - Callback for when animation starts
 * @param {canvallax.Animate.onUpdate} options.onUpdate - Callback for every `requestAnimationFrame` render
 * @param {canvallax.Animate.onComplete} options.onComplete - Callback for when animation completes
 *
 * @example
 * // Make a square spin forever
 * var redSquare = canvallax.Rectangle({ fill: '#F00', width: 100, height: 100 });
 * canvallax.Animate(redSquare, 1, { rotation: 360 },{ ease: canvallax.ease.linear, repeat: -1 });
 *
 */

function Animate(target,duration,to,opts){

  if ( !(this instanceof Animate) ) { return new Animate(target,duration,to,opts); }

  var me = this,
      key;

  extend(me,opts);

  me.target = target;
  me.to = to;

  if ( !me.from ) {
    me.from = {};
    for (key in to){ me.from[key] = target[key]; }
  }

  me.duration(duration);
  //me.render = me.render.bind(me);
  me.restart();

  return me;

}

Animate.fn = Animate.prototype = extend({},animateCore, /** @lends Animate# */{

  repeat: 0,
  ease: canvallax.ease.inOutQuad,

  /**
   * Get or set the animation's duration
   *
   * @method
   * @memberof! canvallax.Animate
   *
   * @param {number} Set the duration in seconds, or retreive the current duration
   *
   */
  duration: function(dur){
    if ( dur ) { this._d = dur * 1000; }
    else { return this._d / 1000; }
  },

  /**
   * Start the animation from the beginning.
   *
   * @method
   * @memberof! canvallax.Animate
   */
  restart: function(isRepeat){
    // Animation start time.

    var d = ( isRepeat ? this.repeatDelay : this.delay );

    this._s = Date.now() + (d ? d * 1000 : 0);
    this._p = 0;
    if ( this.onStart ) { this.onStart(); }
    this.play();
  },

  pause: function(){
    // Save the time the animation was paused to calculate elapsed time later.
    this._p = this._p || Date.now();
    this.playing = false;
  },

  /**
   * Reverse the animation & restart.
   *
   * @method
   * @memberof! canvallax.Animate
   */
  reverse: function(){
    this.reversed = !this.reversed;
    this.restart();
  },

  /** @private */
  render: function(){

    var me = this,
        now = Date.now(),
        progress, delta, key;

    if ( !me.playing ) { return; }

    // If animation was paused, add the elapsed time to the start time.
    if ( me._p ) {
      me._s += ( now - me._p );
      me._p = 0;
    }

    if ( now < me._s ) { return true; }

    progress = ( now - me._s ) / me._d;
    if ( progress > 1 ) { progress = 1; }

    delta = me.ease(me.reversed ? 1 - progress : progress );
    for (key in me.to){
      me.target[key] = me.from[key] + (me.to[key] - me.from[key]) * delta;
    }

    if ( me.onUpdate && me.onUpdate() === false ) { return false; }

    if ( progress === 1 ) {
      if ( me.onComplete ) { me.onComplete(); }
      if ( me.yoyo ) { me.reversed = !me.reversed; }
      if ( me.repeat === 0) {
        return false;
      } else {
        if ( me.repeat > 0 ) { me.repeat--; }
        me.restart(true);
      }
    }

    return true;

  }

});

/**
 * Callback for when animation starts, triggered each time an animation repeats.
 * @callback onStart
 * @memberof! canvallax.Animate
 */

/**
 * Callback for when animation values are updated each `requestAnimationFrame`.
 *
 * If this callback returns `false`, the animation will stop.
 *
 * Useful for rendering a {@link canvallax.Scene} only while an element is animating.
 *
 * @callback onUpdate
 * @memberof! canvallax.Animate
 * @returns {boolean?}
 *
 * @example
 * // Make a square spin
 * var scene = canvallax.Scene({ playing: false }), // Scene will not automatically render
 *     redSquare = canvallax.Rectangle({ fill: '#F00', width: 100, height: 100 });
 * canvallax.Animate(redSquare, 1, { rotation: 360 },{ onUpdate: scene.render }); // Only update the scene while element is rendering
 *
 */

/**
 * Callback for when animation reaches the end, triggered each time an animation repeats.
 *
 * @callback onComplete
 * @memberof! canvallax.Animate
 */

canvallax.Animate = Animate;

/**
 * Animate an object's properties to new values
 *
 * @class canvallax.Animate.from
 * @memberof canvallax.Animate
 *
 * @param {object} target - Object to animate
 * @param {number} duration - Duration in seconds
 * @param {object} fromProperties - Properties &amp; values to animate from
 * @param {object} options - Animation specific options
 *
 */
Animate.from = function(target,duration,from,options){
  var to = {};
  for (var key in from){ to[key] = target[key]; }
  options = options || {};
  options.from = from;
  return new Animate(target,duration,to,options);
};

/**
 * Animate an object's properties to new values
 *
 * @class canvallax.Animate.fromTo
 * @memberof canvallax.Animate
 *
 * @param {object} target - Object to animate
 * @param {number} duration - Duration in seconds
 * @param {object} fromProperties - Properties &amp; values to animate from
 * @param {object} toProperties - Properties &amp; values to animate to
 * @param {object} options - Animation specific options
 *
 */
Animate.fromTo = function(target,duration,from,to,options){
  options = options || {};
  options.from = from;
  return new Animate(target,duration,to,options);
};

/**
 * Animate an object's properties to new values. See {@link canvallax.Animate} for more details.
 *
 * @method to
 * @extends canvallax.Animate
 * @memberof! core
 *
 * @param {number} duration - Duration in seconds
 * @param {object} toProperties - Properties &amp; values to animate to
 * @param {object} options - [Animation specific options]{@link canvallax.Animate}
 *
 * @example
 * // Make a square spin forever
 * var redSquare = canvallax.Rectangle({ fill: '#F00', width: 100, height: 100 });
 * redSquare.to(1, { rotation: 360 },{ ease: canvallax.ease.linear, repeat: -1 });
 *
 */
core.to = core.animate = function(d,t,o){ return new Animate(this,d,t,o); };

/**
 * Animate an object's properties from values. See {@link canvallax.Animate.from} for more details.
 *
 * @method from
 * @borrows canvallax.Animate.from
 * @memberof! core
 *
 * @param {number} duration - Duration in seconds
 * @param {object} fromProperties - Properties &amp; values to animate from
 * @param {object} options - [Animation specific options]{@link canvallax.Animate}
 *
 */
core.from = function(d,f,o){ return new Animate.from(this,d,f,o); };

/**
 * Animate an object's properties from values to another set of values. See {@link canvallax.Animate.fromTo} for more details.
 *
 * @method fromTo
 * @extends canvallax.Animate.fromTo
 * @memberof! core
 * @instance
 *
 * @param {number} duration - Duration in seconds
 * @param {object} fromProperties - Properties &amp; values to animate from
 * @param {object} toProperties - Properties &amp; values to animate to
 * @param {object} options - [Animation specific options]{@link canvallax.Animate}
 *
 */
core.fromTo = function(d,f,t,o){ return new Animate.fromTo(this,d,f,t,o); };

function zIndexSort(a,b){
  var sort = ( a.zIndex === b.zIndex ? 0 : a.zIndex < b.zIndex ? -1 : 1 );
  return sort || ( a.z === b.z ? 0 : a.z < b.z ? -1 : 1 );
}

/**
 * Control a group of element's positioning and transforms together
 *
 * @class An array-like collection of canvallax elements.
 * @mixes core
 * @memberof canvallax
 *
 */
canvallax.Group = createClass(core,arrayLike,
  /** @lends canvallax.Group# */
  {
    type: 'group',

    /**
     * Add an element, group or array of elements to collection
     *
     * @param {...object|object[]} element - Element or array of elements to be added
     * @returns {this}
     */
    add: function(el){
      var me = this,
          elements = ( el && el.length > -1 && Array.isArray(el) ? el : arguments ),
          len = elements.length,
          i = 0;

      for ( ; i < len; i++ ) {
        if ( elements[i] ) { // Prevent adding `false` or `undefined` elements
          elements[i].parent = me;
          me.push(elements[i]);
        }
      }

      return me.sort(zIndexSort);
    },

    init: function(options){
      if ( options && options.children ) { this.add(options.children); }
    }

  });

/**
 * Canvallax Scenes are where elements are rendered, essentially a fancy wrapper for a `<canvas>` element.
 *
 * If you're using the default `fullscreen` setup, then you probably want these styles:
 *
 * ```css
 * .canvallax {
 *   position: fixed;
 *   top: 0;
 *   left: 0;
 *   z-index: -1;
 * }
 * ```
 *
 * @class
 * @mixes core|animateCore
 * @extends canvallax.Group
 * @memberof canvallax
 *
 * @param {object} options - Object containing properties to be applied to the new `canvallax.Scene` instance. Reference the properties below for
 *
 * @property {HTMLCanvasElement} canvas=null - `<canvas>` element the scene should be rendered on. Creates a new `<canvas>` by default
 * @property {node} parentElement=document.body - Node the `<canvas>` should be appended to upon initialization.
 * @property {string} className=null - Classes to add to the canvas, in addition to the `'canvallax'` class automatically added.
 * @property {boolean} fullscreen=true - Set the canvas width and height to the size of the window, and update on window resize.
 * @property {boolean} clearFrames=true - Should the canvas be cleared before rendering?
 * @property {number} width=null - Width of the `<canvas>`, set automatically if `fullscreen` is true or a `<canvas>` element is provided
 * @property {number} height=null - Heightof the `<canvas>`, set automatically if `fullscreen` is true or a `<canvas>` element is provided
 * @property {boolean} playing=true - If true, the scene will be re-rendered each `requestAnimationFrame`
 *
 * @example
 * // draw scene to an existing `<canvas>`.
 * var scene = canvallax.Scene({
          fullscreen: false,
 *        canvas: document.getElementById('#myCanvas')
 *      });
 *
 */

var styles = '<style>.canvallax--fullscreen { position: fixed; top: 0; left: 0; z-index: -1; }</style>';

canvallax.Scene = createClass(canvallax.Group,animateCore,
  /** @lends canvallax.Scene# */
  {

    type: 'scene',

    parentElement: body,
    className: '',

    fullscreen: true,
    includeStyles: true,

    playing: true,
    clearFrames: true,

    /**
     * Function to clear the canvas context if `clearFrames` is true.
     * @type {function}
     * @param {CanvasRenderingContext2D} ctx - 2d canvas context
     * @memberof! canvallax.Scene
     */
    clear: function(ctx){
      ctx.clearRect(0, 0, this.width, this.height);
      return this;
    },

    /**
     * Resize the `<canvas>`
     * @type {function}
     * @param {number} width
     * @param {number} height
     * @memberof! canvallax.Scene
     */
    resize: function(width,height){
      this.width = this.canvas.width = width || this.width;
      this.height = this.canvas.height = height || this.height;
      return this;
    },

    /**
     * Resize the `<canvas>` to fit the full `window`
     * @type {function}
     * @memberof! canvallax.Scene
     */
    resizeFullscreen: function() {
      this.resize(win.innerWidth,win.innerHeight);
      return this;
    },

    /**
     * @param {Object} [options] Options object
     * @memberof! canvallax.Scene
     */
    init: function(options){
      var me = this;

      if ( !me.canvas ) {
        me.canvas = doc.createElement('canvas');
        me.parentElement.insertBefore(me.canvas, me.parentElement.firstChild);
      }

      me.ctx = me.canvas.getContext('2d');

      me.className += ' canvallax ';

      if ( me.fullscreen ) {

        if ( styles && me.includeStyles ) {
          doc.head.insertAdjacentHTML('afterbegin',styles);
          styles = null;
        }

        me.className += ' canvallax--fullscreen ';

        me.resizeFullscreen();
        win.addEventListener('resize', me.resizeFullscreen.bind(me));
      } else {
        me.resize(me.width || me.canvas.width, me.height || me.canvas.height);
      }

      me.canvas.className += me.className;

      if ( options && options.children ) { me.add(options.children); }

      me.render = me.render.bind(me,me.ctx,me);
    }

  });


/**
 * Elements are everything drawn on the Canvallax canvas. Element instances can be created either by calling `new canvallax.Element` or simply `canvallax.Element`.
 *
 * `canvallax.Element` is a class that doesn't do much by itself, but rather is the framework for the other elements like `{@link canvallax.Ellipse}` and `{@link canvallax.Image}`, and allows you to create your own custom elements.
 *
 * In order to be rendered, Canvallax Element instances need to have a `draw` function and be added to a `{@link canvallax.Scene}` or `{@link canvallax.Group}`. Most elements will also need a `fill` or `stroke` to be visible.
 *
 * @mixin
 * @mixes core
 * @memberOf canvallax
 * @returns {canvallax.Element}
 *
 * @param {object} options - Object containing properties to be applied to the new instance. Reference the properties below.
 *
 * @property {canvallax.Scene|canvallax.Group} parent=null - Parent object, automatically assigned when added to a `{@link canvallax.Scene}` or `{@link canvallax.Group}`.
 * @property {string} fill=null - Fill color
 * @property {string} stroke=null - Stroke color
 * @property {number} lineWidth=1 - Width of the stroke, if `stroke` is set.
 * @property {number} zIndex=null - Stacking order of the element, higher numbers are rendered last making them appear on top of lower zIndex elements. Defaults to `z` property
 * @property {boolean} fixed=null - If false, the element will be relative to parent, otherwise it will render fixed on the canvas.
 *
 * @example
 * var scene = canvallax.Scene(),
 *     rect = canvallax.Rectangle(); // A type of canvallax.Element
 *
 * scene.add(rect);
 */

canvallax.Element = createClass(core,
  /** @lends canvallax.Element# */
  {

    type: 'element',

    lineWidth: 1,

    _render: function(ctx,parent){
      var me = this;

      if ( !me.fixed && parent && !parent.transform(ctx, me.z) ) { return me; }
      if ( !me.transform(ctx, me.z) ) { return me; }

      if ( me.draw ) {
        ctx.beginPath();
        me.draw(ctx,me.getCoords(),parent);
      }

      if ( me.fill ) {
        if ( isFunction(me.fill) ) { me.fill(ctx,parent); }
        else {
          ctx.fillStyle = me.fill;
          ctx.fill();
        }
      }

      if ( me.stroke ) {
        if ( me.lineWidth ) { ctx.lineWidth = me.lineWidth; }

        if ( isFunction(me.stroke) ) { me.stroke(ctx,parent); }
        else {
          ctx.strokeStyle = me.stroke;
          ctx.stroke();
        }
      }
    }

    /**
     * Callback to draw the element on the context.
     * @callback draw
     * @param {CanvasRenderingContext2D} ctx - 2d canvas context
     * @param {array} coords - Array of the calculated `x` and `y` coordinates
     * @param {canvallax.Scene|canvallax.Group} parent - Parent object, usually a `{@link canvallax.Scene}`
     * @memberof! canvallax.Element
     */

  });

/**
 * Creates a custom Canvallax Element.
 * @memberOf canvallax
 * @method
 */
var createElement = canvallax.createElement = createClass.bind(null,canvallax.Element);


var kappa = 0.5522848,

    // Detect support for native canvas ellipses
    ellipseSupport = (function(){
      var canvas = document.createElement('canvas'),
          ctx = canvas.getContext('2d');

      return ( typeof ctx.ellipse === typeof function(){} );
    }()),

    drawEllipse = function(ctx,coords) {
      ctx.ellipse(coords[0] + (this.width/2), coords[1] + (this.height / 2), (this.width/2), (this.height / 2), 0, 0, twoPI);
    };

// Manually draw ellipse if browser doesn't support native canvas ellipses
if ( !ellipseSupport ) {
  drawEllipse = function(ctx,coords) {
    var w = this.width,
        h = this.height,
        x = coords[0],
        y = coords[1];

    if ( w === h ) { // Circle!
      ctx.arc(x + w/2, coords[1] + w/2, w/2, 0, twoPI);
    } else {
      var ox = (w / 2) * kappa,
          oy = (h / 2) * kappa,
          xe = x + w,
          ye = y + h,
          xm = x + w / 2,
          ym = y + h / 2;

      ctx.moveTo(x, ym);
      ctx.bezierCurveTo(x, ym - oy, xm - ox, y, xm, y);
      ctx.bezierCurveTo(xm + ox, y, xe, ym - oy, xe, ym);
      ctx.bezierCurveTo(xe, ym + oy, xm + ox, ye, xm, ye);
      ctx.bezierCurveTo(xm - ox, ye, x, ym + oy, x, ym);
    }
  };
}

/**
 * Draw Ellipses and Circles!
 *
 * @type {canvallax.Element}
 * @constructs canvallax.Ellipse
 * @memberOf canvallax
 * @mixes core
 * @extends canvallax.Element
 *
 * @param {object} options - Object containing properties to be applied to the new instance. Reference the properties below.
 *
 * @property {number} width=null - Width of the ellipse, required to render.
 * @property {number} height=null - Height of the ellipse, required to render.
 */
canvallax.Ellipse = createElement(
  /** @lends canvallax.Ellipse# */
  {
    type: 'ellipse',

    draw: drawEllipse
  });

/**
 * Draw a Rectangle!
 *
 * @class
 * @mixes core
 * @extends canvallax.Element
 * @memberOf canvallax
 *
 * @param {object} options - Object containing properties to be applied to the new instance. Reference the properties below.
 *
 * @property {number} width=null - Width of the rectangle
 * @property {number} height=null - Height of the rectangle.
 *
 * @example
 * var redTriangle = canvallax.Polygon({
 *        fill: '#F00',
 *        points: 3,
 *        width: 100,
 *        height: 100
 *      });
 */

canvallax.Rectangle = createElement(
  /** @lends canvallax.Rectangle.prototype */
  {

    type: 'rectangle',

    draw: function(ctx,coords) {
      ctx.rect(coords[0], coords[1], this.width, this.height);
    }

  });

/**
 * Image class for drawing an `<img>` or `<canvas>` Element on a Canvallax scene.
 *
 * The element's `width` and `height` are set on image load unless already provided.
 *
 * @class canvallax.Image
 * @mixes core
 * @extends canvallax.Element
 * @memberOf canvallax
 *
 * @param {object|string} options - Object containing properties to be applied to the new `canvallax.Image` instance, or a string containing the URL of the image src to be used.
 *
 * @property {HTMLImageElement|HTMLCanvasElement|HTMLVideoElement} image=null - Image element to draw. Will be created on initialization if not provided.
 * @property {string} src=null - URL of the image to draw, subject to [cross origin policies]{@link https://developer.mozilla.org/en-US/docs/Web/HTML/CORS_enabled_image}
 * @property {number} width=null - Width of the image. Set onload if not provided.
 * @property {number} height=null - Height of the image. Set onload if not provided.
 *
 * @example
 * var img = canvallax.Image('myimage.jpg'); // src can be provided as only parameter on init.
 * @example
 * var img = canvallax.Image({
 *          src: 'myimage.jpg'
 *          width: 300, // Ignore the images actual dimensions, and render at a specific width
 *          height: 100 // Ignore the images actual dimensions, and render at a specific height
 *       });
 */

canvallax.Image = createElement(
  /** @lends canvallax.Image# */
  {
    type: 'image',

    onload: function(img){
      img.width = ( img.width ? img.width : img.image.width );
      img.height = ( img.height ? img.height : img.image.height );
    },

    init: function(options){
      var img = this.image;

      img = ( img && img.nodeType === 1 ? img : options && options.nodeType === 1 ? options : new Image() );

      // Clone the element unless it's Canvas
      if ( !(img instanceof HTMLCanvasElement) ) { img = img.cloneNode(); }

      this.image = img;

      // Ensure we get width/height of image for best draw performance
      this.onload(this);
      img.onload = this.onload.bind(null,this);

      img.src = img.src || options.src || options;
    },

    draw: function(ctx,coords){
      if ( this.image ) {
        ctx.drawImage(this.image, coords[0], coords[1], this.width, this.height);
      }
    }
  });

/**
 * Draw standard or custom polygon shapes!
 *
 * @class
 * @mixes core
 * @extends canvallax.Element
 * @memberOf canvallax
 *
 * @param {object} options - Object containing properties to be applied to the new instance. Reference the properties below.
 *
 * @property {number|array} points=6 - Number of points for standard polygons (triangle, hexagon, etc) or an array of coordinates to draw more complex shapes. Set the last value of array to `'close'` if you want the shape to be closed.
 * @property {number} width=null - Width of the polygon, not used if an array of points is provided.
 * @property {number} height=null - Height of the polygon, not used if an array of points is provided.
 *
 * @example
 * var redTriangle = canvallax.Polygon({
 *        fill: '#F00',
 *        points: 3,
 *        width: 100,
 *        height: 100
 *      });
 *
 * @example
 * var blackStar = canvallax.Polygon({
 *        fill: '#000',
 *        points: [[80, 0], [100, 50], [160, 55], [115, 95], [130, 150], [80, 120], [30, 150], [45, 95], [0, 55], [60, 50],'close'],
 *      });
 *
 */

canvallax.Polygon = createElement(
  /** @lends canvallax.Polygon# */
  {

    type: 'polygon',

    points: 6,

    draw: function(ctx,coords) {
      var p = this.points,
          len = p.length,
          i = 0,
          w, h, x, y;

      if ( len ) {
        for (; i < len; i++) {
          if ( p[i] === 'close' ) { ctx.closePath(); }
          else { ctx[( i === 0 ? 'moveTo' : 'lineTo' )](coords[0] + p[i][0], coords[1] + p[i][1]); }
        }
      } else {
        w = this.width / 2;
        h = this.height / 2;
        x = coords[0] + w;
        y = coords[1] + h;

        ctx.moveTo(x + w, y);
        // Polygon math adapted from http://scienceprimer.com/drawing-regular-polygons-javascript-canvas
        for (; i < p; i++) {
          ctx.lineTo(
            x+(w * Math.cos((i * twoPI) / p)),
            y+(h * Math.sin((i * twoPI) / p))
          );
        }
        ctx.closePath();
      }
    }

  });

/**
 * Tracker Class for linking an object's properties to external input, such as the scroll or pointer.
 *
 * @mixin
 * @memberOf canvallax
 *
 * @param {object} options - Object containing properties to be applied to the new instance. Reference the properties below.
 *
 * @property {number} ease=0 - The easing of the tracked values when updated. 0 = none, higher is longer.
 * @property {number} scale=1 - Multiplier of the tracked values, how drastically the tracker will affect the values. 2 is twice as fast as the tracked values, 0.5 is half the speed of the tracked values
 * @property {object|number|null} offset=null - Offset that should be applied to the tracked values.
 * @property {boolean|string} invert=null - Invert the tracked values. Can be a string of 'invertx' or 'inverty' to invert specific values
 *
 */
canvallax.Tracker = createClass(arrayLike,animateCore,
  /** @lends canvallax.Tracker# */
  {

    ease: 0,
    scale: 1,
    property: 'offset',
    individual: false,
    playing: true,

    applyTracking: function(el, renderedPos){
      var me = this,
          pos = el[me.property] || {},
          _pos = {};

      renderedPos = renderedPos || me._render(el);

      if ( !renderedPos ) { return false; }

      for ( var key in renderedPos ) {
        _pos[key] = me.scale * ( me.invert === true || me.invert === 'invert'+key ? renderedPos[key] : -renderedPos[key] ) +
                    (  me.offset && !isNaN(me.offset[key]) ? me.offset[key] : !isNaN(me.offset) ? me.offset : 0 );

        if ( !pos[key] ) { pos[key] = 0; }

        pos[key] = ( me.ease <= 0 ? _pos[key] : pos[key] + ( _pos[key] - pos[key] ) / (me.ease + 1) );
      }

      el[me.property] = pos;

      return this;
    },

    render: function() {
      var len = this.length,
          i = 0,
          renderedPos = !this.individual ? this._render() : null;
      for ( ; i < len; i++ ){ this.applyTracking(this[i],renderedPos); }
      return this;
    }

    /**
     * Create a clone of this object
     * @borrows clone as clone
     * @method
     * @param {object=} options - Properties to be applied to the cloned object
     */

  });

/**
 * Creates a custom Canvallax Tracker.
 * @memberOf canvallax
 * @method
 */
var createTracker = canvallax.createTracker = createClass.bind(null,canvallax.Tracker);

var scrollX = 0,
    scrollY = 0,
    // Only one scroll tracker that works for every instance
    watchingScroll = false,
    onScroll = function(){
      scrollX = root.scrollLeft || body.scrollLeft;
      scrollY = root.scrollTop || body.scrollTop;
    };
    /**
 * Tracker Class for linking an object's `x` and `y` to the scroll position.
 *
 * @class
 * @mixes canvallax.Tracker
 * @memberOf canvallax
 *
 * @param {object} options - Object containing properties to be applied to the new instance. Reference the properties below.
 *
 * @example
 *  var scene = canvallax.Scene(),
 *      tracker = canvallax.TrackScroll();
 *  scene.addTo(tracker);
 */
canvallax.TrackScroll = createTracker(
  /** @lends canvallax.TrackScroll.prototype */
  {

    init: function(){
      if ( !watchingScroll ) {
        watchingScroll = true;
        onScroll();
        doc.addEventListener('scroll', onScroll);
      }
    },

    _render: function(){
      return { x: scrollX, y: scrollY };
    }

  });

var pointerFixedX = 0,
    pointerFixedY = 0,
    // Only one pointer tracker that works for every instance
    watchingPointer = false,
    onPointerMove = function(e){
      pointerFixedX = ( e.touches ? e.touches[0].clientX : e.clientX );
      pointerFixedY = ( e.touches ? e.touches[0].clientY : e.clientY );
    };

/**
 * Tracker Class for linking an object's `x` and `y` to the pointer position.
 * Recommended for objects to be `fixed: true` to prevent any parent positioning from affecting the pointer tracking.
 *
 * @class
 * @mixes canvallax.Tracker
 * @memberOf canvallax
 *
 * @param {object} options - Object containing properties to be applied to the new instance. Reference the properties below.
 *
 * @example
 *  var scene = canvallax.Scene(),
 *      arrow = canvallax.Polygon({
 *        fill: '#000',
 *        points: 3,
 *        width: 100,
 *        height: 100,
 *        fixed: true
 *      }),
 *      tracker = canvallax.TrackPointer({ ease: 4 });
 *
 *  arrow.addTo(scene,tracker);
 */
canvallax.TrackPointer = createTracker(
  /** @lends canvallax.TrackPointer.prototype */
  {

    init: function(){
      if ( !watchingPointer ) {
        watchingPointer = true;
        doc.addEventListener('mousemove', onPointerMove);
        doc.addEventListener('touchmove', onPointerMove);
        doc.addEventListener('touchstart', onPointerMove);
      }
    },

    _render: function(){
      return { x: -pointerFixedX, y: -pointerFixedY };
    }

  });


/**
 * Element Tracker Class for linking an object's `x` and `y` to the element position, relative to scroll.
 * Recommended for objects to be `fixed: true` to prevent any parent positioning from affecting the link to the element.
 *
 *
 * @class
 * @mixes canvallax.Tracker
 * @memberOf canvallax
 *
 * @param {object} options - Object containing properties to be applied to the new instance. Reference the properties below.
 *
 * @property {node} element=null - Element to be tracked
 *
 * @example
 *  var scene = canvallax.Scene(),
 *      rect = canvallax.Rectange({
 *        fill: '#000',
 *        width: 100,
 *        height: 100
 *      }),
 *      tracker = canvallax.TrackElement('#myElement');
 *
 *  rect.addTo(scene,tracker);
 */
canvallax.TrackElement = canvallax.createTracker(
  /** @lends canvallax.TrackPointer.prototype */
  {

    init: function(opts){
      var elem = (opts && opts.element) || opts;
      this.element = ( typeof elem === 'string' ? document.querySelector(elem) : elem );
    },

    _render: function(){
      var rect = this.element.getBoundingClientRect();
      return { x: -rect.left, y: -rect.top };
    }

  });


})(window || this);
