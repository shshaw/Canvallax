

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

    _render: noop,
    // (Function)
    // Arguments: (context)
    // Callback function to actually draw the element.

    render: function(ctx,C) {

      var el = this,
          pos;

      if ( el.tracker ) {
        pos = el.tracker.render(C,el);
        if ( pos ) {
          el.x = pos.x;
          el.y = pos.y;
        }
      }

      el.preRender(ctx,C);

      if ( el.blend ) { ctx.globalCompositeOperation = el.blend; }
      ctx.globalAlpha = el.opacity;

      if ( !el.fixed && !C.transform(ctx,el.getZScale()) ) { return el; }
      if ( !el.transform(ctx) ) { return el; }

      if ( el.crop ) {
        ctx.beginPath();
        if ( typeof el.crop === 'function' ) {
          el.crop(ctx,C);
        } else {
          ctx.rect(el.crop.x, el.crop.y, el.crop.width, el.crop.height);
        }
        ctx.clip();
        ctx.closePath();
      }

      if ( el.outline ) {
        ctx.beginPath();
        ctx.rect(0, 0, el.width || el.radius * 2, el.height || el.radius * 2);
        ctx.closePath();
        ctx.strokeStyle = el.outline;
        ctx.stroke();
      }

      ctx.beginPath();
      el._render(ctx,C);
      ctx.closePath();

      if ( this.fill ) {
        ctx.fillStyle = this.fill;
        ctx.fill();
      }

      if ( this.stroke ) {
        if ( this.lineWidth ) { ctx.lineWidth = this.lineWidth; }
        ctx.strokeStyle = this.stroke;
        ctx.stroke();
      }

      el.postRender(ctx,C);

      return el;
    }

  });

  var createElement = Canvallax.createElement = createClass.bind(null,Canvallax.Element);
