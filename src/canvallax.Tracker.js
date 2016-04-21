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
