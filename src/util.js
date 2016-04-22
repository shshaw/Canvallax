  var rad = Math.PI / 180,
      twoPI = 2 * Math.PI,
      noop = function(){},
      fnType = typeof noop,
      isFunction = function(fn){ return typeof fn === fnType; };

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

  function extend() {

    var a = arguments,
        target = a[0] || {},
        length = a.length,
        i = 1,
        key;

    if ( length === 1 ) {
      target = this;
      i = 0;
    }

    for ( ; i < length; i++ ) {
      if ( a[i] ) {
        for ( key in a[i] ) {
          if ( a[i].hasOwnProperty(key) ) { target[key] = a[i][key]; }
        }
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
          args,
          i = 0;

      // Ensure object is always created as `new Class` even if `new` isn't used.
      if ( !(me instanceof C) ) {
        args = new Array(len);
        for(; i < len; i++) { args[i] = arguments[i]; }
        return construct(C,args);
      }

      if ( len === 1 ) { extend(me,options); }

      me.fn = C.fn;

      if ( me.init ) { me.init.apply(me,arguments); }
      // Autoplay animation-like objects
      if ( me.playing && me.play ) { me.play(); }

      return me;
    }

    var len = arguments.length,
        arg,
        i = 0,
        fn = {
          init: noop,
          extend: extend,
          clone: clone
        };

    for( ; i < len; i++ ) {
      arg = arguments[i];
      // Get the prototype of classes that the new class will inherit from, if available.
      if ( arg.prototype ) { arg = arg.prototype; }
      for ( var key in arg ) {
        if ( arg.hasOwnProperty(key) ) { fn[key] = arg[key]; }
      }
    }

    fn.constructor = C;
    C.fn = C.prototype = fn;

    return C;
  }

  canvallax.createClass = createClass;
