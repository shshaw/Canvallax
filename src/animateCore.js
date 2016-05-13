
/**
 * An array-like object that groups all `requestAnimationFrame` calls into one.
 */

var animations = extend({},arrayLike,{

  animate: function(){

    var len = animations.length,
        el;

    if ( !animations.playing || len === 0  ) { animations.stop(); return; }
    while(len--){
      el = animations[len];
      if ( el && el.playing && ( el.render && !el.render() )) { el.stop(); }
    }

    animations.frame = requestAnimationFrame(animations.animate);

  },

  play: function(){
    animations.frame = animations.frame || requestAnimationFrame(animations.animate);
    animations.playing = true;
  },

  stop: function(){
    animations.playing = false;
    animations.frame = null;
  },

  kill: function(){
    animations.stop();
    return animations.splice(0);
  }
});

canvallax.animations = animations;


/**
 *
 * Shared properties for classes that need to re-render every `requestAnimationFrame`.
 *
 * @mixin animateCore
 *
 */

var animateCore = {

    /**
     * Play the animation by adding it to the main `requestAnimationFrame` call.
     *
     * @method
     * @memberof! animateCore
     */

    play: function(){
      this.playing = true;

      var index = animations.indexOf(this);
      if ( index == -1 ) { animations[ ( this.animateLast ? 'unshift' : 'push' ) ](this); }
      animations.play();
      return this;
    },

    /**
     * Stop the animation by removing it from the main `requestAnimationFrame` call.
     *
     * @method
     * @memberof! animateCore
     */
    stop: function(){
      this.playing = false;
      var index = animations.indexOf(this);
      if ( index > -1 ) { animations.splice(index, 1); }
      return this;
    }

  };
