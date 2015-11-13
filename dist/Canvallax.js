/*! Canvallax, v1.2.1 (built 2015-11-13) https://github.com/shshaw/Canvallax.js @preserve */
(function(){

  var win = window,
      doc = document,
      root = doc.documentElement,
      body = doc.body,
      requestAnimationFrame = win.requestAnimationFrame || win.mozRequestAnimationFrame || win.webkitRequestAnimationFrame || win.msRequestAnimationFrame || win.oRequestAnimationFrame || function(callback){ win.setTimeout(callback, 20); },

      noop = function(){},

      // Default options
      defaults = {

        tracking: 'scroll',
        // (false||'scroll'||'pointer')
        // If 'scroll', the `x` and `y` of the scene are tied to document's scroll for a typical parallax experience.
        // If 'pointer', the `x` and `y` of the scene will be tied to the pointer (mouse or touch)
        // Set to false if you want to control the scene's X and Y manually, perfect for animating with GSAP.

        trackingInvert: false,
        // (true||'invertx'||'inverty')
        // Inversion of the tracking values.
        // If true, 'invertx' or 'inverty', the appropriate axes will be reversed on scroll.

        x: 0,
        // (Number)
        // Starting x position.
        // If `tracking` is enabled, this will be overridden on render.

        y: 0,
        // (Number)
        // Starting y position.
        // If `tracking` is enabled, this will be overridden on render.

        damping: 1,
        // (Number)
        // The 'easing' of the x & y position when updated. 1 = none, higher is longer.
        // If you're syncing parallax items to regular items in the scroll, then you'll probably want a low damping.

        canvas: undefined,
        // (Node)
        // Use Canvallax on an existing canvas node, otherwise one is created.

        className: '',
        // (String)
        // Classes to add to the canvas, in addition to the 'canvallax' class automatically added.

        parent: document.body,
        // (Node)
        // Canvas is prepended to document.body by default. Override with your own node if you want it within a certain container.

        elements: undefined,
        // (Array)
        // Collection of elements to render on the Canvallax instance

        animating: true,
        // (Boolean)
        // Update canvas every requestAnimationFrame call.

        fullscreen: true,
        // (Boolean)
        // Set the canvas width and height to the size of the window, and update on window resize. Otherwise, the provided with and height will be used.

        preRender: noop,
        // (Function)
        // Callback before elements are rendered.

        postRender: noop
        // (Function)
        // Callback after elements are rendered.

      },

      // Only one scroll tracker that works for every Canvallax instance
      watchingScroll = false,
      winScrollX = 0,
      winScrollY = 0,
      onScroll = function(){
        winScrollX = root.scrollLeft || body.scrollLeft;
        winScrollY = root.scrollTop || body.scrollTop;
      },

      // Only one pointer tracker that works for every Canvallax instance
      watchingPointer = false,
      winPointerX = 0,
      winPointerY = 0,
      onPointerMove = function(e){
        winPointerX = ( e.touches ? e.touches[0].clientX : e.clientX ); // touch support
        winPointerY = ( e.touches ? e.touches[0].clientY : e.clientY ); // touch support
      };


  // Check for canvas support, exit out if no supprt
  if ( !win.CanvasRenderingContext2D ) { return win.Canvallax = function(){ return false; }; }

  win.Canvallax = function Canvallax(options) {
    // Make new instance if not called with `new Canvallax`
    if ( !(this instanceof Canvallax) ) { return new Canvallax(options); }

    var C = this;

    Canvallax.extend(this,defaults,options);

    C.canvas = C.canvas || doc.createElement('canvas');
    C.canvas.className += ' canvallax ' + C.className;

    C.parent.insertBefore(C.canvas, C.parent.firstChild);

    if ( C.fullscreen ) {
      C.resizeFullscreen();
      win.addEventListener('resize', C.resizeFullscreen.bind(C));
    } else {
      C.resize(C.width,C.height);
    }

    C.ctx = C.canvas.getContext('2d');

    C.elements = [];
    if ( options && options.elements ) { C.addElements(options.elements); }

    C.damping = ( !C.damping || C.damping < 1 ? 1 : C.damping );

    C.render();

    return C;
  }

////////////////////////////////////////

  function _zIndexSort(a,b){
    return (a.zIndex === b.zIndex ? 0 : a.zIndex < b.zIndex ? -1 : 1 );
  }

  Canvallax.prototype = {

    _x: 0,
    _y: 0,

    add: function(el){

      var elements = el.length ? el : arguments,
          len = elements.length,
          i = 0;

      for ( ; i < len; i++ ) {
        this.elements.push(elements[i]);
      }

      this.elements.sort(_zIndexSort);
      return this;
    },

    remove: function(element){
      var index = this.elements.indexOf(element);

      if ( index > -1 ) {
        this.elements.splice(index, 1);
      }
      return this;
    },

    render: function() {
      var C = this,
          i = 0,
          len = C.elements.length,
          offsetLeft = 0,
          offsetTop = 0,
          inBounds = C.fullscreen || C.tracking !== 'pointer';

      if ( C.animating ) { C.animating = requestAnimationFrame(C.render.bind(C)); }

      if ( C.tracking ) {

        if ( C.tracking === 'scroll' ) {

          if ( !watchingScroll ) {
            watchingScroll = true;
            onScroll();
            win.addEventListener('scroll', onScroll);
            win.addEventListener('touchmove', onScroll);
          }

          C.x = winScrollX;
          C.y = winScrollY;

        } else if ( C.tracking === 'pointer' ) {

          if ( !watchingPointer ) {
            watchingPointer = true;
            win.addEventListener('mousemove', onPointerMove);
            win.addEventListener('touchmove', onPointerMove);
          }

          if ( !inBounds ) {
            offsetLeft = C.canvas.offsetLeft;
            offsetTop = C.canvas.offsetTop;

            inBounds = winPointerX >= offsetLeft && winPointerX <= offsetLeft + C.width && winPointerY >= offsetTop && winPointerY <= offsetTop + C.height;
          }

          if ( inBounds ) {
            C.x = -winPointerX + offsetLeft;
            C.y = -winPointerY + offsetTop;
          }

        }

        C.x = ( inBounds && (C.trackingInvert === true || C.trackingInvert === 'invertx') ? -C.x : C.x );
        C.y = ( inBounds && (C.trackingInvert === true || C.trackingInvert === 'inverty') ? -C.y : C.y );

      }

      C._x += ( -C.x - C._x ) / C.damping;
      C._y += ( -C.y - C._y ) / C.damping;

      C.ctx.clearRect(0, 0, C.width, C.height);
      //C.ctx.scale(C.zoom,C.zoom);

      C.preRender(C.ctx,C);

      for ( ; i < len; i++ ){
        C.ctx.save();
        C.elements[i]._render(C.ctx,C);
        C.ctx.restore();
      }

      C.postRender(C.ctx,C);

      return this;
    },

    resize: function(width,height){
      this.width = this.canvas.width = width;
      this.height = this.canvas.height = height;
      return this;
    },

    resizeFullscreen: function() {
      return this.resize(win.innerWidth,win.innerHeight);
    },

    play: function(){
      this.animating = true;
      return this.render();
    },

    pause: function(){
      this.animating = false;
      return this;
    }
  };

////////////////////////////////////////

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
                x = C._x,
                y = C._y,
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

          clone: function(props){

            var props = Canvallax.extend({}, this, props);

            return new this.constructor(props);
          }

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

////////////////////////////////////////

  Canvallax.extend = function(target) {
    target = target || {};

    var length = arguments.length,
        i = 1;

    if ( arguments.length === 1 ) {
      target = this;
      i = 0;
    }

    for ( ; i < length; i++ ) {
      if ( !arguments[i] ) { continue; }
      for ( var key in arguments[i] ) {
        if ( arguments[i].hasOwnProperty(key) ) { target[key] = arguments[i][key]; }
      }
    }

    return target;
  };

////////////////////////////////////////

  var twoPI = 2 * Math.PI;

  Canvallax.Circle = Canvallax.createElement({

    size: 20,
    // (Number)
    // Radius of the circle.

    render: function(ctx) {
      ctx.beginPath();
      ctx.arc(this.x + this.size, this.y + this.size, this.size, 0, twoPI);
      ctx.closePath();
    }

  });

////////////////////////////////////////

  Canvallax.Element = Canvallax.createElement();

////////////////////////////////////////

  function imageOnload(){
    this.width = ( this.width ? this.width : this.image.width );
    this.height = ( this.height ? this.height : this.image.height );
  }

  Canvallax.Image = Canvallax.createElement({

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

      this.image = ( this.image && this.image.nodeType === 1 ? this.image : options && options.nodeType === 1 ? options : (new Image) );

      // Ensure we get width/height of image for best draw performance
      imageOnload.bind(this)();
      this.image.onload = imageOnload.bind(this);

      this.image.src = this.image.src || options.src || options;

    },

    render: function(ctx){
      if ( this.image ) {
        ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
      }
    }
  });

////////////////////////////////////////

  var twoPI = 2 * Math.PI;

  Canvallax.Polygon = Canvallax.createElement({

    sides: 6,
    // (Number)
    // Number of the polygon's sides. `3` is a triangle, `4` is a square, etc.

    size: 20,
    // (Number)
    // Radius of the polygon.

    render: function(ctx) {
      // Polygon math adapted from http://scienceprimer.com/drawing-regular-polygons-javascript-canvas
      var i = this.sides;

      ctx.translate(this.x + this.size,this.y + this.size);

      ctx.beginPath();
      ctx.moveTo(this.size, 0);

      while (i--) {
        ctx.lineTo(
          this.size * Math.cos((i * twoPI) / this.sides),
          this.size * Math.sin((i * twoPI) / this.sides)
        );
      }

      ctx.closePath();
    }

  });

////////////////////////////////////////

  Canvallax.Rectangle = Canvallax.createElement({

    width: 100,
    // (Number)
    // Width of the rectangle.

    height: 100,
    // (Number)
    // Height of the rectangle.

    render: function(ctx) {
      ctx.beginPath();
      ctx.rect(this.x, this.y, this.width, this.height);
      ctx.closePath();
    }

  });

})();