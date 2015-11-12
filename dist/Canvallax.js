/*! Canvallax, v1.1.0 (built 2015-11-12) */
(function(){

  var W = window,
      D = document,
      R = D.documentElement,
      B = D.body,
      requestAnimationFrame = W.requestAnimationFrame || W.mozRequestAnimationFrame || W.webkitRequestAnimationFrame || W.msRequestAnimationFrame || W.oRequestAnimationFrame || function(callback){ W.setTimeout(callback, 20); },

      noop = function(){},

      // Default options
      defaults = {

        scroll: true,
        // (Boolean||'invert'||'invertx'||'inverty')
        // If true, the X and Y of the scene are tied to document's scroll for a typical parallax experience.
        // If 'invert'||'invertx'||'inverty', the appropriate axes will be reversed on scroll.
        // Set to false if you want to control the scene's X and Y manually, perfect for animating with GSAP.

        x: 0,
        // (Number)
        // Starting x position.
        // If tied to scroll, this will be overridden on render.

        y: 0, // (Number)
        // Starting y position.
        // If tied to scroll, this will be overridden on render.

        damping: 1,
        // (Number)
        // The 'easing' of the x & y position when updated. 1 = none, higher is longer.
        // If you're syncing parallax items to regular items in the scroll, then you'll probably want a low damping.

        canvas: undefined,
        // (Node)
        // Use Canvallax on an existing canvas node, otherwise one is created.

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
      Wscrollx = 0,
      Wscrolly = 0,
      onScroll = function(){
        Wscrollx = R.scrollLeft || B.scrollLeft;
        Wscrolly = R.scrollTop || B.scrollTop;
      };


  // Check for canvas support, exit out if no supprt
  if ( !W.CanvasRenderingContext2D ) { return W.Canvallax = function(){ return false; }; }

  W.Canvallax = function Canvallax(options) {
    // Make new instance if not called with `new Canvallax`
    if ( !(this instanceof Canvallax) ) { return new Canvallax(options); }

    var C = this;

    Canvallax.extend(this,defaults,options);

    C.canvas = C.canvas || D.createElement('canvas');
    C.canvas.className = 'canvallax ' + C.className;

    C.parent.insertBefore(C.canvas, C.parent.firstChild);

    if ( C.fullscreen ) {
      C.resizeFullscreen();
      W.addEventListener('resize', C.resizeFullscreen.bind(C));
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
          len = C.elements.length;

      if ( C.animating ) { C.animating = requestAnimationFrame(C.render.bind(C)); }

      if ( C.scroll ) {
        if ( !watchingScroll ) {
          watchingScroll = true;
          onScroll();
          W.addEventListener('scroll', onScroll);
          W.addEventListener('touchmove', onScroll);
        }
        C.x = ( C.scroll === 'invert' || C.scroll === 'invertx' ? -Wscrollx : Wscrollx );
        C.y = ( C.scroll === 'invert' || C.scroll === 'inverty' ? -Wscrolly : Wscrolly );
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
      return this.resize(W.innerWidth,W.innerHeight);
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
        y: 0,
        fixed: false,
        distance: 1,

        fill: '#000',
        opacity: 1,

        scale: 1,
        rotation: 0,
        transformOrigin: 'center center',

        preRender: noop,
        postRender: noop,
        render: noop,
        init: noop,

        _pointChecksum: false,
        _pointCache: false,

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

  Canvallax.createElement = function(defaults){

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

  Canvallax.Element = Canvallax.createElement();

////////////////////////////////////////

  var twoPI = 2 * Math.PI;

  Canvallax.Circle = Canvallax.createElement({
    size: 20,
    render: function(ctx) {
      ctx.beginPath();
      ctx.arc(this.x + this.size, this.y + + this.size, this.size, 0, twoPI);
      ctx.closePath();
    }
  });

////////////////////////////////////////

  function imageOnload(){
    this.width = ( this.width ? this.width : this.image.width );
    this.height = ( this.height ? this.height : this.image.height );
  }

  Canvallax.Image = Canvallax.createElement({
    fill: false,
    init: function(options){

      this.image = ( this.image ? this.image : options.nodeType ? options : (new Image) ).cloneNode();

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
    size: 20,
    rotation: 30,
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
    height: 100,
    render: function(ctx) {
      ctx.beginPath();
      ctx.rect(this.x, this.y, this.width, this.height);
      ctx.closePath();
    }
  });

})();