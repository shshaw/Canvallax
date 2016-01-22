
  Canvallax.Element = createClass(Core,{

    fill: false,
    // (Color||`false`)
    // Fill in the element with a color.

    stroke: false,
    // (Color||`false`)
    // Add a stroke to the element.

    lineWidth: false,
    // (Number)
    // Width of the stroke.

    opacity: 1,
    // (Number)
    // Element's transparency. `0` is invisible, `1` is fully visible.

    scale: 1,
    // (Number)
    // How large the element should be rendered relative to its natural size, affected by the `transformOrigin` property.
    // Scaling will be in addition to the `z` property's scaling.

    zIndex: false,
    // (`false`||Boolean)
    // Stacking order of the element.
    // Higher numbers are rendered last making them appear on top of lower zIndex elements.
    // If `false`, the element's `z` property will be used.

    zScale: true,
    // (Boolean)
    // Scale based on the `z` property, making elements appear closer or farther away.

    fixed: false,
    // (Boolean)
    // If `false`, the element will move with Canvallax
    // If `true`, the element will remain locked into its `x` and `y` positions.

    crop: false,
    // (Object||Function)
    // Crop the element by providing an object with the `x`, `y`, `width` and `height` of a rectangle, relative to the canvas origin.
    // A callback function can also be used to draw the path for cropping the element.

    draw: false,

    _render: function(ctx,parent){

      var coords = this.getCoords(parent);

      if ( this.blend ) { ctx.globalCompositeOperation = this.blend; }

      if ( this.opacity <= 0 ) { return this; }
      ctx.globalAlpha = this.opacity;

      if ( !this.fixed && !parent.transform(ctx,false,this.getZScale()) ) { return this; }
      if ( !this.transform(ctx,coords) ) { return this; }

      if ( this.crop ) { this._crop(ctx,parent); }

      if ( this.outline ) {
        ctx.beginPath();
        ctx.rect(coords[0], coords[1], this.width || this.radius * 2, this.height || this.radius * 2);
        ctx.closePath();
        ctx.strokeStyle = this.outline;
        ctx.stroke();
      }

      if ( this.draw ) {
        ctx.beginPath();
        this.draw(ctx,coords,parent);
        ctx.closePath();
      }

      if ( this.fill ) {
        ctx.fillStyle = this.fill;
        ctx.fill();
      }

      if ( this.stroke ) {
        if ( this.lineWidth ) { ctx.lineWidth = this.lineWidth; }
        ctx.strokeStyle = this.stroke;
        ctx.stroke();
      }
    }
    // (Function)
    // Arguments: (context)
    // Callback function to actually draw the element.

  });

  var createElement = Canvallax.createElement = createClass.bind(null,Canvallax.Element);
