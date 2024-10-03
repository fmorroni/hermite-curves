class PointWithTangent {
  /** @typedef {{x: Number, y: Number}} Coord

  /**
   * @param {Number} x
   * @param {Number} y
   * @param {Number} handleX
   * @param {Number} handleY
   * @param {Number} radius
   * @param {String} pointColor
   * @param {String} handleColor
   * @param {CanvasRenderingContext2D} ctx
   * @param {CanvasRenderingContext2D} highlightCtx
   */
  constructor(
    x,
    y,
    handleX,
    handleY,
    radius,
    pointColor,
    handleColor,
    ctx,
    highlightCtx,
  ) {
    this.point = new Point(x, y, radius, pointColor, ctx, highlightCtx);
    this.handle = new Point(
      handleX,
      handleY,
      radius * 1.5,
      handleColor,
      ctx,
      highlightCtx,
    );
    /** @type {Coord} */
    this.tangent;
    this.#setTangent();
    this.ctx = ctx;
    this.modified = false;
  }

  draw() {
    this.point.fill();
    this.handle.stroke();

    this.ctx.beginPath();
    this.ctx.setLineDash([5, 15]);
    this.ctx.moveTo(this.handle.x, this.handle.y);
    this.ctx.lineTo(this.point.x, this.point.y);
    this.ctx.stroke();
    this.ctx.setLineDash([]);
    this.modified = false;
  }

  /**
   * @param {Number} x
   * @param {Number} y
   */
  moveHandleTo(x, y) {
    this.handle.moveTo(x, y);
    this.#setTangent();
    this.modified = true;
  }

  /**
   * @param {Number} x
   * @param {Number} y
   */
  movePointTo(x, y) {
    const diffX = x - this.point.x;
    const diffY = y - this.point.y;
    this.point.moveTo(x, y);
    this.handle.moveBy(diffX, diffY);
    this.modified = true;
  }

  /**
   * @param {Number} x
   * @param {Number} y
   */
  movePointBy(x, y) {
    this.movePointTo(this.point.x + x, this.point.y + y);
  }

  #setTangent() {
    this.tangent = {
      x: this.point.x - this.handle.x,
      y: this.point.y - this.handle.y,
    };
  }
}
