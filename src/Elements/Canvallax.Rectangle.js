  Canvallax.Rectangle = createElement({

    width: 100,
    // (Number)
    // Width of the rectangle.

    height: 100,
    // (Number)
    // Height of the rectangle.

    draw: function(ctx) {
      ctx.rect(this.x, this.y, this.width, this.height);
    }

  });
