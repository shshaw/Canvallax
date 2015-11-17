  Canvallax.Rectangle = createClass(Canvallax.Element,{

    width: 100,
    // (Number)
    // Width of the rectangle.

    height: 100,
    // (Number)
    // Height of the rectangle.

    render: function(ctx) {
      ctx.rect(this.x, this.y, this.width, this.height);
    }

  });