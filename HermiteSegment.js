class HermiteSegment {
  /**
   * @param {PointWithTangent} p1
   * @param {PointWithTangent} p2
   * @param {Number} step
   * @param {CanvasRenderingContext2D} ctx
   * @param {CanvasRenderingContext2D} highlightCtx
   */
  constructor(p1, p2, step, ctx, highlightCtx) {
    this.p1 = p1;
    this.p2 = p2;
    this.#setHermitePolys();
    this.step = step;
    this.ctx = ctx;
    this.highlightCtx = highlightCtx;
  }

  draw() {
    if (this.p1.modified || this.p2.modified) {
      this.#setHermitePolys();
    }
    this.ctx.beginPath();
    this.ctx.moveTo(...this.#segmentPoint(0));
    for (let i = this.step; i < 1; i += this.step) {
      this.ctx.lineTo(...this.#segmentPoint(i));
    }
    this.ctx.lineTo(...this.#segmentPoint(1));
    this.ctx.stroke();
  }

  highlight() {
    // if (this.p1.modified || this.p2.modified) {
    //   this.#setHermitePolys();
    // }
    this.highlightCtx.beginPath();
    this.highlightCtx.moveTo(...this.#segmentPoint(0));
    for (let i = this.step; i < 1; i += this.step) {
      this.highlightCtx.lineTo(...this.#segmentPoint(i));
    }
    this.highlightCtx.lineTo(...this.#segmentPoint(1));
    this.highlightCtx.stroke();
  }

  /**
   * @param {Number} val
   * @returns {Array<Number>}
   */
  #segmentPoint(val) {
    return [this.polyX.eval(val), this.polyY.eval(val)];
  }

  #setHermitePolys() {
    this.polyX = this.#getHermitePoly(
      this.p1.point.x,
      this.p1.tangent.x,
      this.p2.point.x,
      this.p2.tangent.x,
    );
    this.polyY = this.#getHermitePoly(
      this.p1.point.y,
      this.p1.tangent.y,
      this.p2.point.y,
      this.p2.tangent.y,
    );
  }

  /**
   * @param {Number} n1
   * @param {Number} n1Tangent
   * @param {Number} n2
   * @param {Number} n2Tangent
   */
  #getHermitePoly(n1, n1Tangent, n2, n2Tangent) {
    return new Polynomial3(
      n1,
      n1Tangent,
      -3 * n1 + 3 * n2 - 2 * n1Tangent - n2Tangent,
      2 * n1 - 2 * n2 + n1Tangent + n2Tangent,
    );
  }
}
