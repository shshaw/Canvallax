  Canvallax.Polygon = createElement({

    sides: 6,
    // (Number)
    // Number of the polygon's sides. `3` is a triangle, `4` is a square, etc.

    radius: 20,
    // (Number)
    // Radius of the polygon.

    draw: function(ctx,coords) {
      var i = this.sides,
          radius = this.radius,
          x = coords[0] + radius,
          y = coords[1] + radius;


      ctx.moveTo(x + radius, y);

      // Polygon math adapted from http://scienceprimer.com/drawing-regular-polygons-javascript-canvas
      while (i--) {
        ctx.lineTo(
          x+(radius * Math.cos((i * twoPI) / this.sides)),
          y+(radius * Math.sin((i * twoPI) / this.sides))
        );
      }
    }

  });
