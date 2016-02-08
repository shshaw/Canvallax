(function(win){

  'use strict';

  var canvallax = win.canvallax = win.canvallax || {},
      doc = document,
      root = doc.documentElement,
      body = doc.body,
      requestAnimationFrame = win.requestAnimationFrame || win.mozRequestAnimationFrame || win.webkitRequestAnimationFrame || win.msRequestAnimationFrame || win.oRequestAnimationFrame ||
      // IE Fallback
      function(callback){ win.setTimeout(callback, 20); };

  // Exit if browser does not support canvas
  if ( !win.CanvasRenderingContext2D ) { return false; }
