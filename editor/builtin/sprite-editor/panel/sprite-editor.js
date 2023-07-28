const t = require("fs");
const s = require("fire-path");
const e = Editor.require("app://editor/page/gizmos/2d/elements/tools");
const i = require("svg.js");
Editor.Panel.extend({
  template: t.readFileSync(
    Editor.url("packages://sprite-editor/panel/sprite-editor.html"),
    "utf8"
  ),
  style: t.readFileSync(
    Editor.url("packages://sprite-editor/panel/sprite-editor.css"),
    "utf8"
  ),
  $: { root: "#root" },
  ready() {
    this._vm = (function (t) {
      return new window.Vue({
        el: t,
        data: {
          hasContent: false,
          scale: 50,
          minScale: 20,
          maxScale: 500,
          dirty: false,
          canSave: false,
          leftPos: 0,
          rightPos: 0,
          topPos: 0,
          bottomPos: 0,
        },
        watch: {
          scale: "_scaleChanged",
          leftPos: "leftPosChanged",
          rightPos: "rightPosChanged",
          topPos: "topPosChanged",
          bottomPos: "bottomPosChanged",
        },
        compiled() {
          this._svg = i(this.$els.svg);
          this._svg.spof();
          this._lastBcr = null;
          this._svgColor = "#5c5";
          this._dotSize = 6;
          this._borderLeft = 0;
          this._borderRight = 0;
          this._borderBottom = 0;
          this._borderTop = 0;
          this._startLeftPos = 0;
          this._startRightPos = 0;
          this._startTopPos = 0;
          this._startBottomPos = 0;
          this._meta = null;
          this._scalingSize = null;
          this.addListeners();
        },
        methods: {
          run(t) {
            this.openSprite(t.uuid);
          },
          _T: (t) => Editor.T(t),
          addListeners() {
            let t = this;
            window.addEventListener("resize", function (s) {
              if ((t._image || t._meta)) {
                t._refreshScaleSlider();

                t.resize(
                  (t._meta.rawWidth * t.scale) / 100,
                  (t._meta.rawHeight * t.scale) / 100
                );
              }
            });
          },
          _refreshScaleSlider() {
            var t;
            var s;
            var e;
            var i = this.$els.content.getBoundingClientRect();

            if (!(this._lastBcr &&
              i.width === this._lastBcr.width && i.height === this._lastBcr.height)) {
              t = (s = (i.width / this._meta.rawWidth) * 100) <
              (e = (i.height / this._meta.rawHeight) * 100)
                ? s
                : e;

              this.minScale = Math.ceil(t / 5);
              this.maxScale = Math.ceil(t);
              this.scale = Math.ceil((t + this.minScale) / 2);
              this._lastBcr = this.$els.content.getBoundingClientRect();
            }
          },
          openSprite(t) {
            if (!t) {
              return;
            }
            let s = this;
            this._loadMeta(t, function (e, i, o) {
              if (e) {
                Editor.error(
                  "Failed to load meta %s, Message: %s",
                  t,
                  e.stack
                );

                return;
              }
              s.hasContent = true;
              s._refreshScaleSlider();

              Editor.assetdb.queryMetaInfoByUuid(
                o.rawTextureUuid,
                function (t, e) {
                  s._image = new Image();
                  s._image.src = e.assetPath;

                  s._image.onload = function () {
                      s.resize(
                        (s._meta.rawWidth * s.scale) / 100,
                        (s._meta.rawHeight * s.scale) / 100
                      );
                    };
                }
              );
            });
          },
          _loadMeta(t, e) {
            if (0 === t.indexOf("mount-")) {
              if (e) {
                e(new Error("Not support mount type assets."));
              }

              return;
            }
            Editor.assetdb.queryMetaInfoByUuid(
              t,
              function (i, o) {
                if (!o) {
                  if (e) {
                    e(new Error("Can not find asset path by uuid " + t));
                  }

                  return;
                }
                var h = o.assetType;
                if ("sprite-frame" !== h) {
                  if (e) {
                    e(
                      new Error("Only support sprite-frame type assets now.")
                    );
                  }

                  return;
                }
                var r = JSON.parse(o.json);
                r.__name__ = s.basenameNoExt(o.assetPath);
                r.__path__ = o.assetPath;
                r.__mtime__ = o.assetMtime;
                this._meta = r;
                this._resetPos();

                if (e) {
                  e(null, h, r);
                }
              }.bind(this)
            );
          },
          _resetPos() {
            let t = this._meta;
            let s = (t.rawWidth - t.width) / 2;
            let e = (t.rawHeight - t.height) / 2;
            this.leftPos = Math.max(s + t.borderLeft + t.offsetX, 0);
            this.rightPos = Math.max(s + t.borderRight + t.offsetX, 0);
            this.topPos = Math.max(e + t.borderTop + t.offsetY, 0);
            this.bottomPos = Math.max(e + t.borderBottom + t.offsetY, 0);
          },
          _scaleChanged() {
            if (this._image &&
              this._meta) {
              if (this.scale < this.minScale) {
                this.scale = this.minScale;
              } else {
                if (this.scale > this.maxScale) {
                  this.scale = this.maxScale;
                }
              }

              this.resize(
                (this._meta.rawWidth * this.scale) / 100,
                (this._meta.rawHeight * this.scale) / 100
              );
            }
          },
          _onInputChanged(t) {
            var s = t.srcElement;
            if (this._image && this._meta && void 0 !== s.value) {
              var e = Number.parseInt(s.value);
              var i = 0;
              switch (s.id) {
                case "inputL":
                  i = this._image.width - this.rightPos;
                  this.leftPos = this.correctPosValue(e, 0, i);
                  break;
                case "inputR":
                  i = this._image.width - this.leftPos;
                  this.rightPos = this.correctPosValue(e, 0, i);
                  break;
                case "inputT":
                  i = this._image.height - this.bottomPos;
                  this.topPos = this.correctPosValue(e, 0, i);
                  break;
                case "inputB":
                  i = this._image.height - this.topPos;
                  this.bottomPos = this.correctPosValue(e, 0, i);
              }

              if (e > i) {
                s.value = i;
              }
            }
          },
          _onSliderValueChanged(t) {
            this.scale = t.target.value;
          },
          resize(t, s) {
            var e = this.$els.content.getBoundingClientRect();
            var i = Editor.Utils.fitSize(t, s, e.width, e.height);

            this._scalingSize = {
              width: Math.ceil(i[1]),
              height: Math.ceil(i[0]),
            };

            this.$els.canvas.width = Math.ceil(i[0]);
            this.$els.canvas.height = Math.ceil(i[1]);
            this.repaint();
          },
          getCanvasRect() {
            var t = {};
            t.top = this.$els.canvas.offsetTop;
            t.left = this.$els.canvas.offsetLeft;
            t.bottom = this.$els.canvas.offsetTop + this.$els.canvas.height;
            t.right = this.$els.canvas.offsetLeft + this.$els.canvas.width;
            t.width = this.$els.canvas.width;
            t.height = this.$els.canvas.height;
            return t;
          },
          updateBorderPos(t) {
            this._borderLeft = t.left + this.leftPos * (this.scale / 100);
            this._borderRight = t.right - this.rightPos * (this.scale / 100);
            this._borderTop = t.top + this.topPos * (this.scale / 100);
            this._borderBottom = t.bottom - this.bottomPos * (this.scale / 100);
          },
          repaint() {
            var t = this.$els.canvas.getContext("2d");
            t.imageSmoothingEnabled = false;
            var s;
            var e;
            var i;
            var o;
            var h = this._meta;
            i = h.width;
            o = h.height;
            s = ((h.rawWidth - h.width) / 2 + h.offsetX) * (this.scale / 100);

            e = ((h.rawHeight - h.height) / 2 + h.offsetY) *
            (this.scale / 100);

            if (
              (h.rotated)
            ) {
              var r = this.$els.canvas.width / 2;
              var a = this.$els.canvas.height / 2;
              t.translate(r, a);
              t.rotate((-90 * Math.PI) / 180);
              t.translate(-r, -a);

              s = this.$els.canvas.width / 2 -
              (o / 2 - h.offsetY) * (this.scale / 100);

              e = this.$els.canvas.height / 2 -
              (i / 2 - h.offsetX) * (this.scale / 100);

              let d = i;
              i = o;
              o = d;
            }

            t.drawImage(
              this._image,
              h.trimX,
              h.trimY,
              i,
              o,
              s,
              e,
              i * (this.scale / 100),
              o * (this.scale / 100)
            );

            this.drawEditElements();
          },
          svgElementMoved(t, s, e) {
            var i = s / (this.scale / 100);
            var o = e / (this.scale / 100);
            i = i > 0 ? Math.floor(i) : Math.ceil(i);
            o = o > 0 ? Math.floor(o) : Math.ceil(o);
            if (
              (Math.abs(i) > 0)
            ) {
              if (t.indexOf("l") >= 0) {
                var h = this._startLeftPos + i;
                this.leftPos = this.correctPosValue(
                  h,
                  0,
                  this._image.width - this.rightPos
                );
              }
              if (t.indexOf("r") >= 0) {
                var r = this._startRightPos - i;
                this.rightPos = this.correctPosValue(
                  r,
                  0,
                  this._image.width - this.leftPos
                );
              }
            }
            if (Math.abs(o) > 0) {
              if (t.indexOf("t") >= 0) {
                var a = this._startTopPos + o;
                this.topPos = this.correctPosValue(
                  a,
                  0,
                  this._image.height - this.bottomPos
                );
              }
              if (t.indexOf("b") >= 0) {
                var d = this._startBottomPos - o;
                this.bottomPos = this.correctPosValue(
                  d,
                  0,
                  this._image.height - this.topPos
                );
              }
            }
          },
          svgCallbacks(t) {
            var s = {};

            s.start = function () {
              this._startLeftPos = this.leftPos;
              this._startRightPos = this.rightPos;
              this._startTopPos = this.topPos;
              this._startBottomPos = this.bottomPos;
            }.bind(this);

            s.update = function (s, e) {
              this.svgElementMoved(t, s, e);
            }.bind(this);

            return s;
          },
          drawLine(t, s, i, o, h) {
            var r = { x: t, y: s };
            var a = { x: i, y: o };

            var d = e.lineTool(
              this._svg,
              r,
              a,
              this._svgColor,
              "default",
              this.svgCallbacks(h)
            );

            if ("l" === h || "r" === h) {
              d.style("cursor", "col-resize");
            } else {
              if (!("t" !== h && "b" !== h)) {
                d.style("cursor", "row-resize");
              }
            }

            return d;
          },
          drawDot(t, s, i) {
            var o = { color: this._svgColor };

            var h = e.circleTool(
              this._svg,
              this._dotSize,
              o,
              o,
              this.svgCallbacks(i)
            );

            if ("l" === i || "r" === i || "t" === i || "b" === i) {
              h.style("cursor", "pointer");
            } else {
              if ("lb" === i || "rt" === i) {
                h.style("cursor", "nesw-resize");
              } else {
                if (!("rb" !== i && "lt" !== i)) {
                  h.style("cursor", "nwse-resize");
                }
              }
            }

            this.moveDotTo(h, t, s);
            return h;
          },
          moveDotTo(t, s, e) {
            if (t) {
              t.move(s, e);
            }
          },
          drawEditElements() {
            if (this._image) {
              this._svg.clear();
              var t = this.getCanvasRect();
              this.updateBorderPos(t);

              this.lineLeft = this.drawLine(
                  this._borderLeft,
                  t.bottom,
                  this._borderLeft,
                  t.top,
                  "l"
                );

              this.lineRight = this.drawLine(
                  this._borderRight,
                  t.bottom,
                  this._borderRight,
                  t.top,
                  "r"
                );

              this.lineTop = this.drawLine(
                  t.left,
                  this._borderTop,
                  t.right,
                  this._borderTop,
                  "t"
                );

              this.lineBottom = this.drawLine(
                  t.left,
                  this._borderBottom,
                  t.right,
                  this._borderBottom,
                  "b"
                );

              this.dotLB = this.drawDot(
                  this._borderLeft,
                  this._borderBottom,
                  "lb"
                );

              this.dotLT = this.drawDot(
                  this._borderLeft,
                  this._borderTop,
                  "lt"
                );

              this.dotRB = this.drawDot(
                  this._borderRight,
                  this._borderBottom,
                  "rb"
                );

              this.dotRT = this.drawDot(
                  this._borderRight,
                  this._borderTop,
                  "rt"
                );

              this.dotL = this.drawDot(
                  this._borderLeft,
                  t.bottom - t.height / 2,
                  "l"
                );

              this.dotR = this.drawDot(
                  this._borderRight,
                  t.bottom - t.height / 2,
                  "r"
                );

              this.dotB = this.drawDot(
                  t.left + t.width / 2,
                  this._borderBottom,
                  "b"
                );

              this.dotT = this.drawDot(
                  t.left + t.width / 2,
                  this._borderTop,
                  "t"
                );
            }
          },
          correctPosValue: (t, s, e) => (t < s ? s : t > e ? e : t),
          checkState() {
            let t = Math.ceil((this._meta.rawWidth - this._meta.width) / 2);
            let s = Math.ceil((this._meta.rawHeight - this._meta.height) / 2);
            let e = this.leftPos - t - this._meta.offsetX !== this._meta.borderLeft;
            let i = this.leftPos - t - this._meta.offsetX >= 0;

            let o = this.rightPos - t - this._meta.offsetX !==
            this._meta.borderRight;

            let h = this.rightPos - t - this._meta.offsetX >= 0;
            let r = this.topPos - s - this._meta.offsetY !== this._meta.borderTop;
            let a = this.topPos - s - this._meta.offsetY >= 0;

            let d = this.bottomPos - s - this._meta.offsetY !==
            this._meta.borderBottom;

            let l = this.bottomPos - s - this._meta.offsetY >= 0;
            this.dirty = e || o || r || d;
            this.canSave = this.dirty && i && h && a && l;
          },
          leftPosChanged() {
            if (this._image) {
              var t = this.getCanvasRect();
              this.updateBorderPos(t);

              this.moveDotTo(
                this.dotL,
                this._borderLeft,
                t.bottom - t.height / 2
              );

              this.moveDotTo(
                this.dotLB,
                this._borderLeft,
                this._borderBottom
              );

              this.moveDotTo(this.dotLT, this._borderLeft, this._borderTop);

              if (this.lineLeft) {
                this.lineLeft.plot(
                  this._borderLeft,
                  t.bottom,
                  this._borderLeft,
                  t.top
                );
              }

              this.checkState();
            }
          },
          rightPosChanged() {
            if (this._image) {
              var t = this.getCanvasRect();
              this.updateBorderPos(t);

              this.moveDotTo(
                this.dotR,
                this._borderRight,
                t.bottom - t.height / 2
              );

              this.moveDotTo(
                this.dotRB,
                this._borderRight,
                this._borderBottom
              );

              this.moveDotTo(this.dotRT, this._borderRight, this._borderTop);

              if (this.lineRight) {
                this.lineRight.plot(
                  this._borderRight,
                  t.bottom,
                  this._borderRight,
                  t.top
                );
              }

              this.checkState();
            }
          },
          topPosChanged() {
            if (this._image) {
              var t = this.getCanvasRect();
              this.updateBorderPos(t);

              this.moveDotTo(
                this.dotT,
                t.left + t.width / 2,
                this._borderTop
              );

              this.moveDotTo(this.dotLT, this._borderLeft, this._borderTop);
              this.moveDotTo(this.dotRT, this._borderRight, this._borderTop);

              if (this.lineTop) {
                this.lineTop.plot(
                  t.left,
                  this._borderTop,
                  t.right,
                  this._borderTop
                );
              }

              this.checkState();
            }
          },
          bottomPosChanged() {
            if (this._image) {
              var t = this.getCanvasRect();
              this.updateBorderPos(t);

              this.moveDotTo(
                this.dotB,
                t.left + t.width / 2,
                this._borderBottom
              );

              this.moveDotTo(
                this.dotLB,
                this._borderLeft,
                this._borderBottom
              );

              this.moveDotTo(
                this.dotRB,
                this._borderRight,
                this._borderBottom
              );

              if (this.lineBottom) {
                this.lineBottom.plot(
                  t.left,
                  this._borderBottom,
                  t.right,
                  this._borderBottom
                );
              }

              this.checkState();
            }
          },
          onMouseWheel(t) {
            if (this._image) {
              t.stopPropagation();
              var s = Editor.Utils.smoothScale(this.scale / 100, t.wheelDelta);
              this.scale = 100 * s;
            }
          },
          _onRevert(t) {
            if (this._image &&
              this._meta) {
              if (t) {
                t.stopPropagation();
              }

              this._resetPos();
              this.checkState();
            }
          },
          _onApply(t) {
            if (!this._image || !this._meta) {
              return;
            }

            if (t) {
              t.stopPropagation();
            }

            var s = this._meta.borderTop;
            var e = this._meta.borderBottom;
            var i = this._meta.borderLeft;
            var o = this._meta.borderRight;
            var h = this._meta;
            let r = Math.ceil((h.rawWidth - h.width) / 2);
            let a = Math.ceil((h.rawHeight - h.height) / 2);
            h.borderTop = Math.max(this.topPos - a - h.offsetY, 0);
            h.borderBottom = Math.max(this.bottomPos - a - h.offsetY, 0);
            h.borderLeft = Math.max(this.leftPos - r - h.offsetX, 0);
            h.borderRight = Math.max(this.rightPos - r - h.offsetX, 0);
            var d = JSON.stringify(h);
            var l = h.uuid;

            Editor.assetdb.saveMeta(l, d, (t) => {
              if (t) {
                this._meta.borderTop = s;
                this._meta.borderBottom = e;
                this._meta.borderLeft = i;
                this._meta.borderRight = o;
                this._resetPos();
                this.checkState();
              }
            });

            this.checkState();
          },
        },
      });
    })(this.$root);
  },
  run(t) {
    this._vm.run(t);
  },
});
