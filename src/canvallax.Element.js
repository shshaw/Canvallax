/**
 * Elements are everything drawn on the Canvallax canvas. Element instances can be created either by calling `new canvallax.Element` or simply `canvallax.Element`.
 *
 * `canvallax.Element` is a class that doesn't do much by itself, but rather is the framework for the other elements like `{@link canvallax.Ellipse}` and `{@link canvallax.Image}`, and allows you to create your own custom elements.
 *
 * In order to be rendered, Canvallax Element instances need to have a `draw` function and be added to a `{@link canvallax.Scene}` or `{@link canvallax.Group}`. Most elements will also need a `fill` or `stroke` to be visible.
 *
 * @mixin
 * @mixes core
 * @memberOf canvallax
 * @returns {canvallax.Element}
 *
 * @property {canvallax.Scene|canvallax.Group} parent=null - Parent object, automatically assigned when added to a `{@link canvallax.Scene}` or `{@link canvallax.Group}`.
 * @property {string} fill=null - Fill color
 * @property {string} stroke=null - Stroke color
 * @property {number} lineWidth=1 - Width of the stroke, if `stroke` is set.
 * @property {number} zIndex=null - Stacking order of the element, higher numbers are rendered last making them appear on top of lower zIndex elements. Defaults to `z` property
 * @property {boolean} fixed=null - If false, the element will be relative to parent, otherwise it will render fixed on the canvas.
 *
 * @example
 * var scene = canvallax.Scene(),
 *     rect = canvallax.Rectangle(); // A type of canvallax.Element
 *
 * scene.add(rect);
 */

canvallax.Element = createClass(core,
  /** @lends canvallax.Element# */
  {

    type: 'element',

    lineWidth: 1,

    _render: function(ctx,parent){
      var me = this,
          pCoords = parent.getCoords(),
          coords = me.getCoords(pCoords, false);

      if ( !me.fixed && parent && !parent.transform(ctx, false, me.z) ) { return me; }
      if ( !me.transform(ctx,pCoords) ) { return me; }

      if ( me.draw ) {
        ctx.beginPath();
        me.draw(ctx,coords,parent);
      }

      if ( me.fill ) {
        ctx.fillStyle = me.fill;
        ctx.fill();
      }

      if ( me.stroke ) {
        if ( me.lineWidth ) { ctx.lineWidth = me.lineWidth; }
        ctx.strokeStyle = me.stroke;
        ctx.stroke();
      }
    }

    /**
     * Callback to draw the element on the context.
     * @callback draw
     * @param {CanvasRenderingContext2D} ctx - 2d canvas context
     * @param {array} coords - Array of the calculated `x` and `y` coordinates
     * @param {canvallax.Scene|canvallax.Group} parent - Parent object, usually a `{@link canvallax.Scene}`
     * @memberof! canvallax.Element
     */

  });

/**
 * Creates a custom Canvallax Element.
 * @memberOf canvallax
 * @method
 */
var createElement = canvallax.createElement = createClass.bind(null,canvallax.Element);

