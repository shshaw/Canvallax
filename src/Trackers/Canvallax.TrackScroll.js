  // Only one scroll tracker that works for every Canvallax instance
  var watchingScroll = false,
      winScrollX = 0,
      winScrollY = 0,
      onScroll = function(){
        winScrollX = root.scrollLeft || body.scrollLeft;
        winScrollY = root.scrollTop || body.scrollTop;
      };

  Canvallax.TrackScroll = Canvallax.createTracker({

    render: function(C,el){

      if ( !watchingScroll ) {
        watchingScroll = true;
        onScroll();
        win.addEventListener('scroll', onScroll);
        win.addEventListener('touchmove', onScroll);
      }

      return { x: winScrollX, y: winScrollY };

    }

  });