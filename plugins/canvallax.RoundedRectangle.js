(function(win){

  win._clx = win._clx || [];
  win._clx.push(function(canvallax){

    'use strict';

    canvallax.RoundedRectangle = canvallax.createClass(canvallax.Rectangle,{

      radius: 5,

      draw: function(ctx,coords) {

        // Adapted from http://stackoverflow.com/a/3368118/1012919

        var x = coords[0],
            y = coords[1],
            width = this.width,
            height = this.height,
            radius = this.radius;

        if (typeof radius === 'number') {
          radius = { tl: radius, tr: radius, br: radius, bl: radius };
        }

        ctx.moveTo(x + (radius.tl || 0), y);
        ctx.lineTo(x + width - (radius.tr || 0), y);
        ctx.quadraticCurveTo(x + width, y, x + width, y + radius.tr);
        ctx.lineTo(x + width, y + height - (radius.br || 0));
        ctx.quadraticCurveTo(x + width, y + height, x + width - (radius.br || 0), y + height);
        ctx.lineTo(x + (radius.bl || 0), y + height);
        ctx.quadraticCurveTo(x, y + height, x, y + height - (radius.bl || 0));
        ctx.lineTo(x, y + (radius.tl || 0 ));
        ctx.quadraticCurveTo(x, y, x + ( radius.tl || 0), y);

      }
    });

  });

})(window || this);
