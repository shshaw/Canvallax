(function(win){

  'use strict';

  var util = {},
      doc = document,
      root = doc.documentElement,
      body = doc.body;

  // Exit if browser does not support canvas
  if ( !win.CanvasRenderingContext2D ) { win.Canvallax = function(){ return false; }; return false; }
