/**
 * Draw a Rectangle!
 *
 * @class
 * @mixes core
 * @extends canvallax.Element
 * @memberOf canvallax
 *
 * @param {object} options - Object containing properties to be applied to the new instance. Reference the properties below.
 *
 * @property {number} width=null - Width of the rectangle
 * @property {number} height=null - Height of the rectangle.
 *
 * @example
 * var redTriangle = canvallax.Polygon({
 *        fill: '#F00',
 *        points: 3,
 *        width: 100,
 *        height: 100
 *      });
 */

canvallax.Rectangle = createElement(
  /** @lends canvallax.Rectangle.prototype */
  {

    type: 'rectangle',

    draw: function(ctx,coords) {
      ctx.rect(coords[0], coords[1], this.width, this.height);
    }

  });
