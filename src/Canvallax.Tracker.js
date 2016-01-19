
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

    init: noop,
    // (Function)
    // Callback function triggered when the tracker is first created.
    // Receives all arguments passed to the tracker's creation function.

    offset: false,
    // (Number||Object)
    // Offset(s) to be applied to the tracker's values.

    _render: noop,
    // (Function)
    // Callback function run for each Canvallax instance using the tracker.

    render: function(el,parent) {

      var pos = this._render.apply(this,arguments),
          _pos = this.pos || {};

      if ( !pos ) { return false; }

      for ( var key in pos ) {
        if ( pos.hasOwnProperty(key) ) {

          pos[key] = ( this.invert === true || this.invert === 'invert'+key ? -pos[key] : pos[key]) * this.scale;

          if ( this.offset ) {
            pos[key] += ( !isNaN(this.offset[key]) ? this.offset[key] : !isNaN(this.offset) ? this.offset : 0 );
          }

          if ( !_pos[key] ) {
            _pos[key] = ( el ? el[key] : parent ? parent[key] : pos[key] );
          }

          if ( this.ease > 0 ) {
            _pos[key] += ( -pos[key] - _pos[key] ) / this.ease;
          }

        }
      }

      return this._pos = _pos;
    },

    clone: clone

  });

  var createTracker = Canvallax.createTracker = createClass.bind(null,Canvallax.Tracker);
