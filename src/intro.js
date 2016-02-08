(function(win){

  'use strict';

  var canvallax = win.canvallax = win.canvallax || {},
      doc = document,
      root = doc.documentElement,
      body = doc.body;

  // Exit if browser does not support canvas
  if ( !win.CanvasRenderingContext2D ) { return false; }
