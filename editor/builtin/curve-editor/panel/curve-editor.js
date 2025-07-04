"use strict";
const e = Editor.require("packages://curve-editor/panel/curve-control");
const t = Editor.require("packages://curve-editor/panel/grid");
const i = window.Vue;

const { drawHermite: a, DEFAULT_KEYFRAMES: r } = Editor.require(
  "packages://curve-editor/panel/utils"
);

const s = require("fs");
i.config.productionTip = false;
i.config.devtools = false;
let l = null;
let n = null;
Editor.Panel.extend({
  style: s.readFileSync(
    Editor.url("packages://curve-editor/style/curve-editor.css"),
    "utf8"
  ),
  template: s.readFileSync(
    Editor.url("packages://curve-editor/template/curve-editor.html"),
    "utf8"
  ),
  $: { content: ".curve-editor" },
  messages: {
    "current-keys"(e, t) {
      n.checkAndUpdate(e, t);
    },
    "add-key"(e, t) {
      n.addKeyFrame(e, t);
    },
    "delete-key"(e, t) {
      n.deleteKeyFrame(e, t);
    },
  },
  listeners: {
    resize() {
      if (n) {
        n.rePaint();
      }
    },
  },
  ready() {
    n = new i({
      el: (l = this).$content,
      data: {
        scale: 1,
        showPresets: false,
        currentPoint: null,
        mainCtx: null,
        gridCtx: null,
        ctrlCxt: null,
        target: { keyFrames: r[0] },
        axis: { piece: 10, rangeX: 1, rangeY: 1 },
        ctrlConfig: {
          fillColor: "red",
          strokeStyle: "white",
          radius: 2,
          lineWidth: 1,
          handlerSize: 40,
          focousColor: "rgba(245, 240, 32, 0.44)",
        },
        curveConfig: { strokeStyle: "red", lineWidth: 0.1 },
        defaultKeyFrames: r,
        toolCanvas: [],
      },
      computed: {
        toolCanvasSize() {
          return {
            w: this.mainCtx.canvas.width / 10,
            h: this.mainCtx.canvas.height / 5,
          };
        },
        multiplier() {
          const e = this;
          return e.target.multiplier
            ? e.target.radian
              ? Number(((180 * e.target.multiplier) / Math.PI).toFixed(2))
              : e.target.multiplier
            : 1;
        },
      },
      compiled() {
        this.init();
      },
      methods: {
        T: (e) => Editor.I18n.t(e),
        rePaint() {
          this.initCanvas();
          this.curveControl.rePaint();
          this.drawThumb(this.$els.tools, this.defaultKeyFrames);
        },
        init() {
          this.initCanvas();
          this.drawGrid();
          this.drawCurve();
        },
        onMulti(e) {
          let t = e.target.value;

          if (0 !== e.target.value) {
            this.grid.multiplier = t;

            if (this.target.radian) {
              t = (t / 180) * Math.PI;
            }

            this.target.multiplier = t;
            Editor.Ipc.sendToPanel("inspector", "curve:change", this.target);
          }
        },
        onTools(e) {
          const t = e.target.getAttribute("index");

          if (t) {
            this.target.keyFrames.value = this.defaultKeyFrames[t];

            this.curveControl.update(
              this.target.keyFrames.value,
              this.target.negative
            );

            Editor.Ipc.sendToPanel("inspector", "curve:change", this.target);
          }
        },
        onShowPresets(e) {
          this.showPresets = true;
          const { offsetX: t, offsetY: i } = e.target;
          this.drawThumb(this.$els.presets, this.defaultKeyFrames);
        },
        checkAndUpdate(e, t) {
          if (t) {
            this.target = {};
            if (!Array.isArray(t.value.keyFrames.value) ||
              t.value.keyFrames.value.length < 1) {
              this.target.keyFrames.value = r[0];
            } else {
              let e = [];
              for (let i = 0, a = t.value.keyFrames.value.length; i < a; i++) {
                let a = t.value.keyFrames.value[i];
                e.push({
                  time: a.value.time.value,
                  value: a.value.value.value,
                  outTangent: a.value.outTangent.value,
                  inTangent: a.value.inTangent.value,
                });
              }
              this.target.keyFrames = t.value.keyFrames;
              this.target.keyFrames.value = e;
            }
            this.target.key = t.key;
            this.target.negative = t.negative;
            this.target.radian = t.radian;
            if ("number" != typeof t.multiplier) {
              this.target.multiplier = 1;
              return;
            }
            this.target.multiplier = t.multiplier;
            this.grid.multiplier = this.multiplier;
            this.curveControl.update(this.target.keyFrames.value, t.negative);
            this.drawThumb(this.$els.tools, this.defaultKeyFrames);
          }
        },
        drawThumb(e, t) {
          t.map((i, r) => {
            let s;

            if (this.toolCanvas.length !== t.length) {
              (s = document.createElement("canvas")).setAttribute(
                    "index",
                    String(r)
                  );

              e.append(s);
              this.toolCanvas.push(s);
            } else {
              s = this.toolCanvas[r];
            }

            this.resizeCanvas([s], this.toolCanvasSize);
            const l = s.getContext("2d");
            l.strokeStyle = "white";
            a(i, l, this.target.negative);
          });
        },
        initCanvas() {
          this.gridCtx = this.$els.gridCanvas.getContext("2d");
          this.mainCtx = this.$els.mainCanvas.getContext("2d");
          this.ctrlCxt = this.$els.controlCanvas.getContext("2d");

          this.resizeCanvas(
            [this.gridCtx.canvas, this.mainCtx.canvas, this.ctrlCxt.canvas],
            { w: l.clientWidth, h: 0.8 * l.clientHeight }
          );
        },
        resizeCanvas(e, t) {
          for (const i of e) {
            i.width = t.w;
            i.height = t.h;
          }
        },
        drawCurve() {
          let t = this;

          this.curveControl = new e({
            context: this.ctrlCxt,
            mainCtx: this.mainCtx,
            grid: this.grid,
            ctrlConfig: this.ctrlConfig,
            curveConfig: this.curveConfig,
          });

          this.curveControl.on("change", (e) => {
            t.target.keyFrames.value = e.keyFrames;
            Editor.Ipc.sendToPanel("inspector", "curve:change", t.target);
          });
        },
        drawGrid() {
          const e = {
            context: this.gridCtx,
            axisMargin: 30,
            lineWidth: 1,
            axis: this.axis,
            multiplier: this.multiplier,
          };
          this.grid = new t(e);
          this.grid.draw();
        },
        onMouseWheel(e) {
          e.stopPropagation();
          const { wheelDelta: t } = e;
          const i = (this.scale / 100) * Math.pow(2, 0.002 * t);
          this.scale = Math.ceil(100 * i);
        },
        addKeyFrame(e, t) {
          this.curveControl.addKeyFrame(t);
        },
        deleteKeyFrame(e, t) {
          this.curveControl.delKeyFrame(t);
        },
      },
    });

    Editor.Ipc.sendToPanel("inspector", "curve:state", "true");
  },
  close() {
    Editor.Ipc.sendToPanel("inspector", "curve:state", "false");
  },
});
