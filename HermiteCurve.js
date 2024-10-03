class HermiteCurve {
  /**
   * @param {Number} step
   * @param {String} color
   * @param {Number} lineWidth
   * @param {CanvasRenderingContext2D} ctx
   * @param {CanvasRenderingContext2D} highlightCtx
   */
  constructor(step, color, lineWidth, ctx, highlightCtx) {
    /** @type {Array<PointWithTangent>} */
    this.points = [];
    this.step = step;
    const tc = new tinycolor(color);
    if (!tc.isValid()) throw new Error("Invalid color: " + color);
    this.color = tc.getOriginalInput();
    this.highlightColor = tc.brighten(20).toString();
    this.lineWidth = lineWidth;
    this.ctx = ctx;
    this.highlightCtx = highlightCtx;
    /** @type {Array<HermiteSegment>} */
    this.segments = [];
    this.closed = false;

    this.boundingBoxColor = "#050017";
  }

  draw() {
    this.ctx.strokeStyle = this.color;
    this.ctx.lineWidth = this.lineWidth;
    // Segments should be drawn before points so we don't
    // loose the points' modified state.
    this.segments.forEach((s) => s.draw());
    this.points.forEach((p) => p.draw());
  }

  /**
   * @param {PointWithTangent} p
   */
  addPoint(p) {
    this.points.push(p);
    if (this.points.length > 1) {
      const idxLast = this.points.length - 1;
      this.segments.push(
        this.#getHermiteSegment(this.points[idxLast - 1], this.points[idxLast]),
      );
    }
    this.#getBoundingBox();
  }

  /**
   * @param {Number} idx
   */
  deletePoint(idx) {
    if (idx < 0 || idx >= this.points.length) return;

    if (0 < idx && idx < this.points.length - 1) {
      this.segments.splice(
        idx - 1,
        2,
        this.#getHermiteSegment(this.points[idx - 1], this.points[idx + 1]),
      );
    } else if (idx === 0) {
      this.segments.splice(0, 1);
    } else {
      this.segments.pop();
    }
    this.points.splice(idx, 1);
    this.#getBoundingBox();
  }

  /**
   * @param {PointWithTangent} p1
   * @param {PointWithTangent} p2
   * @returns {HermiteSegment}
   */
  #getHermiteSegment(p1, p2) {
    return new HermiteSegment(p1, p2, this.step, this.ctx, this.highlightCtx);
  }

  #getBoundingBox() {
    if (this.points.length === 0) return null;
    const bounds = {
      min: { x: this.points[0].point.x, y: this.points[0].point.y },
      max: { x: this.points[0].point.x, y: this.points[0].point.y },
    };
    for (let i = 1; i < this.points.length; ++i) {
      const p = this.points[i];
      if (p.point.x < bounds.min.x) bounds.min.x = p.point.x;
      else if (p.point.x > bounds.max.x) bounds.max.x = p.point.x;
      if (p.point.y < bounds.min.y) bounds.min.y = p.point.y;
      else if (p.point.y > bounds.max.y) bounds.max.y = p.point.y;
    }
    bounds.min.x -= 40;
    bounds.max.x += 40;
    bounds.min.y -= 40;
    bounds.max.y += 40;
    return bounds;
  }

  /**
   * @param {Number} x
   * @param {Number} y
   */
  inBounds(x, y) {
    const bounds = this.#getBoundingBox();
    if (!bounds) return false;
    return (
      bounds.min.x <= x &&
      x <= bounds.max.x &&
      bounds.min.y <= y &&
      y <= bounds.max.y
    );
  }

  drawBoundingBox() {
    const bounds = this.#getBoundingBox();
    if (!bounds) return;
    this.highlightCtx.strokeStyle = this.boundingBoxColor;
    this.highlightCtx.lineWidth = 4;
    this.highlightCtx.beginPath();
    this.highlightCtx.roundRect(
      bounds.min.x,
      bounds.min.y,
      bounds.max.x - bounds.min.x,
      bounds.max.y - bounds.min.y,
      10,
    );
    this.highlightCtx.stroke();
  }

  clearBoundingBox() {
    this.highlightCtx.clearRect(
      0,
      0,
      this.highlightCtx.canvas.width,
      this.highlightCtx.canvas.height,
    );
  }

  /**
   * @param {Number} x
   * @param {Number} y
   */
  moveBy(x, y) {
    this.points.forEach((p) => {
      p.movePointBy(x, y);
    });
  }

  highlight() {
    this.highlightCtx.strokeStyle = this.highlightColor;
    this.highlightCtx.lineWidth = this.lineWidth * 2;
    this.segments.forEach((s) => s.highlight());
  }
}
