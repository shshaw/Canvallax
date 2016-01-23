
  var kappa = 0.5522848,

      // Detect support for native canvas ellipses
      ellipseSupport = (function(){
        var canvas = document.createElement('canvas'),
            ctx = canvas.getContext('2d');

        return ( typeof ctx.ellipse === typeof function(){} );
      }()),

      drawEllipse = function(ctx,coords) {
        ctx.ellipse(coords[0] + (this.width/2), coords[1] + (this.height / 2), (this.width/2), (this.height / 2), 0, 0, twoPI);
      };

  if ( !ellipseSupport ) {
    drawEllipse = function(ctx,coords) {
      var w = this.width,
          h = this.height,
          x = coords[0],
          y = coords[1],
          ox = (w / 2) * kappa,
          oy = (h / 2) * kappa,
          xe = x + w,
          ye = y + h,
          xm = x + w / 2,
          ym = y + h / 2;

      ctx.moveTo(x, ym);
      ctx.bezierCurveTo(x, ym - oy, xm - ox, y, xm, y);
      ctx.bezierCurveTo(xm + ox, y, xe, ym - oy, xe, ym);
      ctx.bezierCurveTo(xe, ym + oy, xm + ox, ye, xm, ye);
      ctx.bezierCurveTo(xm - ox, ye, x, ym + oy, x, ym);
    }
  }

  Canvallax.Ellipse = createElement({

    width: 30,
    // (Number)
    // Radius of the circle.

    height: 10,

    draw: drawEllipse

  });
