(() => {
  "use strict";
  Editor.Panel.extend({
    dependencies: [
      "packages://inspector/share/meta-header.js",
      "packages://inspector/share/audio-preview.js",
    ],
    template:
      '\n      <cc-meta-header\n        :target="target"\n        icon="unpack://static/icon/assets/audio-clip.png"\n      ></cc-meta-header>\n\n      <div class="props flex-1">\n        <ui-prop :name="T(\'INSPECTOR.audio.download_mode\')" type="Enum" \n          v-value="target.downloadMode"\n          v-values="target.multiValues.downloadMode"\n          :multi-values="multi"\n        >\n            <option value="0">Web Audio</option>\n            <option value="1">DOM Audio</option>\n        </ui-prop>\n      </div>\n\n      <cc-audio-preview :target="target" v-ref:preview v-if="!multi">\n      </cc-audio-preview>\n    ',
    methods: {
      resize() {
        this.$refs.preview.resize();
      },
    },
  });
})();
