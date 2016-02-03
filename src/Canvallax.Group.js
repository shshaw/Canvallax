function zIndexSort(a,b){
  var sort = ( a.zIndex === b.zIndex ? 0 : a.zIndex < b.zIndex ? -1 : 1 );
  return sort || ( a.z === b.z ? 0 : a.z < b.z ? -1 : 1 );
}

function groupAdd(el){
  var me = this;

  var elements = ( el && !(el instanceof Canvallax.Group) && el.length > -1 ? el : arguments ),
      len = elements.length,
      i = 0;

  for ( ; i < len; i++ ) {
    if ( elements[i] ) { // Prevent adding `false` or `undefined` elements
      elements[i].parent = me;
      me._push(elements[i]);
    }
  }

  return me.sort(zIndexSort);
}

var arr = Array.prototype;

Canvallax.Group = createClass(Canvallax.Core,
  /** @lends Group.prototype */
  {
    /**
     * Object type
     * @type {string}
     * @default
     */
    type: 'group',

    length: 0,
    splice: arr.splice,
    indexOf: arr.indexOf,
    sort: arr.sort,

    _push: arr.push,

    add: groupAdd,
    push: groupAdd,

    each: function(callback,thisArg){
      var obj = this,
          length = this.length,
          i = 0,
          t;

      for ( ; i < length; i++ ) {
        t = thisArg || obj[i];
        if ( callback.call( t, obj[ i ], i ) === false ) { break; }
      }

      return this;
    },

    remove: function(element){
      var index = this.indexOf(element);
      if ( index > -1 ) { this.splice(index, 1); }
      return this;
    },

    init: function(options){
      if ( options && options.children ) { this.add(options.children); }
    }
  });
