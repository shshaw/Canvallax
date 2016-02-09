  var winScrollX = 0,
      winScrollY = 0,
      // Only one scroll tracker that works for every instance
      watchingScroll = false,
      onScroll = function(){
        winScrollX = root.scrollLeft || body.scrollLeft;
        winScrollY = root.scrollTop || body.scrollTop;
      };

  canvallax.TrackScroll = createTracker({

    init: function(){
      if ( !watchingScroll ) {
        watchingScroll = true;
        onScroll();
        win.addEventListener('scroll', onScroll);
        win.addEventListener('touchmove', onScroll);
      }
    },

    _render: function(){
      return { x: winScrollX, y: winScrollY };
    }

  });
