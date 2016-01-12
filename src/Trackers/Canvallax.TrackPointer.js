  var winPointerX = 0,
      winPointerY = 0,
      // Only one pointer tracker that works for every instance
      watchingPointer = false,
      onPointerMove = function(e){
        winPointerX = ( e.touches ? e.touches[0].clientX : e.clientX ); // touch support
        winPointerY = ( e.touches ? e.touches[0].clientY : e.clientY ); // touch support
      };

  Canvallax.TrackPointer = createTracker({

    _render: function(C,el){

      var pos = { x: 0, y: 0 },
          inBounds = C.fullscreen,
          offsetLeft = 0,
          offsetTop = 0;

      if ( !watchingPointer ) {
        watchingPointer = true;
        win.addEventListener('mousemove', onPointerMove);
        win.addEventListener('touchmove', onPointerMove);
      }

      if ( !inBounds ) {
        offsetLeft = C.canvas.offsetLeft;
        offsetTop = C.canvas.offsetTop;

        inBounds = winPointerX >= offsetLeft && winPointerX <= offsetLeft + C.width && winPointerY >= offsetTop && winPointerY <= offsetTop + C.height;
      }

      if ( inBounds ) {
        pos = {
          x: -winPointerX + offsetLeft,
          y: -winPointerY + offsetTop
        };

        if ( el ) {
          pos.x += C.x;
          pos.y += C.y;
        }
      }

      return pos;

    }

  });
