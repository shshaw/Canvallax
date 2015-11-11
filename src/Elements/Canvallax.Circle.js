  var twoPI = 2 * Math.PI;

  Canvallax.Circle = Canvallax.createElement({
    size: 20,
    fill: '#000',
    render: function(ctx) {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, twoPI);
      ctx.closePath();

      if ( this.fill ) {
        ctx.fillStyle = this.fill;
        ctx.fill();
      }

      if ( this.stroke ) {
        if ( this.lineWidth ) { ctx.lineWidth = this.lineWidth; }
        ctx.strokeStyle = this.stroke;
        ctx.stroke();
      }
    }
  });