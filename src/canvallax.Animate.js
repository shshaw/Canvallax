
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
 * @param {function|string} options.ease=canvallax.ease.inOutQuad - Easing function to use. Many functions are built in to {@link canvallax.ease}, and you can reference them directly or use a string of the property instead of the function itself like `'inOutCubic'`
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
  me.ease = canvallax.ease[me.ease] || me.ease;
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
