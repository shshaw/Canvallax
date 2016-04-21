/**
 * Element Tracker Class for linking an object's `x` and `y` to the element position, relative to scroll.
 * Recommended for objects to be `fixed: true` to prevent any parent positioning from affecting the link to the element.
 *
 *
 * @class
 * @mixes canvallax.Tracker
 * @memberOf canvallax
 *
 * @param {object} options - Object containing properties to be applied to the new instance. Reference the properties below.
 *
 * @property {node} element=null - Element to be tracked
 *
 * @example
 *  var scene = canvallax.Scene(),
 *      rect = canvallax.Rectange({
 *        fill: '#000',
 *        width: 100,
 *        height: 100
 *      }),
 *      tracker = canvallax.TrackElement('#myElement');
 *
 *  rect.addTo(scene,tracker);
 */
canvallax.TrackElement = canvallax.createTracker(
  /** @lends canvallax.TrackPointer.prototype */
  {

    init: function(opts){
      var elem = (opts && opts.element) || opts;
      this.element = ( typeof elem === 'string' ? document.querySelector(elem) : elem );
    },

    _render: function(){
      var rect = this.element.getBoundingClientRect();
      return { x: -rect.left, y: -rect.top };
    }

  });
