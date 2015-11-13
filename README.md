# Canvallax.js
*Easy parallax effects on `<canvas>`*

Canvallax is a small *(5.8kb minified, 2.1kb gzipped)* dependency-free Javascript library for managing elements on `<canvas>`. Support is built-in for:

- Parallax Scrolling, with optional damping to smooth motions
- Pointer Tracking
- Distance/scaling
- Images on Canvas, from URLs or nodes (`<img />`, `<canvas />`, etc) with `Canvallax.Image`
- Common shapes (`Canvallax.Circle`, `Canvallax.Polygon` and `Canvallax.Rectangle`)
- Element stacking with zIndex
- Fixed position Elements
- Element cloning

The Canvallax library is primarily meant to help with managing individual elements on canvas with unified positioning, scale and scroll effects. Some canvas knowledge will be needed for more advanced implementations like custom elements and animation, though most effects can be achieved with the built-in functionality.


## Examples

- [Basic Example](http://codepen.io/shshaw/pen/EVdzLV)
- [With Content](http://codepen.io/shshaw/pen/ojQvyB)
- [Header Image Slice](http://codepen.io/shshaw/pen/bVQROG)
- [Pointer Tracking](http://codepen.io/shshaw/pen/RWEJMG)
- [transformOrigin](http://codepen.io/shshaw/pen/LpMbvZ)
- [Parallax Sky Background](http://codepen.io/shshaw/pen/ZbExyV)
- [Falling Hexagon Mask](http://codepen.io/shshaw/pen/dYdvww)


## Basic Usage

Create a new Canvallax instance either by calling `new Canvallax()` or `Canvallax()`, either will work. First variable is an optional object containing options, the default values are shown below.

```javascript

  var myCanvallax = Canvallax(),
      img = Canvallax.Image('image.jpg'),
      circle = Canvallax.Circle(),
      triangle = Canvallax.Polygon({
        sides: 3
      }),
      square = Canvallax.Rectangle({
        width: 100,
        height: 100
      });
  
  myCanvallax.add(img,circle,triangle,square);
  
```

Read the [Canvallax Wiki](https://github.com/shshaw/Canvallax.js/wiki/) for full documentation.
