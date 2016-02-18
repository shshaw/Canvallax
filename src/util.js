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

  canvallax.extend = extend;


////////////////////////////////////////
  /**
   * Create a clone of an object or Class
   * @type {function}
   * @param {!object} target - Original to clone. If not included, will default to `this`
   * @param {!object} properties - Properties to include on the clone
   * @returns {object} - Cloned object containing properties from
   */
  function clone(target,properties){
    if ( arguments.length === 1 ) {
      properties = target;
      target = this;
    }
    var props = extend({}, target, properties);
    return new target.constructor(props);
  }

  canvallax.clone = clone;


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
      var me = this,
          args = [],
          length = arguments.length,
          i = 0;
      for ( ; i < length; i++ ) { args[i] = arguments[i]; }

      if ( !(me instanceof C) ) { return construct(C,args); }

      extend(me,options);
      if ( me.init ) { me.init.apply(me,args); }
      return me;
    }

    var args = [],
        length = arguments.length,
        i = 0,
        parent,
        fn = C.prototype = {
          init: noop,
          extend: extend
        };

    for ( ; i < length; i++ ) { args[i] = arguments[i]; }

    if ( length > 1 && args[0].prototype ) {
      parent = args[0];
      args[0] = args[0].prototype;
      fn._parent = parent;
    }

    args.unshift(fn);
    extend.apply(fn, args);

    fn.constructor = C;
    C.fn = fn;

    return C;
  }

  canvallax.createClass = createClass;
