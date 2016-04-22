(function(win){

  win._clx = win._clx || [];
  win._clx.push(function(canvallax){

    'use strict';

    canvallax.Pattern = canvallax.createClass(canvallax.Scene,{
      playing: false,
      needsUpdating: true,
      repeat: 'repeat',
      fixed: false,

      init: function(){
        var pattern = this;

        pattern.canvas = document.createElement('canvas');
        pattern.resize();
        pattern.ctx = pattern.canvas.getContext('2d');

        pattern.render = pattern.fn.render.bind(pattern, pattern.ctx, pattern);

        pattern.fill = function(ctx){
          ctx.fillStyle = pattern.getPattern();
          if ( pattern.fixed ) {
            ctx.fill();
          } else {
            var coords = this.getCoords();
            ctx.translate(coords[0],coords[1]);
            ctx.fill();
            ctx.translate(-coords[0],-coords[1]);
          }
        };

        pattern.stroke = function(ctx){
          ctx.strokeStyle = pattern.getPattern();
          if ( pattern.fixed ) {
            ctx.stroke();
          } else {
            var coords = this.getCoords();
            ctx.translate(coords[0],coords[1]);
            ctx.stroke();
            ctx.translate(-coords[0],-coords[1]);
          }
        };

      },

      // Cache pattern
      getPattern: function(){
        this.pattern = ( !this.pattern || this.needsUpdating ? this.ctx.createPattern(this.canvas,this.repeat) : this.pattern );
        return this.pattern;
      },

      // Only update pattern if pattern canvas is re-rendered
      _render: function(){ this.needsUpdating = true; }

    });

  });

})(window || this);
