  Canvallax.Polygon = createElement({

    sides: 6,
    // (Number)
    // Number of the polygon's sides. `3` is a triangle, `4` is a square, etc.

    radius: 20,
    // (Number)
    // Radius of the polygon.

    draw: function(ctx) {
      // Polygon math adapted from http://scienceprimer.com/drawing-regular-polygons-javascript-canvas
      var i = this.sides,
          radius = this.radius,
          x = this.x + radius,
          y = this.y + radius;


      ctx.moveTo(x + radius, y);

      while (i--) {
        ctx.lineTo(
          x+(radius * Math.cos((i * twoPI) / this.sides)),
          y+(radius * Math.sin((i * twoPI) / this.sides))
        );
      }

    }

  });
