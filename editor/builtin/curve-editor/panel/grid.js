const t = 5;
const i = 2;
const { Point: e } = require("./utils");

module.exports = class {
  set cxt2D(t) {
    this.canvas = t.canvas;
    this._cxt2D = t;
  }
  get cxt2D() {
    return this._cxt2D;
  }
  set multiplier(t) {
    if (0 !== t) {
      this._multiplier = t;
      this.rePaint();
    }
  }
  get multiplier() {
    return this._multiplier;
  }
  set negative(t) {
    if (t !== this._negative) {
      this._negative = t;
      this.rePaint();
    }
  }
  get negative() {
    return this._negative;
  }
  get step() {
    const t = this.location.w / this.axis.piece;
    const e = this.location.h / this.axis.piece;
    const { rangeX: s, rangeY: a } = this.axis;
    const h = Number((s / this.axis.piece).toFixed(i));
    let n = Number((a / this.axis.piece).toFixed(i));
    const r = Number((1 / this.axis.piece).toFixed(i));
    let c = Number((1 / this.axis.piece).toFixed(i));

    if (this.negative) {
      n *= 2;
      c *= 2;
    }

    return { spaceX: t, spaceY: e, stepX: h, stepY: n, orgStepX: r, orgStepY: c };
  }
  get location() {
    return {
      x: this.axesMargin,
      y: this.axesMargin,
      w: this.canvas.width - 2 * this.axesMargin,
      h: this.canvas.height - 2 * this.axesMargin,
    };
  }
  constructor(t) {
    this._negative = false;
    this.cxt2D = t.context;
    this.axesMargin = t.axisMargin;
    this.axis = t.axis;
    this._multiplier = t.multiplier || 1;
    this.cxt2D.lineWidth = t.lineWidth;
    this.cxt2D.strokeStyle = t.color || "#333";
  }
  draw() {
    const { spaceX: t, spaceY: i } = this.step;
    this.drawGrid(t / 4, i / 2, "rgba(51, 51, 51, 0.44)", 0.5);

    if (this.negative) {
      this.drawGrid(t, 1 * i, "#3a3939", 1);
    } else {
      this.drawGrid(t, 2 * i, "#3a3939", 1);
    }

    const { x: e, w: s, h: a } = this.location;
    this.cxt2D.strokeStyle = "#333";
    this.cxt2D.lineWidth = 1.5;

    if (this.negative) {
      this.cxt2D.beginPath();
      this.cxt2D.moveTo(e, a / 2 + e + 0.5);
      this.cxt2D.lineTo(s + e, a / 2 + e + 0.5);
      this.cxt2D.stroke();
    }

    this.drawAxis();
  }
  rePaint() {
    this.clear();
    this.draw();
  }
  axisToOri(t) {
    const { w: e, h: s } = this.location;
    let a;
    return {
      time: Number((t.x / e).toFixed(i)),
      value: (a = this.negative
        ? Number(((t.y / s) * 2).toFixed(i))
        : Number((t.y / s).toFixed(i))),
    };
  }
  tranToAxis(t) {
    const { w: i, h: s } = this.location;
    let a;
    a = this.negative ? (t.value * s) / 2 : t.value * s;
    const h = t.time * i;
    return new e({ x: h, y: a });
  }
  tranToCanvas(t) {
    const i = this.tranToAxis(t);
    return this.axisToCanvas(i);
  }
  canvasToAxis(t) {
    const { x: i, y: s, h: a } = this.location;
    const h = t.x - i;
    let n = a - t.y + s;

    if (this.negative) {
      n = a / 2 - t.y + s;
    }

    return new e({ x: h, y: n });
  }
  axisToCanvas(t) {
    const { x: i, y: s, h: a } = this.location;
    return this.negative
      ? new e({ x: t.x + i, y: a / 2 - t.y + s })
      : new e({ x: t.x + i, y: a - t.y + s });
  }
  clear() {
    const { x: t, y: i, w: e, h: s } = this.location;
    this.cxt2D.clearRect(t, i, e, s);
  }
  drawAxis() {
    this.cxt2D.lineWidth = 2;
    const { x: i, y: e, w: s, h: a } = this.location;
    const { stepX: h, stepY: n, spaceX: r, spaceY: c } = this.step;
    this.cxt2D.clearRect(0, 0, this.axesMargin, a + this.axesMargin);

    this.cxt2D.clearRect(
      0,
      a + this.axesMargin,
      s + this.axesMargin,
      this.axesMargin
    );

    this.cxt2D.strokeRect(i, e, s, a);
    this.cxt2D.fillStyle = "#ccc";
    let x = i - t;
    let o = 0;
    for (; x < i + s; ) {
      this.cxt2D.fillText(o, x, e + a + i / 2);
      o = Number((o + h).toFixed(2));
      x += r;
    }
    this.cxt2D.font = "12px Arial";
    let l = e + a;
    let g = this.negative ? -1 * this.multiplier : 0;
    for (; l > i; ) {
      this.cxt2D.fillText(g, i / 2 - t, l);
      g = Number((g + n * this.multiplier).toFixed(2));
      l -= c;
    }
  }
  drawGrid(t, i, e, s) {
    if (s) {
      this.cxt2D.lineWidth = s;
    }

    if (e) {
      this.cxt2D.strokeStyle = e;
    }

    const { x: a, y: h, w: n, h: r } = this.location;
    for (let i = a; i < n + a; i += t) {
      this.cxt2D.beginPath();
      this.cxt2D.moveTo(i + 0.5, h);
      this.cxt2D.lineTo(i + 0.5, r + h);
      this.cxt2D.stroke();
    }
    for (let t = r + a; t > a; t -= i) {
      this.cxt2D.beginPath();
      this.cxt2D.moveTo(a, t + 0.5);
      this.cxt2D.lineTo(n + a, t + 0.5);
      this.cxt2D.stroke();
    }
  }
};
