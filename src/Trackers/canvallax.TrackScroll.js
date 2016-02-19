var winScrollX = 0,
    winScrollY = 0,
    // Only one scroll tracker that works for every instance
    watchingScroll = false,
    onScroll = function(){
      winScrollX = root.scrollLeft || body.scrollLeft;
      winScrollY = root.scrollTop || body.scrollTop;
    };

/**
 * Tracker Class for linking an object's `x` and `y` to the scroll position.
 *
 * @class
 * @mixes canvallax.Tracker
 * @memberOf canvallax
 *
 * @example
 *  var scene = canvallax.Scene({
 *       tracker: canvallax.trackScroll() // Make the scene following the window scroll
 *    });
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
      return { x: winScrollX, y: winScrollY };
    }

  });
