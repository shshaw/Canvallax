
var winPointerX = 0,
    winPointerY = 0,
    // Only one pointer tracker that works for every instance
    watchingPointer = false,
    onPointerMove = function(e){
      winPointerX = ( e.touches ? e.touches[0].clientX : e.clientX ); // touch support
      winPointerY = ( e.touches ? e.touches[0].clientY : e.clientY ); // touch support
    };

/**
 * Tracker Class for linking an object's `x` and `y` to the pointer position.
 *
 * @class
 * @mixes canvallax.Tracker
 * @memberOf canvallax
 *
 * @example
 *  var scene = canvallax.Scene(),
 *     arrow = canvallax.Polygon({
 *       fill: '#000',
 *       points: 3,
 *       width: 100,
 *       height: 100
 *       tracker: canvallax.trackPointer({ ease: 10 }) // Move the arrow with your cursor
 *     });
 *
 *  scene.add(arrow);
 */
canvallax.TrackPointer = createTracker(
  /** @lends canvallax.TrackPointer.prototype */
  {

    init: function(){
      if ( !watchingPointer ) {
        watchingPointer = true;
        doc.addEventListener('mousemove', onPointerMove);
        doc.addEventListener('touchmove', onPointerMove);
        doc.addEventListener('touchstart', onPointerMove);
      }
    },

    _render: function(el,parent){
      var pos = false,
          inBounds = parent.fullscreen,
          offsetLeft = 0,
          offsetTop = 0,
          canvas;

      if ( !inBounds ) {
        canvas = el.getCanvas();
        offsetLeft = canvas.offsetLeft;
        offsetTop = canvas.offsetTop;

        inBounds = winPointerX >= offsetLeft && winPointerX <= offsetLeft + canvas.width && winPointerY >= offsetTop && winPointerY <= offsetTop + canvas.height;
      }

      if ( inBounds ) {

        pos = {
          x: -winPointerX + offsetLeft,
          y: -winPointerY + offsetTop
        };


        if ( parent && el !== parent ) {
          pos.x += ( parent.x ? parent.x : 0 );
          pos.y += ( parent.y ? parent.y : 0 );
        }

      }

      return pos;
    }

  });
