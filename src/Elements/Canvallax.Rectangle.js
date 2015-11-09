(function(Canvallax){

  Canvallax.Rectangle = Canvallax.createElement({
    width: 100,
    height: 100,
    fill: '#000',
    render: function(ctx) {
      ctx.beginPath();
      ctx.rect(this.x, this.y, this.width, this.height);
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

})(Canvallax);