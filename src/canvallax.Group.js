function zIndexSort(a,b){
  var sort = ( a.zIndex === b.zIndex ? 0 : a.zIndex < b.zIndex ? -1 : 1 );
  return sort || ( a.z === b.z ? 0 : a.z < b.z ? -1 : 1 );
}

/**
 * Control a group of element's positioning and transforms together
 *
 * @class An array-like collection of canvallax elements.
 * @mixes core
 * @memberof canvallax
 *
 */
canvallax.Group = createClass(core,arrayLike,
  /** @lends canvallax.Group# */
  {
    type: 'group',

    /**
     * Add an element, group or array of elements to collection
     *
     * @param {...object|object[]} element - Element or array of elements to be added
     * @returns {this}
     */
    add: function(el){
      var me = this,
          elements = ( el && el.length > -1 && Array.isArray(el) ? el : arguments ),
          len = elements.length,
          i = 0;

      for ( ; i < len; i++ ) {
        if ( elements[i] ) { // Prevent adding `false` or `undefined` elements
          elements[i].parent = me;
          me.push(elements[i]);
        }
      }

      return me.sort(zIndexSort);
    },

    init: function(options){
      if ( options && options.children ) { this.add(options.children); }
    }

  });
