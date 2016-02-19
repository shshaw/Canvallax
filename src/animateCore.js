
/**
 * An array-like object that groups all `requestAnimationFrame` calls into one.
 */

var animations = canvallax.animations = {

  length: 0,
  push: arr.push,
  indexOf: arr.indexOf,
  splice: arr.splice,

  animate: function(){

    var i = 0,
        len = animations.length,
        el;

    if ( !animations.playing || len === 0  ) { animations.stop(); return; }

    for (; i < len; i++) {
      el = animations[i];
      if ( el.playing && ( el.render && !el.render() )) { el.stop(); }// ) { el.animate(); }
    }

    requestAnimationFrame(animations.animate);

  },

  play: function(){
    if ( !animations.playing ) { requestAnimationFrame(animations.animate); }
    animations.playing = true;
  },

/*
  pause: function(){
    var i = 0,
        len = animations.length,
        el;

    for (; i < len; i++) {
      el = animations[i];
      if ( el.pause ) { el.pause(); }
    }
  },
*/

  stop: function(){ animations.playing = false; },

  kill: function(){ return animations.splice(0); }
};


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
    if ( index == -1 ) { animations.push(this); }
    animations.play();
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
  }

};
