(function(win){

  var canvallax = win.canvallax || {};
  win.canvallax = canvallax;

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

      pattern.fill = function(ctx,parent){
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

      pattern.stroke = function(ctx,parent){
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

    _render: function(){ this.needsUpdating = true; },

    getPattern: function(){
      this.pattern = ( !this.pattern || this.needsUpdating ? this.ctx.createPattern(this.canvas,this.repeat) : this.pattern );
      return this.pattern;
    },

    getFixed: function(){ return this.fixed; },

  /*
    fill: function(ctx,parent){
      ctx.fillStyle = this.fill.pattern.getPattern();
      if ( this.fill.pattern.fixed ) {
        ctx.fill();
      } else {
        var coords = this.getCoords();
        ctx.translate(coords[0],coords[1]);
        ctx.fill();
        ctx.translate(-coords[0],-coords[1]);
      }
    },

    stroke: function(ctx,parent){
      ctx.strokeStyle = this.stroke.pattern.getPattern();
      if ( this.stroke.pattern.fixed ) {
        ctx.stroke();
      } else {
        var coords = this.getCoords();
        ctx.translate(coords[0],coords[1]);
        ctx.stroke();
        ctx.translate(-coords[0],-coords[1]);
      }
    }
  */
  });


}(this))
