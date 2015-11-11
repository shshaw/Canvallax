  function imageOnload(){
    this.width = ( this.width ? this.width : this.image.width );
    this.height = ( this.height ? this.height : this.image.height );
  }

  Canvallax.Image = Canvallax.createElement({
    init: function(options){

      this.image = ( this.image ? this.image : options.nodeType ? options : (new Image) ).cloneNode();

      // Ensure we get width/height of image for best draw performance
      imageOnload.bind(this)();
      this.image.onload = imageOnload.bind(this);

      this.image.src = this.image.src || options.src || options;

    },
    render: function(ctx){
      if ( this.image ) {
        ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
      }
    }
  });