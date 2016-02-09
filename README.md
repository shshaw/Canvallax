# Canvallax
*Easy parallax effects on `<canvas>`*

Canvallax is a small *(8.8kb minified, 3.5kb gzipped)*, dependency-free Javascript library for drawing shapes and images on `<canvas>`. Support is built-in for:

- [x] Build scenes with easy positioning via `x` &amp; `y` coordinates, a `z` axis for 3D/parallax effects and stacking with `zIndex`
- [x] Draw Images on `<canvas>` from URLs or nodes (`<img />`, `<canvas />`, etc.) with `canvallax.Image`
- [x] Common shapes (`canvallax.Circle`, `canvallax.Polygon`, &amp; `canvallax.Rectangle`)
- [x] Rotate and scale elements with support for `transformOrigin`
- [x] Scroll &amp; Pointer tracking for scenes and elements with configurable easing and offsets
- [x] Animation of elements with `.to`, `.from` and `.fromTo`
- [x] Opacity, blend modes, fixed positioning, and so much more! Read the [Canvallax Wiki](https://github.com/shshaw/canvallax.js/wiki/) for full documentation.

The Canvallax library helps you manage individual elements with easy positioning, rotation, and scale. Many jaw-dropping effects can be achieved with the built-in functionality, and advanced users can create custom elements and trackers and .


## Demos

View a [CodePen collection full of Canvallax demos](http://codepen.io/collection/DrxbPo/)!

[![Starfield](http://brokensquare.com/Code/Canvallax.js/img/starfield.gif)](http://codepen.io/shshaw/pen/EVdzLV) [![Header Image Slice](http://brokensquare.com/Code/Canvallax.js/img/header-slice.gif)](http://codepen.io/shshaw/pen/bVQROG)  [![Pointer Tracking](http://brokensquare.com/Code/Canvallax.js/img/pointer.gif)](http://codepen.io/shshaw/pen/RWEJMG) [![Parallax Sky Background](http://brokensquare.com/Code/Canvallax.js/img/sky.gif)](http://codepen.io/shshaw/pen/ZbExyV) [![Falling Hexagon Mask](http://brokensquare.com/Code/Canvallax.js/img/hexagons.gif)](http://codepen.io/shshaw/pen/dYdvww) [![transformOrigin](http://brokensquare.com/Code/Canvallax.js/img/transform-origin.gif)](http://codepen.io/shshaw/pen/LpMbvZ)


## Basic Usage

The examples below will help you get started using Canvallax. For advanced usage, read the [Canvallax Wiki](https://github.com/shshaw/canvallax.js/wiki/) for full documentation.

### Scenes

In order to use Canvallax, you need to create a `canvallax.Scene` and add elements to it. Create a new scene either by calling `new canvallax.Scene()` or `canvallax.Scene()`; either will return a new instance. Elements can be created in the same way, `new canvallax.Circle()` or `canvallax.Circle`, then added to the scene like so:

```javascript

  var scene = canvallax.Scene(),
      img = canvallax.Image('image.jpg'),
      circle = canvallax.Circle({ fill: '#000' });
  
  scene.add(img,circle);
  
```

An object containing the scene options may be given on creation, allowing you to set properties and callbacks.

```javascript
var scene = canvallax.Scene({
        className: 'my-scene', // Class added to the `<canvas>` element
        parentElement: document.getElementById('scene-container'), // Where the canvas should be appended
        fullscreen: false, // Don't take up the full window, only render at the width and height provided below.
        width: 640,
        height: 480
      });
```

### Elements

Canvallax pieces (`canvallax.Scene`, `canvallax.Group`, `canvallax.Polygon`, `canvallax.Rectangle`, etc.) all accept an object containing options as the only parameter, allowing you to customize the look/functionality of each piece and control the positioning, scale and rotation.

```javascript

var scene = canvallax.Scene(),
      
    triangle = canvallax.Polygon({
        fill: '#000',
        points: 3,
        width: 80,
        height: 80,
        rotation: 180
      }),
    
    redCircle = canvallax.Circle({
        fill: '#F00',
        radius: 40,
        x: 200,
        y: 200  
      }),
    
    outlinedSquare = canvallax.Rectangle({
        stroke: '#000',
        width: 100,
        height: 100
      });
    
scene.add(triangle,redCircle,outlinedSquare);
    
```

### Animation

Animation with Canvallax is super easy! Use external animation libraries like GSAP or Velocity, or use the fully featured animation functions built in to Canvallax objects: `.to`, `.from` and `.fromTo`!

```javascript

  var scene = canvallax.Scene(),
      rect = canvallax.Rectangle();
  
  scene.add(rect);
  
  var duration = 3,
      properties = { rotation: 360 }, // This object contains properties to animate
      options = { repeat: -1 };
  
  rect.to(duration, properties, options);
  rect.from(1,{ x: -100 });
  rect.fromTo(3,{ width: 100 },{ width: 200 },{
    repeat: -1, // inifinte repeat
    yoyo: true // alternate animation direction on repeat
  );
  
```



