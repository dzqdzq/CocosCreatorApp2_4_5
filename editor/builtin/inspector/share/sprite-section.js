"use strict";
Vue.component("cc-sprite-section", {
  template:
    '\n      <style>\n        .line {\n          width: 100%;\n          margin-top: 5px;\n          margin-bottom: 5px;\n        }\n      </style>\n    \n    <ui-prop name="Trim Type" type="enum" \n      v-value="target.trimType"\n      v-values="multiTrimType"\n      :multi-values="multi"\n      :path="getPath(\'trimType\')"\n    >\n      <option value="auto">Auto</option>\n      <option value="custom">Custom</option>\n      <option value="none">None</option>\n    </ui-prop>\n      \n    <ui-prop name="Trim Threshold" type="number" \n      v-value="target.trimThreshold"\n      v-values="multiTrimThreshold"\n      :multi-values="multi"\n      :path="getPath(\'trimThreshold\')"\n      v-disabled="isNone()"\n    ></ui-prop>\n    <ui-prop name="Trim X" type="number"\n      v-value="target.trimX"\n      v-values="multiTrimX"\n      :multi-values="multi"\n      :path="getPath(\'trimX\')"\n      v-disabled="!isCustom()||isNone()"\n    ></ui-prop>\n    <ui-prop name="Trim Y" type="number"\n      v-value="target.trimY"\n      v-values="multiTrimY"\n      :multi-values="multi"\n      :path="getPath(\'trimY\')"\n      v-disabled="!isCustom()||isNone()"\n    ></ui-prop>\n    <ui-prop name="Trim Width" type="number"\n      v-value="target.width"\n      v-values="multiWidth"\n      :multi-values="multi"\n      :path="getPath(\'width\')"\n      v-disabled="!isCustom()||isNone()"\n    ></ui-prop>\n    <ui-prop name="Trim Height" type="number"\n      v-value="target.height"\n      v-values="multiHeight"\n      :multi-values="multi"\n      :path="getPath(\'height\')"\n      v-disabled="!isCustom()||isNone()"\n    ></ui-prop>\n\n    <div class="line"></div>\n      \n    <ui-prop name="Border Top" type="number" \n      v-value="target.borderTop"\n      v-values="multiComputeBoraderTop"\n      :multi-values="multi"\n      :path="getPath(\'borderTop\')"\n      v-on:change="onComputeBorderTop"\n    ></ui-prop>\n    <ui-prop name="Border Bottom" type="number" \n      v-value="target.borderBottom"\n      v-values="multiComputeBoraderBottom"\n      :multi-values="multi"\n      :path="getPath(\'borderBottom\')"\n      v-on:change="onComputeBorderBottom"\n    ></ui-prop>\n    <ui-prop name="Border Left" type="number" \n      v-value="target.borderLeft"\n      v-values="multiComputeBoraderLeft"\n      :multi-values="multi"\n      :path="getPath(\'borderLeft\')"\n      v-on:change="onComputeBorderLeft"\n    ></ui-prop>\n    <ui-prop name="Border Right" type="number" \n      v-value="target.borderRight"\n      v-values="multiComputeBoraderRight"\n      :multi-values="multi"\n      :path="getPath(\'borderRight\')"\n      v-on:change="onComputeBorderRight"\n    ></ui-prop>\n    \n    <div class="line"></div>\n\n    <ui-prop name="Rotated" type="boolean"\n      v-value="target.rotated"\n      v-values="multiRotated"\n      :multi-values="multi"\n      v-disabled="true"\n    ></ui-prop>\n    <ui-prop name="Offset X" type="number"\n      v-value="target.offsetX"\n      v-values="multiOffsetX"\n      :multi-values="multi"\n      v-disabled="true"\n    ></ui-prop>\n    <ui-prop name="Offset Y" type="number"\n      v-value="target.offsetY"\n      v-values="multiOffsetY"\n      :multi-values="multi"\n      v-disabled="true"\n    ></ui-prop>\n\n    <ui-button v-if="!multi" :style="cssBtn" class="blue" @confirm="editSprite">{{ T(\'COMPONENT.sprite.edit_button\') }}</ui-button>\n  ',
  data: () => ({
    cssBtn: { display: "block", width: "240px", margin: "10px auto" },
  }),
  props: {
    target: { twoWay: true, type: Object },
    multi: Boolean,
    child: Boolean,
  },
  computed: {
    multiRotated: {
      get() {
        return this.target.multiValues ? this.target.multiValues.rotated : [];
      },
    },
    multiOffsetX: {
      get() {
        return this.multi ? this.target.multiValues.offsetX : [];
      },
    },
    multiOffsetY: {
      get() {
        return this.multi ? this.target.multiValues.offsetY : [];
      },
    },
    multiTrimType: {
      get() {
        return this.multi ? this.target.multiValues.trimType : [];
      },
    },
    multiTrimThreshold: {
      get() {
        return this.multi ? this.target.multiValues.trimThreshold : [];
      },
    },
    multiTrimX: {
      get() {
        return this.multi ? this.target.multiValues.trimX : [];
      },
    },
    multiTrimY: {
      get() {
        return this.multi ? this.target.multiValues.trimY : [];
      },
    },
    multiWidth: {
      get() {
        return this.multi ? this.target.multiValues.width : [];
      },
    },
    multiHeight: {
      get() {
        return this.multi ? this.target.multiValues.height : [];
      },
    },
    multiComputeBoraderLeft: {
      get() {
        return this.multi ? this.target.multiValues.borderLeft : [];
      },
    },
    multiComputeBoraderRight: {
      get() {
        return this.multi ? this.target.multiValues.borderRight : [];
      },
    },
    multiComputeBoraderBottom: {
      get() {
        return this.multi ? this.target.multiValues.borderRight : [];
      },
    },
    multiComputeBoraderTop: {
      get() {
        return this.multi ? this.target.multiValues.borderTop : [];
      },
    },
  },
  methods: {
    T: Editor.T,
    getPath(t) {
      return this.child ? `target.subMetas.0.${t}` : "";
    },
    deltaWidth: (t) => Math.ceil((t.rawWidth - t.width) / 2),
    deltaHeight: (t) => Math.ceil((t.rawHeight - t.height) / 2),
    onComputeBorderTop(t) {
      this.target.borderTop = Math.max(
        t.detail.value - this.deltaHeight(this.target) - this.target.offsetY,
        0
      );
    },
    onComputeBorderBottom(t) {
      this.target.borderBottom = Math.max(
        t.detail.value - this.deltaHeight(this.target) - this.target.offsetY,
        0
      );
    },
    onComputeBorderLeft(t) {
      this.target.borderLeft = Math.max(
        t.detail.value - this.deltaWidth(this.target) - this.target.offsetX,
        0
      );
    },
    onComputeBorderRight(t) {
      this.target.borderRight = Math.max(
        t.detail.value - this.deltaWidth(this.target) - this.target.offsetX,
        0
      );
    },
    editSprite() {
      Editor.Panel.open("sprite-editor", { uuid: this.target.uuid });
    },
    isNone() {
      return "none" === this.target.trimType;
    },
    isCustom() {
      return "custom" === this.target.trimType;
    },
  },
});
