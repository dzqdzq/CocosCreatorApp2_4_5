"use strict";
const e = Editor.require("packages://inspector/utils/utils").syncObjectProperty;
Vue.component("cc-object-prop", {
  template:
    '\n    <ui-prop\n      :tooltip="target.attrs.tooltip"\n      :name="target.name"\n      :indent="indent"\n      v-readonly="target.attrs.readonly"\n      foldable\n    >\n      <ui-checkbox class="flex-1"\n          v-if="target.value.enable && (target.value.enable.type === \'Boolean\' || target.value.enable.type === \'boolean\')"\n          v-value="target.value.enable.value"\n          v-values="target.value.enable.values"\n          @change="_enabledChanged($event)"\n      ></ui-checkbox>\n\n      <div slot="child" v-if="target.value.enable && (target.value.enable.type === \'Boolean\' || target.value.enable.type === \'boolean\')" >\n        <template v-for="prop in target.value">\n          <component\n            v-if="target.value.enable.value && prop.attrs.visible !== false"\n            :is="prop.compType"\n            :target.sync="prop"\n            :indent="indent+1"\n          ></component>\n        </template>\n      </div>\n\n      <div slot="child" v-else>\n        <template v-for="prop in target.value">\n            <component\n            v-if="prop.attrs.visible !== false"\n            :is="prop.compType"\n            :target.sync="prop"\n            :indent="indent+1"\n          ></component>\n        </template>\n      </div>\n    </ui-prop>\n  ',
  props: {
    indent: { type: Number, default: 0 },
    target: { twoWay: true, type: Object },
  },
  methods: {
    _enabledChanged(t) {
      this.target.value.enable.value = t.detail.value;
      e(this.$root, this.target.value.enable.path, "Boolean", t.detail.value);
    },
  },
});
