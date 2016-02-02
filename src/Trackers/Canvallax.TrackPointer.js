
  var winPointerX = 0,
      winPointerY = 0,
      // Only one pointer tracker that works for every instance
      watchingPointer = false,
      onPointerMove = function(e){
        winPointerX = ( e.touches ? e.touches[0].clientX : e.clientX ); // touch support
        winPointerY = ( e.touches ? e.touches[0].clientY : e.clientY ); // touch support
      };

  Canvallax.TrackPointer = createTracker({

    init: function(){
      if ( !watchingPointer ) {
        watchingPointer = true;
        win.addEventListener('mousemove', onPointerMove);
        win.addEventListener('touchmove', onPointerMove);
        win.addEventListener('touchstart', onPointerMove);
      }
    },

    _render: function(el,parent){

      var pos = false,
          inBounds = parent.fullscreen,
          offsetLeft = 0,
          offsetTop = 0,
          canvas;

      if ( !inBounds ) {
        canvas = ( el.canvas || parent.canvas );
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
          pos.x += parent.x;
          pos.y += parent.y;
        }
      }

      return pos;

    }

  });
