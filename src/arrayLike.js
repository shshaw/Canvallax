/**
 * Array-like properties used for some Canvallax classes
 *
 * @mixin arrayLike
 */

var arrayLike = {
      length: 0,
      indexOf: arr.indexOf,
      push: arr.push,
      splice: arr.splice,
      sort: arr.sort,

      /**
       * Add an element, group or array of elements to collection
       *
       * @param {...object|object[]} element - Element or array of elements to be added
       * @returns {this}
       * @memberof! arrayLike
       */
      add: function(el){
        var me = this,
            elements = ( el && el.length > -1 && Array.isArray(el) ? el : arguments ),
            len = elements.length,
            i = 0;

        for ( ; i < len; i++ ) {
          // Prevent adding `false` or `undefined` elements
          if ( elements[i] ) { me.push(elements[i]); }
        }

        return me;
      },

      /**
       * Run a function for each item in collection
       * @param {function} callback - Callback function run for each item
       * @param thisArg - Overrride `this` in the callback function
       * @returns {this}
       * @memberof! arrayLike
       */
      each: function(callback,thisArg){
        var me = this,
            length = this.length,
            i = 0,
            t;

        for ( ; i < length; i++ ) {
          t = thisArg || me[i];
          if ( callback.call( t, me[ i ], i ) === false ) { break; }
        }

        return this;
      },

      /**
       * Remove an element from collection
       * @param {object} element - Element to be removed
       * @returns {this}
       * @memberof! arrayLike
       */
      remove: function(element){
        var index = this.indexOf(element);
        if ( index > -1 ) { this.splice(index, 1); }
        return this;
      }
    };
