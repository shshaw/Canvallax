canvallax.Rectangle = createElement(
  /** @lends canvallax.Rectangle.prototype */
  {
    /**
     * Object type
     * @type {string}
     * @default
     */
    type: 'rectangle',

    draw: function(ctx,coords) {
      ctx.rect(coords[0], coords[1], this.width, this.height);
    }

  });
