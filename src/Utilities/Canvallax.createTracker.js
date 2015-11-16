  Canvallax.createTracker = (function(){

    var trackerPrototype = {

          damping: 1,
          // (Number)
          // The 'easing' of the x & y position when updated. 1 = none, higher is longer.
          // If you're syncing parallax items to regular items in the scroll, then you'll probably want a low damping.

          init: noop,
          // (Function)
          // Callback function triggered when the element is first created.
          // Receives all arguments passed to the element's creation function.

          render: noop,
          // (Function)
          // Callback function run for each Canvallax instance using the tracker.

          invert: false,
          // (true||'invertx'||'inverty')
          // Inversion of the tracking values.
          // If true, 'invertx' or 'inverty', the appropriate axes will be reversed relative to what's provided in the `render` function.

          _render: function() {

            var pos = this.render.apply(this,arguments);

            if ( pos ) {
              pos.x = (this.invert === true || this.invert === 'invertx') ? -pos.x : pos.x;
              pos.y = (this.invert === true || this.invert === 'inverty') ? -pos.y : pos.y;
            } else {
              return false;
            }

            if ( !this._pos ) {
              this._pos = { x: pos.x, y: pos.y };
            }

            this._pos.x += ( -pos.x - this._pos.x ) / this.damping;
            this._pos.y += ( -pos.y - this._pos.y ) / this.damping;

            return this._pos;
          },

          clone: Canvallax.clone

        };

    return function(defaults){

      function Tracker(options) {
        if ( !(this instanceof Tracker) ) { return new Tracker(options); }

        Canvallax.extend(this,options);
        this.init.apply(this,arguments);

        return this;
      }

      Tracker.prototype = Canvallax.extend({},trackerPrototype,defaults);
      Tracker.prototype.constructor = Tracker;

      return Tracker;
    };

  })();