# Canvallax.js
*Easy parallax effects on `<canvas>`*

Canvallax is a small (5.4kb minified, 2kb gzipped) Javascript library with no dependencies for managing elements on `<canvas>`, with built in support for:

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


## Basic Usage

Create a new Canvallax instance either by calling `new Canvallax` or `Canvallax`, either will work. First variable is an optional object containing options, the default values are shown below.

```javascript
  var myCanvallax = Canvallax(),
      img = Canvallax.Image('image.jpg');
  
  myCanvallax.add(img);
  
```


## Options

Options for Canvallax, shown with the default values.

```javascript
  Canvallax({
    
    scroll: true,
    // (Boolean||'invert'||'invertx'||'inverty')
    // If true, the X and Y of the scene are tied to document's scroll for a typical parallax experience.
    // If 'invert'||'invertx'||'inverty', the appropriate axes will be reversed on scroll.
    // Set to false if you want to control the scene's X and Y manually, perfect for animating with GSAP.

    x: 0,
    // (Number)
    // Starting x position. If tied to scroll, this will be overridden on render.

    y: 0, // (Number)
    // Starting y position. If tied to scroll, this will be overridden on render.

    damping: 1,
    // (Number)
    // The 'easing' of the x & y position when updated. 1 = none, higher is longer. If you're syncing parallax items to regular items in the scroll, then you'll probably want a low damping.

    canvas: undefined,
    // (Node)
    // Use Canvallax on an existing canvas node, otherwise one is created.

    parent: document.body,
    // (Node)
    // Canvas is prepended to document.body by default. Override with your own node if you want it within a certain container.

    elements: undefined,
    // (Array)
    // Collection of elements to render on the Canvallax instance

    animating: true,
    // (Boolean)
    // Update canvas every requestAnimationFrame call.

    fullscreen: true,
    // (Boolean)
    // Set the canvas width and height to the size of the window, and update on window resize. Otherwise, the provided with and height will be used.

    preRender: noop,
    // (Function)
    // Callback before elements are rendered.

    postRender: noop
    // (Function)
    // Callback after elements are rendered. 
    
  });
```

## Methods

- `add(elements)`: Add an element or array of elements to the Canvallax instance
- `remove(element)`: Remove an element from the Canvallax instance
- `render()`: Clears canvas and renders all elements
- `resize(width,height)`: Set canvas width and height
- `resizeFullscreen()`: Set canvas to full window width & height
- `play()`: Render Canvallax elements every `requestAnimationFrame`
- `pause()` or `stop()`: Stop Canvallax rendering

## Utilities

- `Canvallax.extend(object,object,...)`: Merge properties of objects onto the first object. If only one object provided, the properties will be applied to `Canvallax`, much like `jQuery.extend`.
- `Canvallax.createElement(properties)`: Create an element type that can be added to Canvallax. The object provided will be added to that element's prototype and inherited by each element of that type. Each element type created should have a `render` property with a function that will actually draw that element on the canvas.

## Element Types

Create custom element types using `Canvallax.createElement` or use one of the built in elements.
