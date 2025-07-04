(() => {
  "use strict";
  Editor.Panel.extend({
    dependencies: [
      "packages://inspector/share/meta-header.js",
      "packages://inspector/share/markdown-preview.js",
    ],
    template:
      '\n      <cc-meta-header\n        :target="target"\n        icon="unpack://static/icon/assets/markdown.png"\n      ></cc-meta-header>\n\n      <div class="props" v-if="!multi">\n        <cc-markdown-preview\n          :type="target.__assetType__"\n          :path="target.__path__"\n        >\n        </cc-markdown-preview>\n      </div>\n    ',
  });
})();
