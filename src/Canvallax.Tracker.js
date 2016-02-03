
  Canvallax.Tracker = createClass({

    ease: 1,
    // (Number)
    // The easing of the x & y position when updated. 1 = none, higher is longer.
    // If you're syncing parallax items to regular items in the scroll, then you'll probably want a low ease.

    scale: 1,
    // (Number)
    // Multiplier of the tracked values, how drastically the tracker will affect the values.
    // 2 is twice as fast as the tracked values, 0.5 is half the speed of the tracked values

    invert: false,
    // (Boolean||'invertx'||'inverty')
    // Inversion of the tracking values.
    // If true, 'invertx' or 'inverty', the appropriate axes will be reversed relative to what's provided in the `render` function.

    offset: false,
    // (Number||Object)
    // Offset(s) to be applied to the tracker's values.

    _render: null,
    // (Function)
    // Callback function run for each Canvallax instance using the tracker.

    render: function(el,parent) {
      var me = this,
          pos = me._render(el,parent),
          _pos = me.pos || {};

      if ( !pos ) { return false; }

      for ( var key in pos ) {
        if ( pos.hasOwnProperty(key) ) {

          pos[key] = ( me.invert === true || me.invert === 'invert'+key ? -pos[key] : pos[key]) * me.scale;

          if ( me.offset ) {
            pos[key] += ( !isNaN(me.offset[key]) ? me.offset[key] : !isNaN(me.offset) ? me.offset : 0 );
          }

          if ( !_pos[key] ) {
            _pos[key] = ( el ? el[key] : parent ? parent[key] : pos[key] );
          }

          if ( me.ease > 0 ) {
            _pos[key] += ( -pos[key] - _pos[key] ) / me.ease;
          }

        }
      }
      return me._pos = _pos;
    },

    clone: clone

  });

  var createTracker = Canvallax.createTracker = createClass.bind(null,Canvallax.Tracker);
