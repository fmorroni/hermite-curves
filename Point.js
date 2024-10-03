class Point {
  /**
   * @param {Number} x
   * @param {Number} y
   * @param {Number} radius
   * @param {String} color
   * @param {CanvasRenderingContext2D} ctx
   * @param {CanvasRenderingContext2D} highlightCtx
   */
  constructor(x, y, radius, color, ctx, highlightCtx) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.highlightRadius = radius * 2.5;
    const tc = new tinycolor(color);
    if (!tc.isValid()) throw new Error("Invalid color: " + color);
    this.color = tc.getOriginalInput();
    this.highlightColor = tc.brighten(20).toString();
    this.ctx = ctx;
    this.highlightCtx = highlightCtx;
  }

  fill() {
    this.ctx.fillStyle = this.color;
    this.ctx.beginPath();
    this.ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
    this.ctx.fill();
  }

  stroke() {
    this.ctx.strokeStyle = this.color;
    this.ctx.beginPath();
    this.ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
    this.ctx.stroke();
  }

  /**
   * @param {Number} x
   * @param {Number} y
   */
  inPoint(x, y) {
    return (
      this.x - this.highlightRadius <= x &&
      x <= this.x + this.highlightRadius &&
      this.y - this.highlightRadius <= y &&
      y <= this.y + this.highlightRadius
    );
  }

  /**
   * @param {Number} x
   * @param {Number} y
   */
  moveTo(x, y) {
    this.x = x;
    this.y = y;
  }

  /**
   * @param {Number} x
   * @param {Number} y
   */
  moveBy(x, y) {
    this.x += x;
    this.y += y;
  }

  highlight() {
    this.highlightCtx.fillStyle = this.highlightColor;
    this.highlightCtx.beginPath();
    this.highlightCtx.arc(this.x, this.y, this.highlightRadius, 0, 2 * Math.PI);
    this.highlightCtx.fill();
  }

  unhighlight() {
    this.highlightCtx.clearRect(
      this.x - this.highlightRadius - 20,
      this.y - this.highlightRadius - 20,
      this.x + this.highlightRadius + 20,
      this.y + this.highlightRadius + 20,
    );

    // this.highlightCtx.clearRect(
    //   0,
    //   0,
    //   this.highlightCtx.canvas.width,
    //   this.highlightCtx.canvas.height,
    // );
  }
}
