  Canvallax.Circle = createElement({

    radius: 20,
    // (Number)
    // Radius of the circle.

    _render: function(ctx) {
      ctx.arc(this.radius, this.radius, this.radius, 0, twoPI);
    }

  });
