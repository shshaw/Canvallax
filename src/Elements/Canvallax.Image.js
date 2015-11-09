(function(Canvallax){

  function imageOnload(){
    this.width = ( this.width ? this.width : this.image.width );
    this.height = ( this.height ? this.height : this.image.height );
  }

  Canvallax.Image = Canvallax.createElement({
    init: function(options){

      if ( options.nodeType === 1 ) {
        this.image = options;
      } else if ( (!this.image && options.src) || (typeof options === typeof "") ) {
        this.image = new Image();
        this.image.src = options.src || options;
      }

      // Ensure we get width/height of image for best draw performance
      imageOnload.bind(this)();
      this.image.onload = imageOnload.bind(this);

    },
    render: function(ctx){

      if ( this.image ) {

        var drawArgs = [this.image];

        if ( this.crop ) {
          drawArgs.push(this.crop.x,this.crop.y,this.crop.width,this.crop.height);
          this.width = ( this.width ? this.width : this.crop.width );
          this.height = ( this.height ? this.height : this.crop.height );
        }

        drawArgs.push(this.x,this.y,this.width, this.height);

        ctx.drawImage.apply(ctx,drawArgs);
      }
    }
  });

})(Canvallax);