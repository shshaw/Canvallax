  Canvallax.clone = function(props){
    var props = Canvallax.extend({}, this, props);
    return new this.constructor(props);
  };