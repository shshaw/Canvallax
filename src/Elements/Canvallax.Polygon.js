  var twoPI = 2 * Math.PI;

  Canvallax.Polygon = createElement({

    sides: 6,
    // (Number)
    // Number of the polygon's sides. `3` is a triangle, `4` is a square, etc.

    radius: 20,
    // (Number)
    // Radius of the polygon.

    _render: function(ctx) {
      // Polygon math adapted from http://scienceprimer.com/drawing-regular-polygons-javascript-canvas
      var i = this.sides;

      ctx.translate(this.x + this.radius,this.y + this.radius);

      ctx.moveTo(this.radius, 0);

      while (i--) {
        ctx.lineTo(
          this.radius * Math.cos((i * twoPI) / this.sides),
          this.radius * Math.sin((i * twoPI) / this.sides)
        );
      }

    }

  });