  function imageOnload(img){
    img.width = ( img.width ? img.width : img.image.width );
    img.height = ( img.height ? img.height : img.image.height );
  }

  /**
   * Image class for drawing an <img> or <canvas> Element on a Canvallax scene
   * @class Core
   */

  canvallax.Image = createElement({
    /**
     * Object type
     * @type {string}
     * @default
     */
    type: 'image',

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

      // Clone the element unless it's Canvas
      if ( !(img instanceof HTMLCanvasElement) ) { img = img.cloneNode(); }

      this.image = img;

      // Ensure we get width/height of image for best draw performance
      imageOnload(this);
      img.onload = imageOnload.bind(null,this);

      img.src = img.src || options.src || options;
    },

    draw: function(ctx,coords){
      if ( this.image ) {
        ctx.drawImage(this.image, coords[0], coords[1], this.width, this.height);
      }
    }
  });
