# Canvallax.js
*Easy parallax effects on `<canvas>`*

Canvallax is a small *(8.8kb minified, 3.5kb gzipped)*, dependency-free Javascript library for drawing shapes and images on `<canvas>`. Support is built-in for:

[x] Easy positioning with `x` and `y` coordinates, and a `z` axis for 3D/parallax effects
[x] Rotate and scale elements with support for `transformOrigin`
[x] Scroll &amp; Pointer tracking with configurable easing and offsets
[x] Images on `<canvas>`, from URLs or nodes (`<img />`, `<canvas />`, etc) with `canvallax.Image`
[x] Common shapes (`canvallax.Circle`, `canvallax.Ellipse`, `canvallax.Polygon`, &amp; `canvallax.Rectangle`)
[x] Element stacking with `zIndex`
[x] Animation of elements with `.to`, `.from` and `.fromTo`
[x] Fixed position elements

The Canvallax library is primarily meant to help manage individual elements on canvas with easy positioning, rotation, and scale. Some canvas knowledge will be needed for more advanced implementations like custom elements and animation, though most effects can be achieved with the built-in functionality.


## Examples

View the [CodePen collection of Canvallax demos](http://codepen.io/collection/DrxbPo/)

[![Starfield](http://brokensquare.com/Code/Canvallax.js/img/starfield.gif)](http://codepen.io/shshaw/pen/EVdzLV) [![Header Image Slice](http://brokensquare.com/Code/Canvallax.js/img/header-slice.gif)](http://codepen.io/shshaw/pen/bVQROG)  [![Pointer Tracking](http://brokensquare.com/Code/Canvallax.js/img/pointer.gif)](http://codepen.io/shshaw/pen/RWEJMG) [![Parallax Sky Background](http://brokensquare.com/Code/Canvallax.js/img/sky.gif)](http://codepen.io/shshaw/pen/ZbExyV) [![Falling Hexagon Mask](http://brokensquare.com/Code/Canvallax.js/img/hexagons.gif)](http://codepen.io/shshaw/pen/dYdvww) [![transformOrigin](http://brokensquare.com/Code/Canvallax.js/img/transform-origin.gif)](http://codepen.io/shshaw/pen/LpMbvZ)



## Basic Usage

The examples below will help you get started using Canvallax. For advanced usage, read the [Canvallax Wiki](https://github.com/shshaw/canvallax.js/wiki/) for full documentation.

In order to use Canvallax, you need to create a `canvallax.Scene` and add elements to it. Create a new Canvallax scene either by calling `new canvallax.Scene()` or `canvallax.Scene()`; either will return a new instance. Elements can be created in the same way, `new canvallax.Circle()` or `canvallax.Circle`, then added to the scene like so:

```javascript

  var scene = canvallax.Scene(),
      img = canvallax.Image('image.jpg'),
      circle = canvallax.Circle();
  
  scene.add(img,circle);
  
```

Canvallax pieces (`canvallax.Scene`, `canvallax.Group`, `canvallax.Polygon`, `canvallax.Rectangle`, etc.) all accept an object containing options as the only parameter, allowing you to customize the look/functionality of each piece and control the positioning, scale and rotation.

```javascript

var scene = canvallax.Scene({
        className: 'my-scene', // Class added to the `<canvas>` element
        parentElement: document.getElementById('scene-container'), // Where the canvas should be appended
        fullscreen: false, // Don't take up the full window, only render at the width and height provided below.
        width: 640,
        height: 480
      }),
      
    triangle = canvallax.Polygon({
        fill: '#000',
        sides: 3,
        radius: 80
        rotation: 180
      }),
    
    redCircle = canvallax.Circle({
        fill: '#F00',
        radius: 40,
        x: 200,
        y: 200  
      }),
    
    square = canvallax.Rectangle({
        fill: '#000',
        width: 100,
        height: 100
      });
    
scene.add(triangle,redCircle,square);
    
```

## Animation

Animation with Canvallax is super easy! Use external animation libraries like GSAP or Velocity, or use the fully featured animation functions built in to Canvallax objects: `.to`, `.from` and `.fromTo`!

```javascript

  var scene = canvallax.Scene(),
      rect = canvallax.Rectangle();
  
  scene.add(rect);
  
  rect.to(3,{ rotation: 360 },{ 
    repeat: -1, // infinite repeat
  });
  rect.from(1,{ x: -100 });
  rect.fromTo(3,{ width: 100 },{ width: 200 },{
    repeat: -1, // inifinte repeat
    yoyo: true // alternate animation direction on repeat
  );
  
```



