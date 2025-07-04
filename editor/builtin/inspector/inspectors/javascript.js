(() => {
  "use strict";
  Editor.Panel.extend({
    dependencies: [
      "packages://inspector/share/meta-header.js",
      "packages://inspector/share/code-preview.js",
      "packages://inspector/share/markdown-preview.js",
    ],
    template:
      '\n      <cc-meta-header\n        :target="target"\n        icon="unpack://static/icon/assets/javascript.png"\n      ></cc-meta-header>\n\n      <div class="props">\n        <ui-prop :name="T(\'INSPECTOR.javascript.plugin\')" type="boolean" \n          v-value="target.isPlugin"\n          v-values="target.multiValues.isPlugin"\n          :multi-values="multi"\n        >\n        </ui-prop>\n        <div v-if="target.isPlugin">\n          <ui-prop indent=1 type="boolean"\n            :name="T(\'INSPECTOR.javascript.loadPluginInWeb\')"\n            v-value="target.loadPluginInWeb"\n            v-values="target.multiValues.loadPluginInWeb"\n            :multi-values="multi"\n          ></ui-prop>\n          <ui-prop indent=1 type="boolean"\n            :name="T(\'INSPECTOR.javascript.loadPluginInEditor\')"\n            v-if="target.loadPluginInWeb"\n            v-value="target.loadPluginInEditor"\n            v-values="target.multiValues.loadPluginInEditor"\n            :multi-values="multi"\n          ></ui-prop>\n          <ui-prop indent=1 type="boolean"\n            :name="T(\'INSPECTOR.javascript.loadPluginInEditor\')"\n            v-if="!target.loadPluginInWeb"\n            v-value="false"\n            v-disabled="true"\n          ></ui-prop>\n          <ui-prop indent=1 type="boolean"\n            :name="T(\'INSPECTOR.javascript.loadPluginInNative\')"\n            v-value="target.loadPluginInNative"\n            v-values="target.multiValues.loadPluginInNative"\n            :multi-values="multi"\n          ></ui-prop>\n          \n          <cc-markdown-preview style="margin-left: 15px" \n            :path="_getMarkdownUrl()"\n            v-if="!multi"\n          >\n          </cc-markdown-preview>\n        </div>\n        \n        <cc-code-preview \n          :type="target.__assetType__" \n          :path="target.__path__"\n          v-if="!multi"\n        >\n        </cc-code-preview>\n      </div>\n    ',
    methods: {
      _getMarkdownUrl: () => Editor.url(Editor.T("MESSAGE.assets.plugin_url")),
    },
  });
})();
