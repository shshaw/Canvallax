  var rad = Math.PI / 180,
      elementPrototype = {
        x: 0,
        y: 0,
        opacity: 1,
        distance: 1,
        fixed: false,

        scale: 1,
        rotation: 0,
        transformOrigin: 'center',

        preRender: noop,
        postRender: noop,
        render: noop,
        init: noop,

        _render: function(ctx,C) {
          var el = this,
              distance = el.distance || 1,
              x = C._x,
              y = C._y,
              centerX = el.x,
              centerY = el.y;

          el.preRender.call(el,ctx,C);

          if ( el.blend ) { C.ctx.globalCompositeOperation = el.blend; }
          C.ctx.globalAlpha = el.opacity;

          if ( el.transformOrigin === 'center' ) {
            centerX += ( el.width ? el.width / 2 : el.size );
            centerY += ( el.height ? el.height / 2 : el.size );
          }

          if ( el.scale === false ) {
            x *= distance;
            y *= distance;
          }

          if ( el.scale || el.scale === 0 ) {
            C.ctx.translate(centerX, centerY);
            C.ctx.scale(distance * el.scale, distance * el.scale);
            C.ctx.translate(-centerX, -centerY);
          }

          if ( !el.fixed ) { C.ctx.translate(x, y); }

          if ( el.rotation ) {
            C.ctx.translate(centerX, centerY);
            C.ctx.rotate(el.rotation * rad);
            C.ctx.translate(-centerX, -centerY);
          }

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