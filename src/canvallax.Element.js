
canvallax.Element = createClass(core,
  /** @lends Element.prototype */
  {
    /**
     * Object type
     * @type {string}
     * @default
     */
    type: 'element',

    fill: null,
    // (Color||`false`)
    // Fill in the element with a color.

    stroke: null,
    // (Color||`false`)
    // Add a stroke to the element.

    lineWidth: null,
    // (Number)
    // Width of the stroke.

    opacity: 1,
    // (Number)
    // Element's transparency. `0` is fully transparent and will not be rendered, `1` is fully opaque.

    zIndex: null,
    // (`false`||Boolean)
    // Stacking order of the element.
    // Higher numbers are rendered last making them appear on top of lower zIndex elements.
    // If `false`, the element's `z` property will be used.

    fixed: false,
    // (Boolean)
    // If `false`, the element will move with scene
    // If `true`, the element will remain locked into its `x` and `y` positions.

    crop: null,
    // (Object||Function)
    // Crop the element by providing an object with the `x`, `y`, `width` and `height` of a rectangle, relative to the canvas origin.
    // A callback function can also be used to draw the path for cropping the element.

    draw: null,

    _render: function(ctx,parent){
      var me = this,
          pCoords = parent.getCoords(),
          coords = me.getCoords(pCoords, false);

      if ( me.blend ) { ctx.globalCompositeOperation = me.blend; }

      if ( me.opacity <= 0 ) { return me; }
      ctx.globalAlpha = me.opacity;

      if ( !me.fixed && parent && !parent.transform(ctx, false, me.getZScale()) ) { return me; }
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

      if ( me.blend ) { ctx.globalCompositeOperation = "source-over"; }
    }
    // (Function)
    // Arguments: (context)
    // Callback function to actually draw the element.

  });

var createElement = canvallax.createElement = createClass.bind(null,canvallax.Element);
