  Canvallax.createElement = (function(){

    function _getTransformPoint(el){

      var checksum = _makePointChecksum(el);

      if ( !el._pointCache || el._pointChecksum !== checksum ) {
        el._pointCache = el.getTransformPoint();
        el._pointChecksum = checksum;
      }

      return el._pointCache;
    }

    function _makePointChecksum(el){
      return [el.transformOrigin,el.x,el.y,el.width,el.height,el.size].join(' ');
    }

    var rad = Math.PI / 180,
        elementPrototype = {

          x: 0,
          // (Number)
          // Horizontal position within the Canvallax canvas

          y: 0,
          // (Number)
          // Vertical position within the Canvallax canvas

          distance: 1,
          // (Number)
          // How far away from the camera, essentially controlling the speed of the elements movement.
          // If `scale` is not set to `false`, the element's distance value also affects the size, making elements appear closer or farther away.
          // `1` means the element will move at the same speed as the Canvallax instance, `0.5` means half speed, `2` means twice the speed.

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
          // (Number||`false`)
          // How large the element should be rendered relative to its natural size, affected by the `transformOrigin` property.
          // Scaling will be in addition to the `distance` property's scaling.
          // If `false`, the element will not be scaled with the `distance` property.

          rotation: 0,
          // (Number)
          // Amount of rotation in degrees (0-360), affected by the `transformOrigin` property.

          preRender: noop,
          // (Function)
          // Arguments: (C.context,C) where C is the Canvallax instance that the element is being rendered on.
          // Callback function triggered before the element is rendered.

          render: noop,
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

          getTransformPoint: function(){
            var el = this,
                origin = el.transformOrigin.split(' '),
                point = {
                  x: el.x,
                  y: el.y
                };

            if ( origin[0] === 'center' ) {
              point.x += ( el.width ? el.width / 2 : el.size );
            } else if ( origin[0] === 'right' ) {
              point.x += ( el.width ? el.width : el.size * 2 );
            }

            if ( origin[1] === 'center' ) {
              point.y += ( el.height ? el.height / 2 : el.size );
            } else if ( origin[1] === 'bottom' ) {
              point.y += ( el.height ? el.height : el.size * 2 );
            }

            return point;
          },

          _render: function(ctx,C) {
            var el = this,
                distance = el.distance || 1,
                x = C.x,
                y = C.y,
                transformPoint = _getTransformPoint(el);

            el.preRender.call(el,ctx,C);

            if ( el.blend ) { C.ctx.globalCompositeOperation = el.blend; }
            C.ctx.globalAlpha = el.opacity;

            C.ctx.translate(transformPoint.x, transformPoint.y);

            if ( el.scale === false ) {
              x *= distance;
              y *= distance;
            } else {
              C.ctx.scale(distance, distance);
            }

            if ( !el.fixed ) { C.ctx.translate(x, y); }
            if ( el.scale !== false ) { C.ctx.scale(el.scale, el.scale); }
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
              ctx.rect(el.x, el.y, el.width || el.size * 2, el.height || el.size * 2);
              ctx.closePath();
              ctx.strokeStyle = el.outline;
              ctx.stroke();
            }

            el.render.call(el,ctx,C);

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

          clone: Canvallax.clone

        };

    return function(defaults){

      function El(options) {
        if ( !(this instanceof El) ) { return new El(options); }

        Canvallax.extend(this,options);
        this.init.apply(this,arguments);

        return this;
      }

      El.prototype = Canvallax.extend({},elementPrototype,defaults);
      El.prototype.constructor = El;
      El.clone = El.prototype.clone;

      return El;
    };

  })();