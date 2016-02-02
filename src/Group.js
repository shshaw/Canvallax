function zIndexSort(a,b){
  var sort = ( a.zIndex === b.zIndex ? 0 : a.zIndex < b.zIndex ? -1 : 1 );
  return sort || ( a.z === b.z ? 0 : a.z < b.z ? -1 : 1 );
}

var Group = util.Group = createClass(Core,{

    children: null,
    // (Array)
    // Collection of elements to render on the Canvallax instance

    sort: function(){
      this.children.sort(zIndexSort);
      return this;
    },

    add: function(el){
      var me = this;
      if ( !me.children ) { me.children = []; }
      var elements = ( el && el.length > -1 ? el : arguments ),
          len = elements.length,
          i = 0;

      for ( ; i < len; i++ ) {
        if ( elements[i] ) { // Prevent adding `false` or `undefined` elements
          elements[i].parent = me;
          me.children.push(elements[i]);
        }
      }

      return me.sort();
    },

    remove: function(element){
      var index = this.children.indexOf(element);
      if ( index > -1 ) { this.children.splice(index, 1); }
      return this;
    },

    init: function(options){
      var me = this;
      me.children = [];
      if ( options && options.children ) { me.add(options.children); }
      return me;
    }
  });
