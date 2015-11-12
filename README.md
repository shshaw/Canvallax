# Canvallax.js
*Easy parallax effects on `<canvas>`*

Canvallax is a small *(5.4kb minified, 2kb gzipped)* Javascript library with no dependencies for managing elements on `<canvas>`, with built in support for:

- Parallax Scrolling, with optional damping to smooth motions
- Images on Canvas, from URLs or nodes (`<img />`, `<canvas />`, etc) with `Canvallax.Image`
- Element stacking with zIndex
- Fixed position Elements
- Distance/scaling
- Element cloning

Canvallax is primarily meant to help with unifying positioning, scale and scroll effects for elements drawn on canvas, and some canvas knowledge will be needed for more advanced implementations like custom elements and animation.


## Examples

- [Basic Example](http://codepen.io/shshaw/pen/EVdzLV)
- [With Content](http://codepen.io/shshaw/pen/ojQvyB)
- [Header Image Slice](http://codepen.io/shshaw/pen/bVQROG)
- [Parallax Sky Background](http://codepen.io/shshaw/pen/ZbExyV)
- [Falling Hexagon Mask](http://codepen.io/shshaw/pen/dYdvww)
- [transformOrigin](http://codepen.io/shshaw/pen/LpMbvZ)


## Basic Usage

Create a new Canvallax instance either by calling `new Canvallax` or `Canvallax`, either will work. First variable is an optional object containing options, the default values are shown below.

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
