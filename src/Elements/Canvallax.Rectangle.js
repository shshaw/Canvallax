  Canvallax.Rectangle = createElement({

    width: 100,
    // (Number)
    // Width of the rectangle.

    height: 100,
    // (Number)
    // Height of the rectangle.

    draw: function(ctx) {
      ctx.rect(0, 0, this.width, this.height);
    }

  });
