// Shared properties between the main classes: Canvallax, Group and Canvallax.Element

var Core = createClass({

    x: 0,
    // (Number)
    // Horizontal position

    y: 0,
    // (Number)
    // Vertical position

    z: 0,
    // (Number)
    // Position on the Z axis

    rotation: 0,
    // (Number)
    // Amount of rotation in degrees (0-360), affected by the `transformOrigin` property.

    tracker: false,
    // (`false`||Canvallax.TrackScroll()||Canvallax.TrackPointer())
    // Tracker instance to tie coordinates to scroll, pointer, etc.
    // Set to false if you want to control the scene's X and Y manually, perfect for animating with GSAP.

    preRender: noop,
    // (Function)
    // Arguments: (C.context,C) where C is the Canvallax instance that the element is being rendered on.
    // Callback function triggered before the element is rendered.

    _render: noop,
    // (Function)

    postRender: noop,
    // (Function)
    // Arguments: (C.context,C) where C is the Canvallax instance that the element is being rendered on.
    // Callback function triggered after the element is rendered.

    render: function(ctx,parent) {

      var el = this,
          pos, i, len;

      ctx = ctx || el.ctx;
      parent = parent || el.parent || el;

      if ( !ctx ) { return; }

      if ( el.tracker ) {
        pos = el.tracker.render(el,parent);
        // Allow tracker to set many properties.
        for ( var key in pos ) {
          if ( pos.hasOwnProperty(key) ) { el[key] = pos[key]; }
        }
      }

      ctx.setTransform(1,0,0,1,0,0);
      el.preRender(ctx,parent);
      el._render(ctx,parent);

      if ( el.children && el.children.length ) {
        len = el.children.length;
        i = 0;
        for ( ; i < len; i++ ){
          el.children[i].render(ctx,el);
        }
      }

      el.postRender(ctx,parent);

      return el;
    },

    init: noop,
    // (Function)
    // Callback function triggered when the Object is first created.
    // Receives all arguments passed to the Object's creation function.

    transformOrigin: 'center center',
    // (String)
    // Where the element's transforms will occur, two keywords separated by a space.
    // The default of `'center center'` means that `rotation` and `scale` transforms will occur from the center of the element.
    // The first keyword can be `left`, `center` or `right` cooresponding to the appropriate horizontal position.
    // The second keyword can be `top`, `center` or `bottom` cooresponding to the appropriate vertical position.

    getTransformPoint: function(){
      var el = this,
          point = el._transformPoint,
          origin;

      if ( !point || el._transformOrigin !== el.transformOrigin ) {

        origin = el.transformOrigin.split(' ');
        point = [0,0];

        if ( (!el.width && !el.height) && !el.radius ) { return point; }

        if ( origin[0] === 'center' ) {
          point[0] += ( el.width ? el.width / 2 : el.radius );
        } else if ( origin[0] === 'right' ) {
          point[0] += ( el.width ? el.width : el.radius * 2 );
        }

        if ( origin[1] === 'center' ) {
          point[1] += ( el.height ? el.height / 2 : el.radius );
        } else if ( origin[1] === 'bottom' ) {
          point[1] += ( el.height ? el.height : el.radius * 2 );
        }

        el._transformOrigin = el.transformOrigin;
        el._transformPoint = point;
      }

      return point;
    },

    getZScale: function(){ return (( this.z+1 )/1); },
    // Returns the element's scale

    preTranslate: true,

    transform: function(ctx,scale) {

      var el = this,
          x = el.x,
          y = el.y,
          transformPoint;

      scale = ( scale === undefined ? el.scale : scale ); //* el.getZScale()

      if ( scale < 0 || scale === undefined ) { return false; }

      if ( el.preTranslate ) { ctx.translate(x,y); }

      if ( scale !== 1 || el.rotation !== 0 ) {
        transformPoint = el.getTransformPoint();
        ctx.translate(transformPoint[0], transformPoint[1]);
        if ( el.rotation ) { ctx.rotate(el.rotation * rad); }
        ctx.scale(scale,scale);
        ctx.translate(-transformPoint[0], -transformPoint[1]);
      }

      if ( ! el.preTranslate ) { ctx.translate(x,y); }

      return el;
    },

    clone: clone
    // Create a copy with all the same properties

  });
