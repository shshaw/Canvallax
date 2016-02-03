# Canvallax.js
*Easy parallax effects on `<canvas>`*

Canvallax is a small *(7.6kb minified, 3kb gzipped)*, dependency-free Javascript library for drawing shapes and images on `<canvas>`. Support is built-in for:

[x] Easy positioning with `x` and `y` coordinates, and a `z` axis for 3D/parallax effects
[x] Rotate and scale elements with support for `transformOrigin`
[x] Scroll &amp; Pointer tracking with configurable easing and offsets
[x] Images on `<canvas>`, from URLs or nodes (`<img />`, `<canvas />`, etc) with `Canvallax.Image`
[x] Common shapes (`Canvallax.Circle`, `Canvallax.Ellipse`, `Canvallax.Polygon`, &amp; `Canvallax.Rectangle`)
[x] Element stacking with `zIndex`
[x] Fixed position elements

The Canvallax library is primarily meant to help manage individual elements on canvas with easy positioning, rotation, and scale. Some canvas knowledge will be needed for more advanced implementations like custom elements and animation, though most effects can be achieved with the built-in functionality.


## Examples

[![Starfield](http://brokensquare.com/Code/Canvallax.js/img/starfield.gif)](http://codepen.io/shshaw/pen/EVdzLV) [![Header Image Slice](http://brokensquare.com/Code/Canvallax.js/img/header-slice.gif)](http://codepen.io/shshaw/pen/bVQROG)  [![Pointer Tracking](http://brokensquare.com/Code/Canvallax.js/img/pointer.gif)](http://codepen.io/shshaw/pen/RWEJMG) [![Parallax Sky Background](http://brokensquare.com/Code/Canvallax.js/img/sky.gif)](http://codepen.io/shshaw/pen/ZbExyV) [![Falling Hexagon Mask](http://brokensquare.com/Code/Canvallax.js/img/hexagons.gif)](http://codepen.io/shshaw/pen/dYdvww) [![transformOrigin](http://brokensquare.com/Code/Canvallax.js/img/transform-origin.gif)](http://codepen.io/shshaw/pen/LpMbvZ)

View the [CodePen collection of Canvallax demos](http://codepen.io/collection/DrxbPo/)


## Basic Usage

Create a new Canvallax instance either by calling `new Canvallax()` or `Canvallax()`, either will work. First variable is an optional object containing options, the default values are shown below.

```javascript

  var scene = Canvallax.Scene(),
      img = Canvallax.Image('image.jpg'),
      circle = Canvallax.Circle(),
      triangle = Canvallax.Polygon({
        sides: 3
      }),
      square = Canvallax.Rectangle({
        width: 100,
        height: 100
      });
  
  scene.add(img,circle,triangle,square);
  
```

Read the [Canvallax Wiki](https://github.com/shshaw/Canvallax.js/wiki/) for full documentation.
