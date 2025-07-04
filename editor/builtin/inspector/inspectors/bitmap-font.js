(() => {
  "use strict";
  Editor.Panel.extend({
    dependencies: ["packages://inspector/share/meta-header.js"],
    template:
      '\n      <cc-meta-header\n        :target="target"\n        icon="unpack://static/icon/assets/bitmap-font.png"\n      ></cc-meta-header>\n\n      <div class="props flex-1">\n        <ui-prop name="Texture" type="asset" assetType="texture"\n          v-value="target.textureUuid"\n          v-values="target.multiValues.textureUuid"\n          :multi-values="multi"\n        ></ui-prop>\n        <ui-prop name="Font Size" type="number" readonly\n          v-value="target.fontSize"\n          v-values="target.multiValues.fontSize"\n          :multi-values="multi" \n        ></ui-prop>\n      </div>\n    ',
  });
})();
