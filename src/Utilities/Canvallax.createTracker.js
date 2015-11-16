  Canvallax.createTracker = (function(){

    var trackerPrototype = {

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

            var results = this.render.apply(this,arguments);

            if ( results ) {
              results.x = (this.invert === true || this.invert === 'invertx') ? -results.x : results.x;
              results.y = (this.invert === true || this.invert === 'inverty') ? -results.y : results.y;
            }

            return results;
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