  var twoPI = 2 * Math.PI,
      rad = Math.PI / 180;

  Canvallax.Polygon = Canvallax.createElement({
    sides: 6,
    size: 20,
    rotation: 30,
    fill: '#000',
    render: function(ctx) {
      // Polygon math adapted from http://scienceprimer.com/drawing-regular-polygons-javascript-canvas
      var i = this.sides;

      ctx.translate(this.x,this.y);
      ctx.rotate(this.rotation * rad);

      ctx.beginPath();
      ctx.moveTo(this.size, 0);

      while (i--) {
        ctx.lineTo(
          this.size * Math.cos(i * (twoPI) / this.sides),
          this.size * Math.sin(i * (twoPI) / this.sides)
        );
      }

      ctx.closePath();

      if ( this.fill ) {
        ctx.fillStyle = this.fill;
        ctx.fill();
      }

      if ( this.stroke ) {
        ctx.lineWidth = this.lineWidth;
        ctx.strokeStyle = this.stroke;
        ctx.stroke();
      }
    }
  });