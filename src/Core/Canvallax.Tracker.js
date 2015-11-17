  Canvallax.Tracker = createClass({

    damping: 1,
    // (Number)
    // The 'easing' of the x & y position when updated. 1 = none, higher is longer.
    // If you're syncing parallax items to regular items in the scroll, then you'll probably want a low damping.

    speed: 1,
    // (Number)
    // How slow or fast the tracker should move.
    // 2 is twice as fast as the tracked values, 0.5 is half the speed of the tracked values

    invert: false,
    // (true||'invertx'||'inverty')
    // Inversion of the tracking values.
    // If true, 'invertx' or 'inverty', the appropriate axes will be reversed relative to what's provided in the `render` function.

    init: noop,
    // (Function)
    // Callback function triggered when the element is first created.
    // Receives all arguments passed to the element's creation function.

    render: noop,
    // (Function)
    // Callback function run for each Canvallax instance using the tracker.
    _render: function(C,el) {

      var pos = this.render.apply(this,arguments);

      if ( pos ) {
        pos.x = ((this.invert === true || this.invert === 'invertx') ? -pos.x : pos.x) * this.speed;
        pos.y = ((this.invert === true || this.invert === 'inverty') ? -pos.y : pos.y) * this.speed;
      } else {
        return false;
      }

      if ( !this._pos ) {
        el = el || {};
        C = C || {};
        this._pos = { x: el.x || C.x || pos.x, y: el.y || C.y || pos.y };
      }

      this._pos.x += ( -pos.x - this._pos.x ) / this.damping;
      this._pos.y += ( -pos.y - this._pos.y ) / this.damping;

      return this._pos;
    },

    clone: Canvallax.clone

  });