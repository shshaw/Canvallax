(function(win){

  'use strict';

  var /**
       * Canvallax object containing all classes & methods
       * @namespace {object} canvallax
       * @public
       */
      canvallax = win.canvallax = win.canvallax || {},

      doc = document,
      root = doc.documentElement,
      body = doc.body,
      arr = Array.prototype,
      // requestAnimationFrame polyfill
      requestAnimationFrame = win.requestAnimationFrame || win.webkitRequestAnimationFrame || win.mozRequestAnimationFrame || win.msRequestAnimationFrame || function(callback){ win.setTimeout(callback, 20); }; // IE Fallback

  // Exit if browser does not support canvas
  if ( !win.CanvasRenderingContext2D ) { return false; }
