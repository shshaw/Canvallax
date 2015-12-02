  // Cache the getTransformPoint value until the checksumed values change.
  function _getTransformPoint(el){

    var checksum = _makePointChecksum(el);

    if ( !el._pointCache || el._pointChecksum !== checksum ) {
      el._pointCache = el.getTransformPoint();
      el._pointChecksum = checksum;
    }

    return el._pointCache;
  }

  function _makePointChecksum(el){
    return [el.transformOrigin,el.x,el.y,el.width,el.height,el.radius].join(' ');
  }

  var rad = Math.PI / 180;

  Canvallax.Element = createClass({

    x: 0,
    // (Number)
    // Horizontal position within the Canvallax canvas

    y: 0,
    // (Number)
    // Vertical position within the Canvallax canvas

    z: 0,
    // (Number)
    // Element proximity to the Canvallax 'camera', typically within the range of -1 to 1.
    // `z` affects speed of the element relative to the Canvallax instance's `x` & `y`.
    // `0` means the element will move at the same speed as the Canvallax instance
    // `-0.5` will move half speed, `1` will move twice as fast.

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

    opacity: 1,
    // (Number)
    // Element's transparency. `0` is invisible, `1` is fully visible.

    fill: false,
    // (Color||`false`)
    // Fill in the element with a color.

    stroke: false,
    // (Color||`false`)
    // Add a stroke to the element.

    lineWidth: false,
    // (Number)
    // Width of the stroke.

    transformOrigin: 'center center',
    // (String)
    // Where the element's transforms will occur, two keywords separated by a space.
    // The default of `'center center'` means that `rotation` and `scale` transforms will occur from the center of the element.
    // The first keyword can be `left`, `center` or `right` cooresponding to the appropriate horizontal position.
    // The second keyword can be `top`, `center` or `bottom` cooresponding to the appropriate vertical position.

    scale: 1,
    // (Number)
    // How large the element should be rendered relative to its natural size, affected by the `transformOrigin` property.
    // Scaling will be in addition to the `z` property's scaling.

    rotation: 0,
    // (Number)
    // Amount of rotation in degrees (0-360), affected by the `transformOrigin` property.

    preRender: noop,
    // (Function)
    // Arguments: (C.context,C) where C is the Canvallax instance that the element is being rendered on.
    // Callback function triggered before the element is rendered.

    _render: noop,
    // (Function)
    // Arguments: (C.context,C) where C is the Canvallax instance that the element is being rendered on.
    // Callback function to actually draw the element.
    // If you're using a built-in element type, you usually won't want to overwrite this.

    postRender: noop,
    // (Function)
    // Arguments: (C.context,C) where C is the Canvallax instance that the element is being rendered on.
    // Callback function triggered after the element is rendered.

    init: noop,
    // (Function)
    // Callback function triggered when the element is first created.
    // Receives all arguments passed to the element's creation function.

    crop: false,
    // (Object||Function)
    // Crop the element by providing an object with the `x`, `y`, `width` and `height` of a rectangle, relative to the canvas origin.
    // A callback function can also be used to draw the path for cropping the element.

    getZScale: function(){ return (this.z+1)/1; },
    // Returns the element's scale

    getTransformPoint: function(){
      var el = this,
          origin = el.transformOrigin.split(' '),
          point = {
            x: el.x,
            y: el.y
          };

      if ( origin[0] === 'center' ) {
        point.x += ( el.width ? el.width / 2 : el.radius );
      } else if ( origin[0] === 'right' ) {
        point.x += ( el.width ? el.width : el.radius * 2 );
      }

      if ( origin[1] === 'center' ) {
        point.y += ( el.height ? el.height / 2 : el.radius );
      } else if ( origin[1] === 'bottom' ) {
        point.y += ( el.height ? el.height : el.radius * 2 );
      }

      return point;
    },

    render: function(ctx,C) {
      var el = this,
          x = C.x,
          y = C.y,
          z = this.getZScale(),
          transformPoint = _getTransformPoint(el);

      if ( el.tracker ) {
        var pos = el.tracker.render(C,el);
        if ( pos ) {
          el.x = pos.x;
          el.y = pos.y;
        }
      }

      el.preRender.call(el,ctx,C);

      if ( el.blend ) { C.ctx.globalCompositeOperation = el.blend; }
      C.ctx.globalAlpha = el.opacity;

      C.ctx.translate(transformPoint.x, transformPoint.y);

      // The canvas coordinates are scaled, even if the element is not
      if ( el.zScale === false ) {
        x *= z;
        y *= z;
      } else {
        C.ctx.scale(z, z);
      }

      if ( !el.fixed ) { C.ctx.translate(x, y); }
      C.ctx.scale(el.scale, el.scale);
      if ( el.rotation ) { C.ctx.rotate(el.rotation * rad); }

      C.ctx.translate(-transformPoint.x, -transformPoint.y);

      if ( el.crop ) {
        ctx.beginPath();
        if ( typeof el.crop === 'function' ) {
          el.crop.call(el,ctx,C);
        } else {
          ctx.rect(el.crop.x, el.crop.y, el.crop.width, el.crop.height);
        }
        ctx.clip();
        ctx.closePath();
      }

      if ( el.outline ) {
        ctx.beginPath();
        ctx.rect(el.x, el.y, el.width || el.radius * 2, el.height || el.radius * 2);
        ctx.closePath();
        ctx.strokeStyle = el.outline;
        ctx.stroke();
      }

      ctx.beginPath();
      el._render.call(el,ctx,C);
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

      el.postRender.call(el,ctx,C);

      return el;
    },

    clone: clone

  });

  var createElement = Canvallax.createElement = createClass.bind(null,Canvallax.Element);