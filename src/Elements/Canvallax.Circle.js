  var twoPI = 2 * Math.PI;

  Canvallax.Circle = Canvallax.createElement({
    size: 20,
    render: function(ctx) {
      ctx.beginPath();
      ctx.arc(this.x + this.size, this.y + + this.size, this.size, 0, twoPI);
      ctx.closePath();
    }
  });