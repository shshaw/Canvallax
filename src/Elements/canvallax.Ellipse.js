
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

// Manually draw ellipse if browser doesn't support native canvas ellipses
if ( !ellipseSupport ) {
  drawEllipse = function(ctx,coords) {
    var w = this.width,
        h = this.height,
        x = coords[0],
        y = coords[1];

    if ( w === h ) { // Circle!
      ctx.arc(x + w/2, coords[1] + w/2, w/2, 0, twoPI);
    } else {
      var ox = (w / 2) * kappa,
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
  };
}

/**
 * Draw Ellipses and Circles!
 *
 * @type {canvallax.Element}
 * @constructs canvallax.Ellipse
 * @memberOf canvallax
 * @mixes core
 * @extends canvallax.Element
 *
 * @param {object} options - Object containing properties to be applied to the new instance. Reference the properties below.
 *
 * @property {number} width=null - Width of the ellipse, required to render.
 * @property {number} height=null - Height of the ellipse, required to render.
 */
canvallax.Ellipse = createElement(
  /** @lends canvallax.Ellipse# */
  {
    type: 'ellipse',

    draw: drawEllipse
  });
