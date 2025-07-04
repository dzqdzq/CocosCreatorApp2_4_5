(() => {
  "use strict";
  Editor.Panel.extend({
    dependencies: [
      "packages://inspector/share/meta-header.js",
      "packages://inspector/share/image-preview.js",
      "packages://inspector/share/sprite-section.js",
    ],
    template:
      '\n      <cc-meta-header id="header"\n        :target="target"\n        :icon="iconUrl(target)"\n      ></cc-meta-header>\n\n      <div class="props flex-1">\n        <cc-sprite-section \n          :target.sync="target"\n          :multi="multi"\n        ></cc-sprite-section>\n      </div>\n\n      <cc-image-preview v-ref:preview \n        v-if="!multi"\n        :target="target"\n        :uuid="target.rawTextureUuid"\n      >\n      </cc-image-preview>\n    ',
    ready() {},
    methods: {
      resize() {
        this.$refs.preview.resize();
      },
      iconUrl: (e) => `thumbnail://${e.rawTextureUuid}?28&ts=` + Date.now(),
    },
  });
})();
