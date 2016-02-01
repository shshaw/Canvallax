  var rad = Math.PI / 180,
      twoPI = 2 * Math.PI,
      noop = function(){};

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

  util.extend = extend;


////////////////////////////////////////


  function clone(properties){
    var props = extend({}, this, properties);
    return new this.constructor(props);
  }

  util.clone = clone;


////////////////////////////////////////


  // Gets around using `.apply` for creating new instances of a class, adapted from http://stackoverflow.com/a/1608546/1012919
  function construct(constructor, args) {
    function C(){
      return constructor.apply(this, args);
    }
    C.prototype = constructor.prototype;
    return new C();
  }

  function createClass(){

    function C(options) {
      var args = [],
          length = arguments.length,
          i = 0;
      for ( ; i < length; i++ ) { args[i] = arguments[i]; }

      if ( !(this instanceof C) ) { return construct(C,args); }

      extend(this,options);
      this.init.apply(this,args);
      return this;
    }

    var args = [],
        length = arguments.length,
        i = 0;
    for ( ; i < length; i++ ) { args[i] = arguments[i]; }

    var parent = null,
        fn = C.prototype = { init: noop };

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

  util.createClass = createClass;
