  canvallax.Rectangle = createElement({

    width: 100,
    // (Number)
    // Width of the rectangle.

    height: 100,
    // (Number)
    // Height of the rectangle.

    draw: function(ctx,coords) {
      ctx.rect(coords[0], coords[1], this.width, this.height);
    }

  });
