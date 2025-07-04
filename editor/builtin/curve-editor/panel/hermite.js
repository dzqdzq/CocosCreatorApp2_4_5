const { clamp: t } = Editor.Math;
const { drawLine: i, calcHermite: e, calcFunc: n, Point: s } = require("./utils");
const r = 2;

module.exports = class {
  get keyFrames() {
    return this._keyframes.map((t) => {
      const i = this.grid.axisToOri(t.point);
      const { w: e, h: n } = this.grid.location;
      return {
        time: i.time,
        value: i.value,
        inTangent: Number(((t.inTangent * e) / n).toFixed(r)),
        outTangent: Number(((t.outTangent * e) / n).toFixed(r)),
      };
    });
  }
  get ctrlKey() {
    return this._keyframes.map((t, i) => {
      t.index = i;
      const e = this.calcCtrl(i);

      if (0 !== i) {
        t.inPoint = e.inPoint;
      }

      if (i !== this._keyframes.length - 1) {
        t.outPoint = e.outPoint;
      }

      const n = this.grid.axisToCanvas(t.point);
      t.point.canvas = n;
      return t;
    });
  }
  constructor(t) {
    this._keyframes = {};
    this.hermiteArgs = null;
    this.mult = 1;
    this.grid = t.grid;
    this.ctrlConfig = t.ctrlConfig;
    this.curveConfig = t.curveConfig;
    this.cxt2D = t.context;
    this.cxt2D.strokeStyle = t.curveConfig.strokeStyle;
    this.canvas = t.context.canvas;
    this.negative = !!t.range;
  }
  rePaint() {
    this.clear();
    this.cxt2D.strokeStyle = this.curveConfig.strokeStyle;
    for (const t of this._keyframes) {
      t.outTangent = t.outTangent / this.mult;
      t.inTangent = t.inTangent / this.mult;
    }
    this.draw(this._keyframes);
  }
  draw(t) {
    const i = this.cxt2D;
    const { w: s, h: r } = this.grid.location;
    try {
      this._keyframes = JSON.parse(JSON.stringify(t));
    } catch (t) {
      console.error(t);
      return;
    }

    if (this.negative) {
      this.mult = r / s / 2;
    } else {
      this.mult = r / s;
    }

    for (const t of this._keyframes) {
      const i = this.grid.tranToAxis(t);
      t.outTangent *= this.mult;
      t.inTangent *= this.mult;
      t.point = i;
    }
    this.hermiteArgs = [];
    for (let t = 0; t < this._keyframes.length - 1; t++) {
      const s = this._keyframes[t + 1];
      const r = this._keyframes[t];
      this.hermiteArgs[t] = e(r.point, r.outTangent, s.point, s.inTangent);
      const a = n(this.hermiteArgs[t]);
      i.beginPath();
      for (let t = r.point.x; t <= s.point.x; t++) {
        const e = this.grid.axisToCanvas({ x: t, y: a(t) });
        i.lineTo(e.x, e.y);
      }
      i.stroke();
    }
    this.drawEdge();
  }
  updateTan(t, i, n) {
    if ((0 === t && "inTangent" === n) ||
    (t === this._keyframes.length - 1 && "outTangent" === n)) {
      return;
    }
    this._keyframes[t][n] = i;
    const s = this._keyframes[t];
    if ("outTangent" === n) {
      const i = this._keyframes[t + 1];
      this.hermiteArgs[t] = e(s.point, s.outTangent, i.point, i.inTangent);
    } else {
      if ("inTangent" === n) {
        const i = this._keyframes[t - 1];
        this.hermiteArgs[t - 1] = e(i.point, i.outTangent, s.point, s.inTangent);
      }
    }
  }
  addKeyFrame(t) {
    t -= this.grid.location.x;
    let i = null;
    for (let e = 0; e < this._keyframes.length - 1; e++) {
      const n = this._keyframes[e].point;
      const s = this._keyframes[e + 1].point;
      if (t > n.x && s.x > t) {
        i = e;
        break;
      }
    }
    if (null === i) {
      return null;
    }
    const e = this.calcTange(t, i);
    const r = n(this.hermiteArgs[i])(t);
    this.hermiteArgs.splice(i + 1, 0, this.hermiteArgs[i]);

    this._keyframes.splice(i + 1, 0, {
      point: new s({ x: t, y: r }),
      outTangent: e,
      inTangent: e,
    });

    return i + 1;
  }
  delKeyFrame(t) {
    const i = this._keyframes[t + 1];
    const n = this._keyframes[t - 1];

    if (i) {
      this.hermiteArgs.splice(t, 1);
    }

    if (n) {
      this.hermiteArgs.splice(t - 1, 1);
    }

    if (
      (i && n)
    ) {
      const s = e(n.point, n.outTangent, i.point, i.inTangent);
      this.hermiteArgs.splice(t - 1, 0, s);
    }
    this._keyframes.splice(t, 1);
  }
  update(t = this.cxt2D) {
    const i = this._keyframes;
    for (let e = 1; e < i.length; e++) {
      const s = i[e];
      const r = i[e - 1];
      const a = n(this.hermiteArgs[e - 1]);
      t.beginPath();
      for (let i = r.point.x; i <= s.point.x; i++) {
        const e = this.grid.axisToCanvas({ x: i, y: a(i) });
        t.lineTo(e.x, e.y);
      }
      t.stroke();
    }

    if (t === this.cxt2D) {
      this.drawEdge();
    }
  }
  moveY(i) {
    const { h: n } = this.grid.location;
    const s = JSON.parse(JSON.stringify(this._keyframes));
    for (let r = 0; r < this._keyframes.length; r++) {
      const a = this._keyframes[r];
      const { point: o } = a;
      if (o.y > n || o.y < 0) {
        this._keyframes = s;
        return false;
      }
      o.y += i;
      o.y = t(o.y, 0, n);
      o.canvas = this.grid.axisToCanvas(o);
      if (
        (r < this._keyframes.length - 1)
      ) {
        const t = this._keyframes[r + 1];
        this.hermiteArgs[r] = e(a.point, a.outTangent, t.point, t.inTangent);
      }
    }
    return true;
  }
  moveKey(i, n, s) {
    const r = this._keyframes[s];
    const a = this._keyframes[s + 1];
    const o = this._keyframes[s - 1];
    const { point: h } = r;
    const { w: c, h: g } = this.grid.location;
    let l = [0, g];

    if (this.negative) {
      l = [-g / 2, g / 2];
    }

    if ((h.x > c || h.x < 0) && (h.y > g || h.y < 0)) {
      return;
    }
    const m = this.grid.canvasToAxis({ x: i, y: n });
    h.x = t(m.x, 0, c);
    h.y = t(m.y, l[0], l[1]);

    if (a) {
      this.hermiteArgs[s] = e(r.point, r.outTangent, a.point, a.inTangent);
    }

    if (o) {
      this.hermiteArgs[s - 1] = e(
          o.point,
          o.outTangent,
          r.point,
          r.inTangent
        );
    }
  }
  clear() {
    this.cxt2D.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }
  calcCtrl(t, i) {
    const e = this._keyframes[t].point;
    let n = null;
    let s = null;
    if ("outTangent" !== i) {
      const i = this._keyframes[t].inTangent;
      (s = this.calcCtrlPoint(e, i, "inTangent")).canvas = this.grid.axisToCanvas(s);
    }
    if ("inTangent" !== i) {
      const i = this._keyframes[t].outTangent;
      (n = this.calcCtrlPoint(e, i, "outTangent")).canvas = this.grid.axisToCanvas(n);
    }
    return { outPoint: n, inPoint: s };
  }
  calcTange(t, i) {
    const { a: e, b: n, c: s } = this.hermiteArgs[i];
    return 3 * e * t * t + 2 * n * t + s;
  }
  drawEdge() {
    const { w: t, x: e } = this.grid.location;
    const n = this.ctrlKey[0].point.canvas;
    const s = this.ctrlKey[this._keyframes.length - 1].point.canvas;
    this.cxt2D.save();
    this.cxt2D.strokeStyle = "rgba(255, 0, 0, 0.11)";
    i({ x: 0, y: n.y }, n, this.cxt2D);
    i({ x: 2 * e + t, y: s.y }, s, this.cxt2D);
    this.cxt2D.restore();
  }
  calcCtrlPoint(t, i, e) {
    const { handlerSize: n } = this.ctrlConfig;
    let s = Math.sqrt((n * n) / (1 + i * i));
    return {
      x: (s = "inTangent" === e ? t.x - s : t.x + s),
      y: t.y - i * (t.x - s),
      type: e,
    };
  }
};
