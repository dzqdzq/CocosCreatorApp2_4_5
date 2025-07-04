(() => {
  "use strict";
  const e = require("fire-path");

  const t = {
    ".txt": "text",
    ".html": "html",
    ".xml": "xml",
    ".css": "css",
    ".less": "less",
    ".scss": "scss",
    ".stylus": "stylus",
    ".json": "json",
    ".yaml": "yaml",
    ".ini": "ini",
  };

  Editor.Panel.extend({
    dependencies: [
      "packages://inspector/share/meta-header.js",
      "packages://inspector/share/code-preview.js",
    ],
    template:
      '\n      <cc-meta-header\n        :target="target"\n        icon="unpack://static/icon/assets/text.png"\n      ></cc-meta-header>\n\n      <cc-code-preview \n        v-if="!multi"\n        :type="assetType()"\n        :path="target.__path__"\n      >\n      </cc-code-preview>\n    ',
    methods: {
      assetType() {
        return t[e.extname(this.target.__path__)] || "text";
      },
    },
  });
})();
