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