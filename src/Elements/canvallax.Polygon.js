canvallax.Polygon = createElement(
  /** @lends canvallax.Polygon.prototype */
  {
    /**
     * Object type
     * @type {string}
     * @default
     */
    type: 'polygon',

    /**
     * Number of points for standard polygons (triangle, hexagon, etc) or an array of coordinates to draw more complex shapes.
     * @type {number|array}
     * @default
     */
    points: 6,
    // (Number)
    // Number of the polygon's sides. `3` is a triangle, `4` is a square, etc.

    width: 20,

    height: 20,

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
