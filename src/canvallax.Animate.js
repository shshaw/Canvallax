
  // Easing functions adapted from http://greweb.me/2012/02/bezier-curve-based-easing-functions-from-concept-to-implementation/
  var ease = {

    linear: function(t){ return t },

    inQuad: function(t){ return t*t },
    outQuad: function(t){ return t*(2-t) },
    inOutQuad: function(t){ return t<.5 ? 2*t*t : -1+(4-2*t)*t },

    inCubic: function(t){ return t*t*t },
    outCubic: function(t){ return (--t)*t*t+1 },
    inOutCubic: function(t){ return t<.5 ? 4*t*t*t : (t-1)*(2*t-2)*(2*t-2)+1 },

    inQuart: function (t){ return t*t*t*t },
    outQuart: function (t){ return 1-(--t)*t*t*t },
    inOutQuart: function(t){ return t<.5 ? 8*t*t*t*t : 1-8*(--t)*t*t*t }

  };

  canvallax.ease = ease;

  function Animate(target,duration,to,opts){

    if (!(this instanceof Animate)) { return new Animate(target,duration,to,opts); }

    var me = this,
        key;

    extend(me,opts);

    me.target = target;
    me.to = to;

    if ( !me.from ) {
      me.from = {};
      for (key in to){ me.from[key] = target[key]; }
    }

    me.duration(duration);
    me.tick = me.tick.bind(me);
    me.restart();

    return me;
  }

  Animate.prototype = {
    repeat: 0,
    ease: ( ease ? ease.inOutQuad : function(t){ return t; } ),
    duration: function(dur){ if ( dur ) { this._d = dur * 1000; } else { return this._d / 1000 }},

    play: function(){
      this.playing = true;
      requestAnimationFrame(this.tick);
    },

    stop: function(){ this.playing = false; },

    restart: function(){
      this._s = new Date;
      if ( this.onStart ) { this.onStart(); }
      this.play();
    },

    reverse: function(){
      this.reversed = !this.reversed;
      this.restart();
    },

    tick: function(){
      var me = this,
          progress = (new Date - me._s) / me._d,
          delta, key;

      if ( !me.playing ) { return; }
      if ( progress > 1 ) { progress = 1; }

      delta = me.ease(me.reversed ? 1 - progress : progress );
      for (key in me.to){
        me.target[key] = me.from[key] + (me.to[key] - me.from[key]) * delta;
      }

      if ( me.onUpdate && me.onUpdate() === false ) { return; }

      if ( progress === 1 ) {
        if ( me.onComplete ) { me.onComplete(); }
        if ( me.yoyo ) { me.reversed = !me.reversed; }
        if ( me.repeat != 0) { me.repeat--; me.restart(); }
        return;
      }

      requestAnimationFrame(me.tick);
    }
  };

  Animate.from = function(target,duration,from,options){
    var to = {};
    for (var key in from){ to[key] = target[key]; }
    options = options || {};
    options.from = from;
    return new Animate(target,duration,to,options);
  };

  Animate.fromTo = function(target,duration,from,to,options){
    options = options || {};
    options.from = from;
    return new Animate(target,duration,to,options);
  };

  canvallax.Animate = Animate;

  core.to = core.animate = function(d,t,o){ return new Animate(this,d,t,o); };
  core.from = function(d,f,o){ return new Animate.from(this,d,f,o); };
  core.fromTo = function(d,f,t,o){ return new Animate.fromTo(this,d,f,t,o); };
