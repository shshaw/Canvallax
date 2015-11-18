  function imageOnload(){
    this.width = ( this.width ? this.width : this.image.width );
    this.height = ( this.height ? this.height : this.image.height );
  }

  Canvallax.Image = createClass(Canvallax.Element,{

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

      this.image = ( this.image && this.image.nodeType === 1 ? this.image : options && options.nodeType === 1 ? options : (new Image) );

      if ( !(this.image instanceof HTMLCanvasElement) ) {
        this.image = this.image.cloneNode();
      }

      // Ensure we get width/height of image for best draw performance
      imageOnload.bind(this)();
      this.image.onload = imageOnload.bind(this);

      this.image.src = this.image.src || options.src || options;

    },

    _render: function(ctx){
      if ( this.image ) {
        ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
      }
    }
  });