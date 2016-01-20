  function imageOnload(){
    this.width = ( this.width ? this.width : this.image.width );
    this.height = ( this.height ? this.height : this.image.height );
  }

  Canvallax.Image = createElement({

    src: null,
    // (String)
    // URL of the image to be rendered. Not necessary if an image node is provided

    image: null,
    // (Node)
    // Image node to be drawn on the canvas. If not provided, a new Image node will be created.

    width: null,
    // (Number)
    // Width to render the image. Will be set to the `src` image's width if not provided.

    height: null,
    // (Number)
    // Height to render the image. Will be set to the `src` image's height if not provided.

    init: function(options){

      var img = this.image;

      img = ( img && img.nodeType === 1 ? img : options && options.nodeType === 1 ? options : new Image() );

      if ( !(img instanceof HTMLCanvasElement) ) {
        img = img.cloneNode();
      }

      // Ensure we get width/height of image for best draw performance
      imageOnload.bind(this)();
      img.onload = imageOnload.bind(this);

      img.src = img.src || options.src || options;

      this.image = img;

    },

    draw: function(ctx,coords){
      if ( this.image ) {
        ctx.drawImage(this.image, coords[0], coords[1], this.width, this.height);
      }
    }
  });
