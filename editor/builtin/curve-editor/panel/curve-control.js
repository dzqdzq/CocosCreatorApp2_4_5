const t = require("events");
const i = require("./hermite");
const e = 20;

const s = Array(4 * e * e)
  .fill(0)
  .toString();

const r = "rgba(255, 0, 0, 0.1)";
const h = 5;

module.exports = class extends t {
  get ctrlKey() {
    return this.hermite.ctrlKey;
  }
  constructor(t) {
    super();
    this.ctrlPoints = null;
    this.changeType = "";
    this.isShowCtrl = false;
    this.isShowPoint = false;
    this.isShowAuxi = false;
    this.isBindHandle = false;
    this.negative = false;
    this.flags = { flag: false, tanDrag: false, curveDrag: false, keyDrag: false };
    this.grid = t.grid;
    this.ctrlConfig = t.ctrlConfig;
    this.cxt2D = t.context;
    this.canvas = t.context.canvas;

    this.hermite = new i({
        context: t.mainCtx,
        ctrlConfig: t.ctrlConfig,
        grid: t.grid,
        curveConfig: t.curveConfig,
        range: t.range,
      });

    const { top: e, left: s } = this.canvas.getBoundingClientRect();
    this.position = { top: e, left: s };
  }
  rePaint() {
    this.clear();
    this.grid.rePaint();
    this.hermite.rePaint();
  }
  update(t, i) {
    this.negative = i;
    this.hermite.negative = i;
    this.grid.negative = i;
    this.clear();
    this.hermite.clear();
    this.draw(t);
  }
  draw(t) {
    this.cxt2D.strokeStyle = r;
    this.hermite.draw(t);
    this.hermite.update(this.cxt2D);
    this.initContrl();
  }
  initContrl() {
    const { radius: t, fillColor: i, strokeStyle: e } = this.ctrlConfig;
    this.cxt2D.fillStyle = i;
    this.cxt2D.strokeStyle = e;
    for (const i of this.ctrlKey) {
      const e = this.grid.axisToCanvas(i.point);
      this.cxt2D.beginPath();
      this.cxt2D.arc(e.x, e.y, t, 0, 2 * Math.PI);
      this.cxt2D.closePath();
      this.cxt2D.stroke();
      this.cxt2D.fill();
    }

    if (!this.isBindHandle) {
      this.bindHandler();
    }
  }
  resetCtrl(t) {
    if ((this.isShowCtrl || this.isShowAuxi)) {
      this.isShowAuxi = false;
      this.isShowCtrl = false;
      this.cxt2D.clearRect(0, 0, this.canvas.width, this.canvas.height);
      this.cxt2D.strokeStyle = r;
      this.hermite.update(this.cxt2D);
      this.initContrl();

      if (t) {
        this.ctrlPoints = null;
      }
    }
  }
  bindHandler() {
    this.isBindHandle = true;
    this.canvas.addEventListener("mousedown", (t) => this.onMouseDown(t));
    this.canvas.addEventListener("mousemove", (t) => this.onMouseMove(t));
    document.addEventListener("mouseup", (t) => this.onMouseUp(t));
  }
  onMouseDown(t) {
    this.flags.flag = false;
    const { radius: i } = this.ctrlConfig;
    const { offsetX: r, offsetY: n } = t;
    const a = this.cxt2D.getImageData(r - e / 2, n - e / 2, e, e);
    for (const e of this.ctrlKey) {
      const { x: s, y: a } = e.point.canvas;
      if (Math.abs(r - s) < 2 * h + i && Math.abs(n - a) < 2 * h + i) {
        return 2 === t.button
          ? (Editor.Ipc.sendToMain(
              "curve-editor:popup-curve-menu",
              [
                {
                  label: "Delete Key",
                  panel: "curve-editor",
                  message: "delete-key",
                  params: [e.index],
                },
              ],
              t.pageX,
              t.pageY
            ),
            void 0)
          : ((this.flags.flag = true),
            (this.flags.keyDrag = true),
            (this.canvas.style.cursor = "move"),
            this.showCtrl(e),
            this.showPoint(this.hermite.keyFrames[e.index], e.point.canvas),
            void 0);
      }
    }
    if (this.isShowCtrl && this.ctrlPoints) {
      for (const t of Object.keys(this.ctrlPoints)) {
        const e = this.ctrlPoints[t];
        if (!e.canvas || "point" === t) {
          continue;
        }
        const { x: s, y: a } = e.canvas;
        if (Math.abs(r - s) < h + i && Math.abs(n - a) < h + i) {
          this.flags.tanDrag = true;
          this.flags.flag = true;
          this.ctrlPoints.type = t;
          return;
        }
      }
    }

    if (a.data.toString() !== s) {
      this.flags.flag = true;

      if (2 === t.button) {
        Editor.Ipc.sendToMain(
              "curve-editor:popup-curve-menu",
              [
                {
                  label: "Add Key",
                  panel: "curve-editor",
                  message: "add-key",
                  params: [r],
                },
              ],
              t.pageX,
              t.pageY
            );
      } else {
        this.lightCurve();
        this.canvas.style.cursor = "ns-resize";

        if (!this.flags.tanDrag &&
          !this.flags.keyDrag) {
          this.flags.curveDrag = true;
        }
      }
    }

    if (!this.flags.flag) {
      this.resetCtrl("hideCtrl");
    }
  }
  onMouseMove(t) {
    const { curveDrag: i, tanDrag: e, keyDrag: s } = this.flags;

    if ((e || i || s)) {
      process.nextTick(() => {
        const { offsetX: r, offsetY: h, movementY: n } = t;
        if (e) {
          this.changeType = "tangent";
          this.updateTan(r, h);
          this.emitChange();
          return;
        }
        if (s) {
          this.moveKey(r, h);
          this.emitChange();
          return;
        }
        if (i && 0 !== n) {
          if (!this.hermite.moveY(-n)) {
            return;
          }
          this.changeType = "curve";
          this.emitChange();
          this.hermite.clear();
          this.hermite.update();
          this.resetCtrl();
          this.lightCurve();
        }
      });
    }
  }
  onMouseUp(t) {
    this.flags.tanDrag = false;
    this.flags.curveDrag = false;
    this.flags.keyDrag = false;
    this.isShowPoint = false;
    this.canvas.style.cursor = "default";

    if (this.changeType) {
      this.emitChange();
      this.emitConfirm();
      this.changeType = "";
    }
  }
  moveKey(t, i) {
    t -= this.position.left;
    i -= this.position.top;
    this.changeType = "keyframe";
    const { index: e } = this.ctrlPoints;
    this.hermite.moveKey(t, i, e);
    this.refreshRender();
  }
  delKeyFrame(t) {
    this.hermite.delKeyFrame(t);
    this.ctrlPoints = null;
    this.refreshRender();
    this.clear();
    this.initContrl();
  }
  addKeyFrame(t) {
    const i = this.hermite.addKeyFrame(t);
    if (null === i) {
      console.warn("添加点无效", t);
      return;
    }
    this.emitChange();
    this.emitConfirm();
    const e = this.ctrlKey[i];
    this.initContrl();
    this.drawCtrl(e);
  }
  updateTan(t, i) {
    const { index: e, type: s } = this.ctrlPoints;
    const { point: r, isBroken: h } = this.ctrlKey[e];
    const n = -(i - r.canvas.y) / (t - r.canvas.x);

    if (h) {
      this.hermite.updateTan(e, n, s);
    } else {
      this.hermite.updateTan(e, n, "inTangent");
      this.hermite.updateTan(e, n, "outTangent");
    }

    this.refreshRender();
    this.drawCtrl(this.ctrlKey[e]);
  }
  refreshRender() {
    this.hermite.clear();
    this.hermite.update();
    this.resetCtrl();
    this.lightCurve();
    if (
      (this.ctrlPoints)
    ) {
      const { index: t } = this.ctrlPoints;
      this.ctrlPoints = this.ctrlKey[t];
      this.drawCtrl(this.ctrlPoints);

      if (this.isShowPoint) {
        this.showPoint(
          this.hermite.keyFrames[t],
          this.ctrlPoints.point.canvas
        );
      }
    }
  }
  clear() {
    const { x: t, y: i, w: e, h: s } = this.grid.location;
    this.cxt2D.clearRect(0, 0, e + 2 * t, s + 2 * i);
  }
  lightCurve() {
    const { focousColor: t } = this.ctrlConfig;
    this.cxt2D.strokeStyle = t;
    this.hermite.update(this.cxt2D);
    this.isShowAuxi = true;
  }
  showCtrl(t) {
    if (!(this.ctrlPoints && this.ctrlPoints.index === t.index)) {
      if (this.ctrlPoints) {
        this.resetCtrl();
        this.lightCurve();
      }

      this.drawCtrl(t);
    }
  }
  showPoint(t, i) {
    if (!t) {
      return;
    }
    this.isShowPoint = true;
    const { x: e, y: s } = i;
    this.cxt2D.save();
    this.cxt2D.fillStyle = "black";
    this.cxt2D.fillRect(e - 30, s - 28, 50, 18);
    this.cxt2D.fillStyle = "white";
    this.cxt2D.fillText(`${t.time},${t.value}`, e - 25, s - 15);
    this.cxt2D.restore();
  }
  drawCtrl(t, i = this.cxt2D) {
    this.isShowCtrl = true;
    this.ctrlPoints = t;
    const { point: e, inPoint: s, outPoint: r } = t;
    const { radius: h, fillColor: n } = this.ctrlConfig;
    i.save();
    i.fillColor = n;
    i.strokeStyle = "white";

    if (s) {
      s.type = "outTangent";
      this.drawLine(e.canvas, s.canvas);
      this.drawArc(s.canvas, h);
      this.ctrlPoints.inPoint = s;
    }

    if (r) {
      r.type = "inTangent";
      this.drawLine(e.canvas, r.canvas);
      this.drawArc(r.canvas, h);
      this.ctrlPoints.outPoint = r;
    }

    i.restore();
  }
  drawLine(t, i, e = this.cxt2D) {
    e.beginPath();
    e.moveTo(t.x, t.y);
    e.lineTo(i.x, i.y);
    e.closePath();
    e.stroke();
  }
  drawArc(t, i, e = this.cxt2D) {
    e.beginPath();
    e.moveTo(t.x, t.y);
    e.arc(t.x, t.y, i, 0, 2 * Math.PI);
    e.closePath();
    e.stroke();
    e.fill();
  }
  emitConfirm() {
    this.emit("confirm", {
      keyFrames: Array.from(this.hermite.keyFrames),
      multiplier: this.grid.multiplier,
    });
  }
  emitChange() {
    this.emit("change", {
      keyFrames: Array.from(this.hermite.keyFrames),
      multiplier: this.grid.multiplier,
    });
  }
};
