  Canvallax.Rectangle = Canvallax.createElement({

    width: 100,
    // (Number)
    // Width of the rectangle.

    height: 100,
    // (Number)
    // Height of the rectangle.

    render: function(ctx) {
      ctx.beginPath();
      ctx.rect(this.x, this.y, this.width, this.height);
      ctx.closePath();
    }

  });