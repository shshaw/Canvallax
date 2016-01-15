  var win = window,
      doc = document,
      root = doc.documentElement,
      body = doc.body,
      noop = function(){},
      requestAnimationFrame = win.requestAnimationFrame || win.mozRequestAnimationFrame || win.webkitRequestAnimationFrame || win.msRequestAnimationFrame || win.oRequestAnimationFrame || function(callback){ win.setTimeout(callback, 20); },
      rad = Math.PI / 180,
      twoPI = 2 * Math.PI;

  // Exit if browser does not support canvas
  if ( !win.CanvasRenderingContext2D ) { win.Canvallax = function(){ return false; }; return false; }

////////////////////////////////////////

  function extend(target) {
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
  }

  function createClass(){

    function C(options) {
      if ( !(this instanceof C) ) { return new C(options); }

      extend(this,options);
      this.init.apply(this,arguments);

      return this;
    }

    var args = [],
        parent = null,
        fn = C.prototype = { init: noop },
        length = arguments.length,
        i = 0;

    for ( ; i < length; i++ ) { args[i] = arguments[i]; }

    if ( length > 1 && args[0].prototype ) {
      parent = args[0];
      args[0] = args[0].prototype;
      fn._parent = parent;
    }

    args.unshift(fn);
    extend.apply(fn, args);

    fn.constructor = C;

    return C;
  }

////////////////////////////////////////

  function zIndexSort(a,b){
    var sort = ( a.zIndex === b.zIndex ? 0 : a.zIndex < b.zIndex ? -1 : 1 );
    return sort || ( a.z === b.z ? 0 : a.z < b.z ? -1 : 1 );
  }

  function clone(properties){
    var props = extend({}, this, properties);
    return new this.constructor(props);
  }
