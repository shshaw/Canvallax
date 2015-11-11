  Canvallax.Rectangle = Canvallax.createElement({
    width: 100,
    height: 100,
    render: function(ctx) {
      ctx.beginPath();
      ctx.rect(this.x, this.y, this.width, this.height);
      ctx.closePath();
    }
  });