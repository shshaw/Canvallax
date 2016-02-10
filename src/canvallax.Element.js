
canvallax.Element = createClass(core,
  /** @lends Element.prototype */
  {
    /**
     * Object type
     * @type {string}
     * @default
     */
    type: 'element',

    _render: function(ctx,parent){
      var me = this,
          pCoords = parent.getCoords(),
          coords = me.getCoords(pCoords, false);

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
    }
    // (Function)
    // Arguments: (context)
    // Callback function to actually draw the element.

  });

var createElement = canvallax.createElement = createClass.bind(null,canvallax.Element);

