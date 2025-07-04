"use strict";
Vue.component("cc-blend-section", {
  template:
    '\n    <ui-prop name="Blend">\n        <div slot="child">\n            <ui-prop indent=1\n            v-prop="target.srcBlendFactor"\n            :multi-values="multi"\n            ></ui-prop>\n            <ui-prop indent=1\n            v-prop="target.dstBlendFactor"\n            :multi-values="multi"\n            ></ui-prop>\n        </div>\n    </ui-prop>\n  ',
  props: { target: { twoWay: true, type: Object }, multi: { type: Boolean } },
});
