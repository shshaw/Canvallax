  Canvallax.Tracker = createClass({

    damping: 1,
    // (Number)
    // The 'easing' of the x & y position when updated. 1 = none, higher is longer.
    // If you're syncing parallax items to regular items in the scroll, then you'll probably want a low damping.

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

    _render: noop,
    // (Function)
    // Callback function run for each Canvallax instance using the tracker.

    render: function(C,el) {

      var pos = this._render.apply(this,arguments);

      if ( !pos ) { return false; }

      pos.x = ((this.invert === true || this.invert === 'invertx') ? -pos.x : pos.x) * this.scale;
      pos.y = ((this.invert === true || this.invert === 'inverty') ? -pos.y : pos.y) * this.scale;

      if ( !this._pos ) {
        this._pos = { x: ( el ? el.x : C ? C.x : pos.x ), y: ( el ? el.y : C ? C.y : pos.y ) };
      }

      this._pos.x += ( -pos.x - this._pos.x ) / this.damping;
      this._pos.y += ( -pos.y - this._pos.y ) / this.damping;

      return this._pos;
    },

    clone: clone

  });

  var createTracker = Canvallax.createTracker = createClass.bind(null,Canvallax.Tracker);