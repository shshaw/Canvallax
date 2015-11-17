  var twoPI = 2 * Math.PI;

  Canvallax.Circle = createClass(Canvallax.Element,{

    size: 20,
    // (Number)
    // Radius of the circle.

    render: function(ctx) {
      ctx.arc(this.x + this.size, this.y + this.size, this.size, 0, twoPI);
    }

  });