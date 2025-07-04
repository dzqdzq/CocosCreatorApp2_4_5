"use strict";

const {
    close: e,
    drawCurve: t,
    open: n,
    update: a,
  } = Editor.require("packages://curve-editor/panel/manager");

const i = (require("fire-fs"), Editor.require("packages://inspector/utils/utils").syncObjectProperty);
Vue.component("cc-curve-range", {
  template:
    '\n    <div>\n        <style type="text/css">\n            @import url(\'packages://curve-editor/style/iconfont.css\');\n            @import url(\'packages://curve-editor/style/curve-range.css\');\n        </style>\n        \n        <div class="curve-range">\n            <template v-if="target">\n                <ui-prop\n                    :tooltip="target.attrs.tooltip"\n                    :name="target.name"\n                    :indent="indent"\n                    :target="target"\n                    v-readonly="target.attrs.readonly"\n                >\n                    <ui-select class="flex-1"\n                    :value = "target.value.mode.value"\n                    :multi-values = "multi"\n                    @confirm="_onChangeMode"\n                    >\n                        <option value=\'0\'>Constant</option>\n                        <option value=\'1\'>Curve</option>\n                        <option value=\'2\'>TwoCurves</option>\n                        <option value=\'3\'>TwoConstants</option>\n                    </ui-select>\n\n                </ui-prop>\n\n                <div class="prop-content">\n                    <template v-if="isOneConstant()">\n                        <component\n                            :is="target.value.constant.compType"\n                            :target.sync="target.value.constant"\n                            :indent="indent+1"\n                            :multi-values="multi"\n                        ></component>\n                    </template>\n\n                    <template v-if="isOneCurve()">\n                        <ui-prop name="Curve" \n                            :indent="indent+1">\n                            <canvas v-el:thumb :style="curveCanvas"\n                                @click="showEditor(\'curve\')"\n                            ></canvas>\n                        </ui-prop>\n                    </template>\n\n                    <template v-if="isTwoCurves()">\n                        <ui-prop name="CurveMin" \n                            :indent="indent+1">\n                                <canvas v-el:thumb-min :style="curveCanvas"\n                                    @click="showEditor(\'curveMin\')"\n                                ></canvas>\n                        </ui-prop>  \n\n                        <ui-prop name="CurveMax" \n                            :indent="indent+1">\n                                <canvas v-el:thumb-max :style="curveCanvas"\n                                    @click="showEditor(\'curveMax\')"\n                                ></canvas>  \n                        </ui-prop> \n                    </template>\n\n                    <template v-if="isTwoConstants()" >\n                        <component\n                            :is="target.value.constantMin.compType"\n                            :target.sync="target.value.constantMin"\n                            :indent="indent+1"\n                            :multi-values="multi"\n                        ></component>\n                        <component\n                            :is="target.value.constantMax.compType"\n                            :target.sync="target.value.constantMax"\n                            :indent="indent+1"\n                            :multi-values="multi"\n                        ></component>\n                    </template>\n                </div>\n            </template>\n        </div>\n    </div>',
  props: {
    target: { twoWay: true, type: Object },
    readonly: { type: Boolean },
    indent: { type: Number, default: 0 },
    multi: { type: Boolean },
  },
  data() {
    return {
      style: { background: "linear-gradient(to right, #fff 0%,#fff 100%)" },
      mode: this.target.value.mode.value,
      curveCanvas:
        "width: 100%; height: 23px; border: #867e7e 1px solid; background: #252525;cursor: pointer;",
    };
  },
  created() {
    this.mode = this.target.value.mode.value;
  },
  compiled() {
    const e = this;
    process.nextTick(() => {
      e.refresh();
    });
  },
  methods: {
    T: Editor.T,
    _checkValues: (e, t, n) => e.every((e) => (n ? e == t : e != t)),
    isOneConstant() {
      return this.target.value.mode.value === cc.CurveRange.Mode.Constant;
    },
    isOneCurve() {
      return (this.target.value.mode.value === cc.CurveRange.Mode.Curve && (this._onCurveChanged(), true));
    },
    isTwoCurves() {
      return (this.target.value.mode.value === cc.CurveRange.Mode.TwoCurves && (this._onCurveChanged(), true));
    },
    isTwoConstants() {
      return this.target.value.mode.value === cc.CurveRange.Mode.TwoConstants;
    },
    apply(e) {
      const t = this;
      let n = this.target.value[e.key].value.keyFrames;
      let a = e.keyFrames.value;

      n.value = a.map((e) => ({
        value: {
          time: { type: "Float", value: e.time },
          value: { type: "Float", value: e.value },
          outTangent: { type: "Float", value: e.outTangent },
          inTangent: { type: "Float", value: e.inTangent },
        },
      }));

      this.target.value.multiplier.value = e.multiplier;

      i(
        this.$root,
        this.target.value.multiplier.path,
        "number",
        e.multiplier
      );

      this.emitChange(e);
      this.emitConfirm(e);

      process.nextTick(() => {
        t.refresh();
      });
    },
    emitChange(e) {
      Editor.UI.fire(this.$el, "target-change", {
        bubbles: true,
        detail: { path: e.keyFrames.path, value: e.keyFrames.value },
      });
    },
    emitConfirm(e) {
      Editor.UI.fire(this.$el, "target-confirm", {
        bubbles: false,
        detail: {
          path: e.keyFrames.path,
          value: e.keyFrames.value,
          isSubProp: true,
        },
      });
    },
    refresh() {
      if (!this.target.value) {
        return;
      }
      let e = false;

      if (-1 === this.target.min) {
        e = true;
      }

      if (this.mode === cc.CurveRange.Mode.Curve) {
        const n = this.getThumbCtx("thumb");

        if (n) {
          t(this.target.value.curve.value.keyFrames.value, n, e);
        }
      } else {
        if (this.mode === cc.CurveRange.Mode.TwoCurves) {
          const n = this.getThumbCtx("thumbMin");

          if (n) {
            t(this.target.value.curveMin.value.keyFrames.value, n, e);
          }

          const a = this.getThumbCtx("thumbMax");

          if (a) {
            t(this.target.value.curveMax.value.keyFrames.value, a, e);
          }
        }
      }
    },
    getThumbCtx(e) {
      if (!this.$els[e]) {
        console.warn(`${e} is not exit!`);
        return null;
      }
      const t = this.$els[e].getContext("2d");
      t.canvas.width = t.canvas.offsetWidth;
      t.canvas.height = t.canvas.offsetHeight;
      t.strokeStyle = "red";
      return t;
    },
    showEditor(e) {
      if (this.readonly || this.target.readonly) {
        return;
      }
      let t = false;

      if (-1 === this.target.min) {
        t = true;
      }

      n(
        {
          value: this.target.value[e].value,
          key: e,
          multiplier: this.target.value.multiplier.value,
          negative: t,
          radian: this.target.radian,
        },
        this
      );
    },
    reset(e, t) {
      if (this.target.value[e].default) {
        this.apply({
          value: this.target.value[e].default,
          key: e,
          multiplier: this.target.value.multiplier.default,
        });
      }

      updateCurve({
        value: this.target.value[e].default,
        key: e,
        multiplier: this.target.value.multiplier.default,
      });
    },
    _onChangeMode(e) {
      this.mode = parseInt(e.detail.value);
      i(this.$root, this.target.value.mode.path, "Enum", this.mode);
    },
    _onCurveChanged() {
      let e = this;
      process.nextTick(() => {
        e.refresh();
      });
    },
  },
});
