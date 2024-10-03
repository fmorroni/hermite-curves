class Polynomial3 {
  /**
   * @param {Number} a
   * @param {Number} b
   * @param {Number} c
   * @param {Number} d
   */
  constructor(a, b, c, d) {
    this.a = a;
    this.b = b;
    this.c = c;
    this.d = d;
  }

  /**
   * @param {Number} val
   * @returns {Number}
   */
  eval(val) {
    return this.a + this.b * val + this.c * val ** 2 + this.d * val ** 3;
  }
}
