/**
 * Draw standard or custom polygon shapes!
 *
 * @class
 * @mixes core
 * @extends canvallax.Element
 * @memberOf canvallax
 *
 * @param {object} options - Object containing properties to be applied to the new instance. Reference the properties below.
 *
 * @property {number|array} points=6 - Number of points for standard polygons (triangle, hexagon, etc) or an array of coordinates to draw more complex shapes. Set the last value of array to `'close'` if you want the shape to be closed.
 * @property {number} width=null - Width of the polygon, not used if an array of points is provided.
 * @property {number} height=null - Height of the polygon, not used if an array of points is provided.
 *
 * @example
 * var redTriangle = canvallax.Polygon({
 *        fill: '#F00',
 *        points: 3,
 *        width: 100,
 *        height: 100
 *      });
 *
 * @example
 * var blackStar = canvallax.Polygon({
 *        fill: '#000',
 *        points: [[80, 0], [100, 50], [160, 55], [115, 95], [130, 150], [80, 120], [30, 150], [45, 95], [0, 55], [60, 50],'close'],
 *      });
 *
 */

canvallax.Polygon = createElement(
  /** @lends canvallax.Polygon# */
  {

    type: 'polygon',

    points: 6,

    draw: function(ctx,coords) {
      var p = this.points,
          len = p.length,
          i = 0, w, h, x, y;

      if ( len ) {
        for (; i < len; i++) {
          if ( p[i] === 'close' ) { ctx.closePath(); }
          else { ctx[( i == 0 ? 'moveTo' : 'lineTo' )](coords[0] + p[i][0], coords[1] + p[i][1]); }
        }
      } else {
        w = this.width / 2,
        h = this.height / 2,
        x = coords[0] + w,
        y = coords[1] + h;

        ctx.moveTo(x + w, y);
        // Polygon math adapted from http://scienceprimer.com/drawing-regular-polygons-javascript-canvas
        for (; i < p; i++) {
          ctx.lineTo(
            x+(w * Math.cos((i * twoPI) / p)),
            y+(h * Math.sin((i * twoPI) / p))
          );
        }
        ctx.closePath();
      }
    }

  });
