  var twoPI = 2 * Math.PI;

  Canvallax.Polygon = Canvallax.createElement({

    sides: 6,
    // (Number)
    // Number of the polygon's sides. `3` is a triangle, `4` is a square, etc.

    size: 20,
    // (Number)
    // Radius of the polygon.

    render: function(ctx) {
      // Polygon math adapted from http://scienceprimer.com/drawing-regular-polygons-javascript-canvas
      var i = this.sides;

      ctx.translate(this.x + this.size,this.y + this.size);

      ctx.beginPath();
      ctx.moveTo(this.size, 0);

      while (i--) {
        ctx.lineTo(
          this.size * Math.cos((i * twoPI) / this.sides),
          this.size * Math.sin((i * twoPI) / this.sides)
        );
      }

      ctx.closePath();
    }

  });