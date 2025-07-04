"use strict";
Vue.component("cc-gray-section", {
  template:
    '\n    <div>\n      <ui-prop indent=1\n        v-prop="target.normalMaterial"\n        :multi-values="multi"\n      ></ui-prop>\n      <ui-prop indent=1\n        v-prop="target.grayMaterial"\n        :multi-values="multi"\n      ></ui-prop>\n    </div>\n  ',
  props: { target: { twoWay: true, type: Object }, multi: { type: Boolean } },
});
