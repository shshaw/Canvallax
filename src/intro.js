(function(win){

  'use strict';

  var Canvallax = win.Canvallax = win.Canvallax || {},
      doc = document,
      root = doc.documentElement,
      body = doc.body;

  // Exit if browser does not support canvas
  if ( !win.CanvasRenderingContext2D ) { return false; }
