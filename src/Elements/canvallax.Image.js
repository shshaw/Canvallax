function imageOnload(img){
  img.width = ( img.width ? img.width : img.image.width );
  img.height = ( img.height ? img.height : img.image.height );
}

/**
 * Image class for drawing an `<img>` or `<canvas>` Element on a Canvallax scene.
 *
 * The element's `width` and `height` are set on image load unless already provided.
 *
 * @class canvallax.Image
 * @mixes core
 * @extends canvallax.Element
 * @memberOf canvallax
 *
 * @param {object|string} options - Object containing properties to be applied to the new `canvallax.Image` instance, or a string containing the URL of the image src to be used.
 *
 * @property {HTMLImageElement|HTMLCanvasElement|HTMLVideoElement} image=null - Image element to draw. Will be created on initialization if not provided.
 * @property {string} src=null - URL of the image to draw, subject to [cross origin policies]{@link https://developer.mozilla.org/en-US/docs/Web/HTML/CORS_enabled_image}
 * @property {number} width=null - Width of the image. Set onload if not provided.
 * @property {number} height=null - Height of the image. Set onload if not provided.
 *
 * @example
 * var img = canvallax.Image('myimage.jpg'); // src can be provided as only parameter on init.
 * @example
 * var img = canvallax.Image({
 *          src: 'myimage.jpg'
 *          width: 300, // Ignore the images actual dimensions, and render at a specific width
 *          height: 100 // Ignore the images actual dimensions, and render at a specific height
 *       });
 */

canvallax.Image = createElement(
  /** @lends canvallax.Image# */
  {
    type: 'image',

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
