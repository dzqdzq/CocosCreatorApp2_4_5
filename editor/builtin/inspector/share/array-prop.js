"use strict";
Vue.component("cc-array-prop", {
  template:
    '\n    <ui-prop\n      :tooltip="target.attrs.tooltip"\n      :name="target.name"\n      :indent="indent"\n      v-readonly="target.attrs.readonly"\n      foldable\n    >\n      <template v-if="!target.values || target.values.length <= 1">\n        <ui-num-input class="flex-1"\n          type="int" min="0"\n          :value="target.value.length"\n          @confirm="arraySizeChanged"\n          droppable="node,asset"\n          :resourcetype="getType()"\n          :elementtype="target.elementType"\n          :attrtype="target.attrs.type"\n          multi\n        ></ui-num-input>\n        <div slot="child">\n          <component\n            v-for="prop in target.value"\n            :is="prop.compType"\n            :target.sync="prop"\n            :indent="indent+1"\n          ></component>\n        </div>\n      </template>\n      <template v-else>\n        <span>Difference</span>\n      </template>\n    </ui-prop>\n  ',
  props: {
    indent: { type: Number, default: 0 },
    target: { twoWay: true, type: Object },
  },
  methods: {
    getType() {
      return "cc.Node" === this.target.elementType
        ? this.target.attrs.type
        : Editor.assettype2name[this.target.attrs.type];
    },
    arraySizeChanged(e) {
      let t = e.detail.dragItems;

      if (t) {
        setTimeout(() => {
          for (let e = this.$children.length; e > 0; e--) {
            let n = this.$children[e - 1].$el.children[0];
            let a = this.$children.length - e;
            if ("" !== n.value || a >= t.length) {
              break;
            }
            n.updateValue(t[t.length - a - 1].id);
          }
        }, 400);
      }

      if (e.detail.value < this.target.value.length) {
        let t = new Array(e.detail.value);
        for (let n = 0; n < e.detail.value; ++n) {
          t[n] = this.target.value[n];
        }
        this.target.value = t;
      } else {
        this.target.value.length = e.detail.value;
      }
      Editor.UI.fire(this.$el, "target-size-change", {
        bubbles: true,
        detail: { path: this.target.path + ".length", value: e.detail.value },
      });
    },
  },
});
