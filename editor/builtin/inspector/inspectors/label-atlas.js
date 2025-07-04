(() => {
  "use strict";
  Editor.Panel.extend({
    dependencies: ["packages://inspector/share/meta-header.js"],
    template:
      '\n      <cc-meta-header\n        :target="target"\n        icon="unpack://static/icon/assets/label-atlas.png"\n      ></cc-meta-header>\n\n      <div class="props flex-1">\n        <ui-prop name="Raw Texture File" type="asset" assetType="texture" \n          v-value="target.rawTextureUuid"\n          v-values="target.multiValues.rawTextureUuid"\n          :multi-values="multi"\n        ></ui-prop>\n        <ui-prop name="Item Width">\n          <ui-num-input type="int"\n            v-value="target.itemWidth" style="width: 100%;"\n            v-values="target.multiValues.itemWidth"\n            :multi-values="multi"\n          ></ui-num-input>\n        </ui-prop>\n        <ui-prop name="Item Height">\n          <ui-num-input type="int" style="width: 100%;"\n            v-value="target.itemHeight"\n            v-values="target.multiValues.itemHeight"\n            :multi-values="multi"\n          ></ui-num-input>\n        </ui-prop>\n        <ui-prop name="Start Char" type="string" \n          v-value="target.startChar"\n          v-values="target.multiValues.startChar"\n          :multi-values="multi"\n        ></ui-prop>\n        <ui-prop name="Font Size" type="number" readonly\n          v-value="target.fontSize" \n          v-values="target.multiValues.fontSize"\n          :multi-values="multi"\n        ></ui-prop>\n      </div>\n    ',
  });
})();
