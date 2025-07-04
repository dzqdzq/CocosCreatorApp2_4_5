"use strict";
const e = require("chroma-js");
Editor.require("packages://inspector/utils/utils").syncObjectProperty;
Vue.component("cc-gradient", {
  template:
    '\n    <div class="ui-gradient">\n        <template v-if="target">\n            <ui-prop\n                :tooltip="target.attrs.tooltip"\n                :name="target.name"\n                :indent="indent"\n                v-readonly="target.attrs.readonly">\n\n                <ui-gradient class="flex-1"\n                    :value="valueStr(value)"\n                    @change="_onGradientChanged($event)"\n                ></ui-gradient>\n            </ui-prop>\n        </template>\n    </div>\n    ',
  props: {
    title: { type: String },
    name: { type: String },
    target: { type: Object },
    indent: { type: Number, default: 0 },
  },
  methods: {
    _onGradientChanged(t) {
      this.target.value.alphaKeys.value = (t.target.value.alpha || []).map(
        (e) => ({ time: e.progress, alpha: Math.round(255 * e.value) })
      );

      this.target.value.colorKeys.value = (t.target.value.color || []).map(
          (t) => {
            let a;
            try {
              a = "string" == typeof t.value
                ? e(t.value).rgb()
                : [t.value.r, t.value.g, t.value.b];
            } catch (e) {
              a = [255, 255, 255];
            }
            return { time: t.progress, color: { r: a[0], g: a[1], b: a[2] } };
          }
        );

      this.emitChange(this.target.value.colorKeys);
      this.emitChange(this.target.value.alphaKeys);
    },
    emitChange(e) {
      Editor.UI.fire(this.$el, "target-change", {
        bubbles: true,
        detail: { path: e.path, value: e.value },
      });
    },
    emitConfirm(e) {
      Editor.UI.fire(this.$el, "target-confirm", {
        bubbles: false,
        detail: { path: e.path, value: e.value },
      });
    },
    refresh() {
      const t = this;
      if (t.target.value) {
        const a = (t.target.value.alphaKeys.value || []).map((e) => {
          let t = 0;

          if (e.value.time) {
            t = e.value.time.value;
          }

          let a = 255;

          if (e.value.alpha) {
            a = e.value.alpha.value;
          }

          return { progress: t, value: a / 255 };
        });

        const l = (t.target.value.colorKeys.value || []).map((t) => {
          let a = 0;

          if (t.value.time) {
            a = t.value.time.value;
          }

          let l = [255, 255, 255];

          if (t.value.color) {
            l[0] = t.value.color.value.r;
            l[1] = t.value.color.value.g;
            l[2] = t.value.color.value.b;
          }

          let r = "";
          try {
            r = e(l).hex();
          } catch (e) {
            r = "#ffffff";
          }
          return { progress: a, value: r };
        });

        t.value = { color: l, alpha: a };
      }
    },
  },
  data: () => ({
    value: {},
    valueStr: function (e) {
      return JSON.stringify(e);
    },
  }),
  compiled() {
    const e = this;
    process.nextTick(() => {
      e.refresh();
    });
  },
});
