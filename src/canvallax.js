// @echo header
;(function (root, factory) {
  if (typeof define === "function" && define.amd) {
    define(factory);
  } else if (typeof exports !== "undefined") {
    module.exports = factory();
  } else {
    root.canvallax = factory();
  }
})(this, function() {

  'use strict';

  var win = window,
      doc = document,
      root = doc.documentElement,
      body = doc.body,
      arr = Array.prototype,
      /**
       * Canvallax object containing all classes & methods
       * @namespace {object} canvallax
       * @public
       */
      canvallax = win.canvallax = win.canvallax || {},
      // requestAnimationFrame polyfill
      requestAnimationFrame = win.requestAnimationFrame || win.webkitRequestAnimationFrame || win.mozRequestAnimationFrame || win.msRequestAnimationFrame || function(callback){ win.setTimeout(callback, 20); }; // IE Fallback

  // Exit if browser does not support canvas
  if ( !win.CanvasRenderingContext2D ) { return false; }

  // Shorthand name
  win.clx = canvallax;

// @include ./util.js
// @include ./arrayLike.js
// @include ./core.js
// @include ./animateCore.js
// @if !exclude.animate
// @include ./canvallax.Animate.js
// @endif
// @include ./canvallax.Group.js
// @include ./canvallax.Scene.js
// @include ./canvallax.Element.js
// @if !exclude.elements
// @include ./Elements/canvallax.Ellipse.js
// @include ./Elements/canvallax.Rectangle.js
// @include ./Elements/canvallax.Image.js
// @include ./Elements/canvallax.Polygon.js
// @endif
// @if !exclude.trackers
// @include ./canvallax.Tracker.js
// @include ./Trackers/canvallax.TrackScroll.js
// @include ./Trackers/canvallax.TrackPointer.js
// @include ./Trackers/canvallax.TrackElement.js
// @endif
// @include ./plugins.js

  return canvallax;

});
