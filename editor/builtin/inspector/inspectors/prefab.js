(() => {
  "use strict";
  Editor.Panel.extend({
    dependencies: ["packages://inspector/share/meta-header.js"],
    template: `\n      <cc-meta-header\n        :target="target"\n        icon="unpack://static/icon/assets/prefab.png"\n      ></cc-meta-header>\n      \n      <ui-prop :name="T('INSPECTOR.prefab.OptimizationPolicy')" type="enum" \n        v-value="target.optimizationPolicy"\n        v-values="target.multiValues.optimizationPolicy"\n        :multi-values="multi"\n      >\n        <option value="AUTO">${Editor.T(
      "INSPECTOR.prefab.OptimizationPolicy_AUTO"
    )}</option>\n        <option value="SINGLE_INSTANCE">${Editor.T(
      "INSPECTOR.prefab.OptimizationPolicy_SINGLE_INSTANCE"
    )}</option>\n        <option value="MULTI_INSTANCE">${Editor.T(
      "INSPECTOR.prefab.OptimizationPolicy_MULTI_INSTANCE"
    )}</option>\n      </ui-prop>\n      <ui-prop :name="T('INSPECTOR.scene.async_load_assets')" type="boolean" \n        v-value="target.asyncLoadAssets"\n        v-values="target.multiValues.asyncLoadAssets"\n        :multi-values="multi"\n      ></ui-prop>\n      <ui-prop :name="T('INSPECTOR.prefab.readonly')" type="boolean" readonly="true"\n        v-value="target.readonly"\n        v-values="target.multiValues.readonly"\n        :multi-values="multi" \n      ></ui-prop>\n    `,
  });
})();
