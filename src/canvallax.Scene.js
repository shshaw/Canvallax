/**
 * Canvallax Scenes are where elements are rendered, essentially a fancy wrapper for a `<canvas>` element.
 *
 * If you're using the default `fullscreen` setup, then you probably want these styles:
 *
 * ```css
 * .canvallax {
 *   position: fixed;
 *   top: 0;
 *   left: 0;
 *   z-index: -1;
 * }
 * ```
 *
 * @class
 * @mixes core|animateCore
 * @extends canvallax.Group
 * @memberof canvallax
 *
 * @param {object} options - Object containing properties to be applied to the new `canvallax.Scene` instance. Reference the properties below for
 *
 * @property {HTMLCanvasElement} canvas=null - `<canvas>` element the scene should be rendered on. Creates a new `<canvas>` by default
 * @property {node} parentElement=document.body - Node the `<canvas>` should be appended to upon initialization.
 * @property {string} className=null - Classes to add to the canvas, in addition to the `'canvallax'` class automatically added.
 * @property {boolean} fullscreen=true - Set the canvas width and height to the size of the window, and update on window resize.
 * @property {boolean} clearFrames=true - Should the canvas be cleared before rendering?
 * @property {number} width=null - Width of the `<canvas>`, set automatically if `fullscreen` is true or a `<canvas>` element is provided
 * @property {number} height=null - Heightof the `<canvas>`, set automatically if `fullscreen` is true or a `<canvas>` element is provided
 * @property {boolean} playing=true - If true, the scene will be re-rendered each `requestAnimationFrame`
 *
 * @example
 * // draw scene to an existing `<canvas>`.
 * var scene = canvallax.Scene({
          fullscreen: false,
 *        canvas: document.getElementById('#myCanvas')
 *      });
 *
 */

var styles = '<style>.canvallax--fullscreen { position: fixed; top: 0; left: 0; z-index: -1; }</style>';

canvallax.Scene = createClass(canvallax.Group,animateCore,
  /** @lends canvallax.Scene# */
  {

    type: 'scene',

    parentElement: body,
    className: '',

    fullscreen: true,
    includeStyles: true,

    playing: true,
    clearFrames: true,

    /**
     * Function to clear the canvas context if `clearFrames` is true.
     * @type {function}
     * @param {CanvasRenderingContext2D} ctx - 2d canvas context
     * @memberof! canvallax.Scene
     */
    clear: function(ctx){
      ctx.clearRect(0, 0, this.width, this.height);
      return this;
    },

    /**
     * Resize the `<canvas>`
     * @type {function}
     * @param {number} width
     * @param {number} height
     * @memberof! canvallax.Scene
     */
    resize: function(width,height){
      this.width = this.canvas.width = width || this.width;
      this.height = this.canvas.height = height || this.height;
      return this;
    },

    /**
     * Resize the `<canvas>` to fit the full `window`
     * @type {function}
     * @memberof! canvallax.Scene
     */
    resizeFullscreen: function() {
      this.resize(win.innerWidth,win.innerHeight);
      return this;
    },

    /**
     * @param {Object} [options] Options object
     * @memberof! canvallax.Scene
     */
    init: function(options){
      var me = this;

      if ( !me.canvas ) {
        me.canvas = doc.createElement('canvas');
        me.parentElement.insertBefore(me.canvas, me.parentElement.firstChild);
      }

      me.ctx = me.canvas.getContext('2d');

      me.className += ' canvallax ';

      if ( me.fullscreen ) {

        if ( styles && me.includeStyles ) {
          doc.head.insertAdjacentHTML('afterbegin',styles);
          styles = null;
        }

        me.className += ' canvallax--fullscreen ';

        me.resizeFullscreen();
        win.addEventListener('resize', me.resizeFullscreen.bind(me));
      } else {
        me.resize(me.width || me.canvas.width, me.height || me.canvas.height);
      }

      me.canvas.className += me.className;

      if ( options && options.children ) { me.add(options.children); }

      me.render = me.render.bind(me,me.ctx,me);
      if ( me.playing ) { me.play(); }
    }

  });

