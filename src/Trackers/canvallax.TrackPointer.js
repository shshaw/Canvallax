
  var winHeight = win.innerHeight,
      winWidth = win.innerWidth,

      /** Only one window resize event that works for every instance */
      watchingResize = false,
      onResize = function(){
        winHeight = win.innerHeight;
        winWidth = win.innerWidth;
      },

      pointerFixedX = winWidth/2,
      pointerFixedY = winHeight/2,

      /** Only one pointer tracker that works for every instance */
      watchingPointer = false,
      onPointerMove = function(e){
        pointerFixedX = ( e.touches ? e.touches[0].clientX : e.clientX );
        pointerFixedY = ( e.touches ? e.touches[0].clientY : e.clientY );
      };

  /**
   * Tracker Class for linking an object's `x` and `y` to the pointer position.
   * Recommended for objects to be `fixed: true` to prevent any parent positioning from affecting the pointer tracking.
   *
   * @class
   * @mixes canvallax.Tracker
   * @memberOf canvallax
   *
   * @param {object} options - Object containing properties to be applied to the new instance. Reference the properties below.
   *
   * @example
   *  var scene = canvallax.Scene(),
   *      arrow = canvallax.Polygon({
   *        fill: '#000',
   *        points: 3,
   *        width: 100,
   *        height: 100,
   *        fixed: true
   *      }),
   *      tracker = canvallax.TrackPointer({ ease: 4 });
   *
   *  arrow.addTo(scene,tracker);
   */
  canvallax.TrackPointer = canvallax.createTracker(
    /** @lends canvallax.TrackPointer.prototype */
    {

      range: false,

      init: function(){
        if ( !watchingPointer ) {
          watchingPointer = true;
          doc.addEventListener('mousemove', onPointerMove);
          doc.addEventListener('touchmove', onPointerMove);
          doc.addEventListener('touchstart', onPointerMove);
        }
        if ( !watchingResize ) {
          onResize();
          win.addEventListener('resize', onResize);
        }
      },

      _render: function(){
        var x = -pointerFixedX,
            y = -pointerFixedY,
            range = this.range;

        if ( range || range === 0 ) {
          x = ((pointerFixedX / winWidth) - 0.5 ) * -(range.x || range);
          y = ((pointerFixedY / winHeight) - 0.5 ) * -(range.y || range);
        }
        return { x: x, y: y };
      }

    });
