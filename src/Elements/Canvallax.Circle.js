  Canvallax.Circle = createElement({

    radius: 20,
    // (Number)
    // Radius of the circle.

    draw: function(ctx) {
      ctx.arc(this.x + this.radius, this.y + this.radius, this.radius, 0, twoPI);
    }

  });
