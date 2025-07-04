(() => {
  "use strict";
  Editor.Panel.extend({
    dependencies: ["packages://inspector/share/meta-header.js"],
    template:
      '\n      <cc-meta-header id="header"\n        :target="target"\n        icon="unpack://static/icon/assets/sprite-atlas.png"\n      ></cc-meta-header>\n\n      <div class="props flex-1">\n        <ui-prop name="Raw Texture File" type="asset" assetType="texture" \n          v-value="target.rawTextureUuid"\n          v-values="target.multiValues.rawTextureUuid"\n          :multi-values="multi"\n        ></ui-prop>\n        <ui-prop name="Type" type="string" \n          v-value="target.type"\n          v-values="target.multiValues.type"\n          :multi-values="multi" \n          readonly\n        ></ui-prop>\n        <ui-prop name="Width" type="number" \n          v-value="target.size.width"\n          v-values="multiWidth"\n          :multi-values="multi" \n          readonly\n        ></ui-prop>\n        <ui-prop name="Height" type="number" \n          v-value="target.size.height"\n          v-values="multiHeight"\n          :multi-values="multi" \n          readonly\n        ></ui-prop>\n      </div>\n    ',
    computed: {
      multiWidth: {
        get() {
          return this.target.multiValues
            ? this.target.multiValues.size.map((e) => e.width)
            : [];
        },
      },
      multiHeight: {
        get() {
          return this.target.multiValues
            ? this.target.multiValues.size.map((e) => e.height)
            : [];
        },
      },
    },
  });
})();
