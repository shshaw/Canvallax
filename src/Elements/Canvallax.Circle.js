  var twoPI = 2 * Math.PI;

  Canvallax.Circle = createElement({

    radius: 20,
    // (Number)
    // Radius of the circle.

    _render: function(ctx) {
      ctx.arc(this.x + this.radius, this.y + this.radius, this.radius, 0, twoPI);
    }

  });