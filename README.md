# Canvallax.js
*Easy parallax effects on `<canvas>`*

Canvallax is a small *(7.6kb minified, 3kb gzipped)*, dependency-free Javascript library for drawing shapes and images on `<canvas>`. Support is built-in for:

[x] Easy positioning with `x` and `y` coordinates, and a `z` axis for 3D/parallax effects
[x] Rotate and scale elements with support for `transformOrigin`
[x] Scroll &amp; Pointer tracking with configurable easing and offsets
[x] Images on `<canvas>`, from URLs or nodes (`<img />`, `<canvas />`, etc) with `canvallax.Image`
[x] Common shapes (`canvallax.Circle`, `canvallax.Ellipse`, `canvallax.Polygon`, &amp; `canvallax.Rectangle`)
[x] Element stacking with `zIndex`
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
        width: 100,
        height: 100
      });
    
scene.add(triangle,redCircle,square);
    
```


