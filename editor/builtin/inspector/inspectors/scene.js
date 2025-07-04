(() => {
  "use strict";
  Editor.Panel.extend({
    dependencies: ["packages://inspector/share/meta-header.js"],
    template:
      '\n      <cc-meta-header\n        :target="target"\n        icon="unpack://static/icon/assets/scene.png"\n      ></cc-meta-header>\n\n      <ui-prop :name="T(\'INSPECTOR.scene.auto_release_assets\')" type="boolean" \n        v-value="target.autoReleaseAssets"\n        v-values="target.multiValues.autoReleaseAssets"\n        :multi-values="multi"\n      ></ui-prop>\n      <ui-prop :name="T(\'INSPECTOR.scene.async_load_assets\')" type="boolean" \n        v-value="target.asyncLoadAssets"\n        v-values="target.multiValues.asyncLoadAssets"\n        :multi-values="multi"\n      ></ui-prop>\n    ',
  });
})();
