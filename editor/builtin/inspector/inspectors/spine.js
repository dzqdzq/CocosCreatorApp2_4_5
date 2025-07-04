(() => {
  "use strict";
  Editor.Panel.extend({
    dependencies: ["packages://inspector/share/meta-header.js"],
    template:
      '\n      <cc-meta-header\n        :target="target"\n        icon="unpack://static/icon/assets/spine.png"\n      ></cc-meta-header>\n\n      <div class="props">\n        <ui-prop name="Atlas Texture" type="asset" assetType="texture"  \n          v-value="target.textures[0]"\n          v-values="target.multiValues.textures"\n          :multi-values="multi"\n        ></ui-prop>\n        <ui-prop name="Scale" type="number" \n          v-value="target.scale"\n          v-values="target.multiValues.scale"\n          :multi-values="multi"\n          tooltip="This can be useful when using different sized images than were used when designing the skeleton in Spine. For example, if using images that are half the size than were used in Spine, a scale of 0.5 can be used. This is commonly used for games that can run with either low or high resolution texture atlases."\n        ></ui-prop>\n      </div>\n    ',
  });
})();
