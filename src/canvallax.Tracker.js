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
canvallax.Tracker = createClass({

  ease: 0,
  scale: 1,

  render: function(el,parent) {
    var me = this,
        _pos = me.pos || {},
        pos = me._render(el,parent,_pos);

    if ( !pos ) { return false; }

    for ( var key in pos ) {
      if ( pos.hasOwnProperty(key) ) {

        pos[key] = ( me.invert === true || me.invert === 'invert'+key ? pos[key] : -pos[key]) * me.scale;

        if ( me.offset ) {
          pos[key] += ( !isNaN(me.offset[key]) ? me.offset[key] : !isNaN(me.offset) ? me.offset : 0 );
        }

        if ( !_pos[key] ) {
          _pos[key] = ( el ? el[key] : parent ? parent[key] : pos[key] );
        }

        _pos[key] = ( me.ease <= 0 ? pos[key] : _pos[key] + ( pos[key] - _pos[key] ) / (me.ease + 1) );

      }
    }

    me.pos = _pos;

    return _pos;
  },

  clone: clone

});

/**
 * Creates a custom Canvallax Tracker.
 * @memberOf canvallax
 * @method
 */
var createTracker = canvallax.createTracker = createClass.bind(null,canvallax.Tracker);
