function zIndexSort(a,b){
  var sort = ( a.zIndex === b.zIndex ? 0 : a.zIndex < b.zIndex ? -1 : 1 );
  return sort || ( a.z === b.z ? 0 : a.z < b.z ? -1 : 1 );
}

var Group = util.Group = createClass(Core,{

    children: undefined,
    // (Array)
    // Collection of elements to render on the Canvallax instance

    sort: function(){
      this.children.sort(zIndexSort);
      return this;
    },

    add: function(el){
      if ( !this.children ) { this.children = []; }
      var elements = el && el.length ? el : arguments,
          len = elements.length,
          i = 0;

      for ( ; i < len; i++ ) {
        if ( elements[i] ) { // Prevent adding `false` or `undefined` elements
          elements[i].parent = this;
          this.children.push(elements[i]);
        }
      }

      return this.sort();
    },

    remove: function(element){
      var index = this.children.indexOf(element);

      if ( index > -1 ) {
        this.children.splice(index, 1);
      }

      return this;
    },

    init: function(options){
      this.children = [];
      return this;
    }
  });
