"use strict";
Vue.component("cc-prop", {
  template: '\n    <ui-prop v-prop="target" :indent="indent"></ui-prop>\n  ',
  props: {
    indent: { type: Number, default: 0 },
    target: { twoWay: true, type: Object },
  },
});
