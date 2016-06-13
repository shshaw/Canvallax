var scrollX = 0,
    scrollY = 0,
    // Only one scroll tracker that works for every instance
    watchingScroll = false,
    onScroll = function(){
      scrollX = win.pageXOffset;
      scrollY = win.pageYOffset;
    };
    /**
 * Tracker Class for linking an object's `x` and `y` to the scroll position.
 *
 * @class
 * @mixes canvallax.Tracker
 * @memberOf canvallax
 *
 * @param {object} options - Object containing properties to be applied to the new instance. Reference the properties below.
 *
 * @example
 *  var scene = canvallax.Scene(),
 *      tracker = canvallax.TrackScroll();
 *  scene.addTo(tracker);
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
      var e = this.element;
      return {
        x: e ? e.scrollLeft : scrollX,
        y: e ? e.scrollTop : scrollY
      };
    }

  });
