"use strict";
const e = Editor.require("packages://inspector/utils/utils").syncObjectProperty;
Vue.component("cc-shape-module", {
  template:
    '\n    <ui-prop\n      :tooltip="target.attrs.tooltip"\n      :name="target.name"\n      :indent="indent"\n      :target="target"\n      v-readonly="target.attrs.readonly"\n      foldable\n    >\n        <ui-checkbox class="flex-1"\n            v-if="target.value.enable && (target.value.enable.type === \'Boolean\' || target.value.enable.type === \'boolean\')"\n            v-value="target.value.enable.value"\n            v-values="target.value.enable.values"\n            @change="_enabledChanged($event)"\n        ></ui-checkbox>\n\n        <div slot="child" v-if="target.value.enable.value" >\n            <component\n                v-if="target.value.enable.attrs.visible !== false"\n                :is="target.value.enable.compType"\n                :target.sync="target.value.enable"\n                :indent="indent+1"\n            ></component>\n\n            <component\n                v-if="target.value.shapeType.attrs.visible !== false"\n                :is="target.value.shapeType.compType"\n                :target.sync="target.value.shapeType"\n                :indent="indent+1"\n            ></component>\n\n            <ui-prop \n                v-if="checkEnumInSubset(target.value.shapeType, [\'Box\',\'Cone\',\'Sphere\',\'Hemisphere\'])"\n                :name="target.value.emitFrom.name"\n                :indent="indent+1"\n            >\n                <ui-select\n                    :value="target.value.emitFrom.value"\n                    @confirm="_onChangeEmit"\n                >\n                    <option\n                        v-for="item in getShapeTypeEmitFrom(target.value.shapeType.value)"\n                        :value=\'item.value\'>\n                        {{item.name}}\n                    </option>\n                </ui-select>\n            </ui-prop>\n            \n            <component v-if="checkEnumInSubset(target.value.shapeType, [\'Circle\',\'Cone\',\'Sphere\',\'Hemisphere\'])"\n                :is="target.value.radius.compType"\n                :target.sync="target.value.radius"\n                :indent="indent+1"\n            ></component>\n\n            <component v-if="checkEnumInSubset(target.value.shapeType, [\'Circle\',\'Cone\',\'Sphere\',\'Hemisphere\'])"\n                :is="target.value.radiusThickness.compType"\n                :target.sync="target.value.radiusThickness"\n                :indent="indent+1"\n            ></component>\n\n            <component v-if="checkEnumInSubset(target.value.shapeType, [\'Cone\'])"\n                :is="target.value.angle.compType"\n                :target.sync="target.value.angle"\n                :indent="indent+1"\n            ></component>\n\n            <component v-if="checkEnumInSubset(target.value.shapeType, [\'Circle\',\'Cone\',\'Sphere\',\'Hemisphere\'])"\n                :is="target.value.arc.compType"\n                :target.sync="target.value.arc"\n                :indent="indent+1"\n            ></component>\n\n            <component v-if="checkEnumInSubset(target.value.shapeType, [\'Circle\',\'Cone\',\'Sphere\',\'Hemisphere\'])"\n                :is="target.value.arcMode.compType"\n                :target.sync="target.value.arcMode"\n                :indent="indent+1"\n            ></component>\n\n            <component v-if="checkEnumInSubset(target.value.shapeType, [\'Circle\',\'Cone\',\'Sphere\',\'Hemisphere\'])"\n                :is="target.value.arcSpread.compType"\n                :target.sync="target.value.arcSpread"\n                :indent="indent+1"\n            ></component>\n\n            <component v-if="checkEnumInSubset(target.value.shapeType, [\'Circle\',\'Cone\',\'Sphere\',\'Hemisphere\'])"\n                :is="target.value.arcSpeed.compType"\n                :target.sync="target.value.arcSpeed"\n                :indent="indent+1"\n            ></component>\n\n            <component v-if="checkEnumInSubset(target.value.shapeType, [\'Cone\'])"\n                :is="target.value.length.compType"\n                :target.sync="target.value.length"\n                :indent="indent+1"\n            ></component>\n\n            <component v-if="checkEnumInSubset(target.value.shapeType, [\'Box\'])"\n                :is="target.value.boxThickness.compType"\n                :target.sync="target.value.boxThickness"\n                :indent="indent+1"\n            ></component>\n\n            <component v-if="target.value.position.attrs.visible !== false"\n                :is="target.value.position.compType"\n                :target.sync="target.value.position"\n                :indent="indent+1"\n            ></component>\n\n            <component v-if="target.value.rotation.attrs.visible !== false"\n                :is="target.value.rotation.compType"\n                :target.sync="target.value.rotation"\n                :indent="indent+1"\n            ></component>\n\n            <component v-if="target.value.scale.attrs.visible !== false" \n                :is="target.value.scale.compType"\n                :target.sync="target.value.scale"\n                :indent="indent+1"\n            ></component>\n\n            <component v-if="target.value.alignToDirection.attrs.visible !== false" \n                :is="target.value.alignToDirection.compType"\n                :target.sync="target.value.alignToDirection"\n                :indent="indent+1"\n            ></component>   \n\n            <component v-if="target.value.randomDirectionAmount.attrs.visible !== false" \n                :is="target.value.randomDirectionAmount.compType"\n                :target.sync="target.value.randomDirectionAmount"\n                :indent="indent+1"\n            ></component>\n\n            <component v-if="target.value.sphericalDirectionAmount.attrs.visible !== false" \n                :is="target.value.sphericalDirectionAmount.compType"\n                :target.sync="target.value.sphericalDirectionAmount"\n                :indent="indent+1"\n            ></component>\n\n            <component v-if="target.value.randomPositionAmount.attrs.visible !== false" \n                :is="target.value.randomPositionAmount.compType"\n                :target.sync="target.value.randomPositionAmount"\n                :indent="indent+1"\n            ></component>\n        </div>\n    </ui-prop>\n  ',
  props: {
    indent: { type: Number, default: 0 },
    target: { twoWay: true, type: Object },
  },
  methods: {
    _enabledChanged(n) {
      this.target.value.enable.value = n.detail.value;
      e(this.$root, this.target.value.enable.path, "Boolean", n.detail.value);
    },
    getEnumObjFromName(e, n) {
      const t = {};
      for (const n of e.attrs.enumList)
        t[n.name] = { name: n.name, value: parseInt(n.value) };
      return n.map((e) => t[e]);
    },
    getShapeTypeEmitFrom(e) {
      const n = this;
      let t = null;
      switch (this.getEnumName(n.target.value.shapeType, e)) {
        case "Box":
          t = this.getEnumObjFromName(n.target.value.emitFrom, [
            "Volume",
            "Shell",
            "Edge",
          ]);
          break;
        case "Cone":
          t = this.getEnumObjFromName(n.target.value.emitFrom, [
            "Base",
            "Shell",
            "Volume",
          ]);
          break;
        case "Sphere":
        case "Hemisphere":
          t = this.getEnumObjFromName(n.target.value.emitFrom, [
            "Volume",
            "Shell",
          ]);
          break;
        default:
          t = [];
      }
      return t;
    },
    getEnumName(e, n) {
      for (const t of e.attrs.enumList) if (t.value === n) {
        return t.name;
      }
      return String();
    },
    checkEnumInSubset(e, n) {
      const t = this.getEnumName(e, e.value);
      for (const e of n) if (e === t) {
        return true;
      }
      return false;
    },
    _onChangeEmit(n) {
      e(
        this.$root,
        this.target.value.emitFrom.path,
        "Enum",
        parseInt(n.detail.value)
      );
    },
  },
});
