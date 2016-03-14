  var rad = Math.PI / 180,
      twoPI = 2 * Math.PI,
      noop = function(){},
      arrayLike = {
        length: 0,
        indexOf: arr.indexOf,
        push: arr.push,
        splice: arr.splice,
        sort: arr.sort
      };

////////////////////////////////////////

  /**
   * Extend an object with properties from other objects.
   *
   * If only one argument is provided, the `target` is assumed to be `this` in the current context.
   *
   * @type method
   * @memberof canvallax
   *
   * @param {object} target - Target object to receive properties from the other objects.
   * @param {...object} - Objects to merge
   *
   * @returns {object} - Object with merged properties
   */

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
   *
   * @type method
   * @memberof canvallax
   *
   * @param {!object} target - Original to clone. If not included, will default to `this`
   * @param {!object} properties - Properties to include on the clone
   *
   * @returns {object} - Cloned object containing extra properties from the provided object.
   */

  function clone(target,properties){
    if ( arguments.length <= 1 ) {
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
    function C(){ return constructor.apply(this, args); }
    C.prototype = constructor.prototype;
    return new C();
  }

  /**
   * Create a new Class with the properties provided
   *
   * @type method
   * @memberof canvallax
   *
   * @param {!object} target - Original to clone. If not included, will default to `this`
   * @param {!object} properties - Properties to include on the clone
   *
   * @returns {object} - Cloned object containing extra properties from the provided object.
   */

  function createClass(){

    function C(options) {
      var me = this,
          len = arguments.length,
          args = new Array(len),
          i = 0;
      for(; i < len; i++) { args[i] = arguments[i]; }

      if ( !(me instanceof C) ) { return construct(C,args); } // Ensure class is always created as `new Class` even if `new` isn't used.
      if ( len === 1 ) { extend(me,options); }
      if ( me.init ) { me.init.apply(me,args); }

      return me;
    }

    var len = arguments.length,
        args = new Array(len),
        i = 0,
        parent,
        fn = C.prototype = {
          init: noop,
          extend: extend,
          clone: clone
        };

    for(; i < len; i++) { args[i] = arguments[i]; }

    if ( len > 1 && args[0].prototype ) {
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
