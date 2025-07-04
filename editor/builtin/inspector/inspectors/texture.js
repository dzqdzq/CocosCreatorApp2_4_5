(() => {
  "use strict";
  function e(e) {
    return !(e & (e - 1) || !e);
  }
  Editor.Panel.extend({
    dependencies: [
      "packages://inspector/share/meta-header.js",
      "packages://inspector/share/image-preview.js",
      "packages://inspector/share/sprite-section.js",
      "packages://inspector/share/texture-compress-section.js",
    ],
    template:
      '\n      <cc-meta-header\n        :target="target"\n        :icon="thumbnail()"\n      ></cc-meta-header>\n\n      <div class="props flex-1">\n        <ui-prop name="Type" type="enum" \n          v-value="target.type"\n          v-values="target.multiValues.type"\n          :multi-values="multi"\n        >\n          <option value="raw">Raw</option>\n          <option value="sprite">Sprite</option>\n        </ui-prop>\n\n        <ui-prop name="Premultiply Alpha" type="boolean" \n          v-value="target.premultiplyAlpha"\n          v-values="target.multiValues.premultiplyAlpha"\n          :multi-values="multi"\n        ></ui-prop>\n\n        <ui-prop name="Wrap Mode" type="enum" \n          v-value="target.wrapMode"\n          v-values="target.multiValues.wrapMode"\n          :multi-values="multi"\n        >\n          <option value="clamp">Clamp</option>\n          <option value="repeat">Repeat</option>\n        </ui-prop>\n\n        <ui-prop name="Filter Mode" type="enum" \n          v-value="target.filterMode"\n          v-values="target.multiValues.filterMode"\n          :multi-values="multi"\n        >\n          <option value="point">Point</option>\n          <option value="bilinear">Bilinear</option>\n          <option value="trilinear">Trilinear</option>\n        </ui-prop>\n\n        <ui-prop name="Gen Mipmaps" type="boolean" \n          v-value="target.genMipmaps"\n          v-values="target.multiValues.genMipmaps"\n          :multi-values="multi"\n        >\n        </ui-prop>\n\n        <ui-prop name="Packable" type="boolean" \n          v-value="target.packable"\n          v-values="target.multiValues.packable"\n          :multi-values="multi"\n        >\n        </ui-prop>\n\n        <texture-compress v-ref:preview v-if="!multi"\n          :target.sync="target"\n        >\n        </texture-compress>\n\n        <ui-section v-if="target.type === \'sprite\'&&!multi">\n          <div slot="header">Sprite</div>\n          <cc-sprite-section \n            :target.sync="target.subMetas[0]"\n            :child="true"\n          ></cc-sprite-section>\n        </ui-section>\n      </div>\n\n      <cc-image-preview v-ref:preview v-if="!multi"\n        :target="target"\n        :uuid="target.uuid"\n      >\n      </cc-image-preview>\n    ',
    ready() {},
    watch: {
      "target.wrapMode": function () {
        if (!("repeat" !== this.target.wrapMode || this.isPow2())) {
          Editor.warn(Editor.T("INSPECTOR.texture.repeat_mode_warning"));
        }
      },
      "target.genMipmaps": function () {
        if (this.target.genMipmaps &&
          !this.isPow2()) {
          Editor.warn(Editor.T("INSPECTOR.texture.gen_mipmaps_warning"));
        }
      },
    },
    methods: {
      isPow2() {
        return e(this.target.width) && e(this.target.height);
      },
      resize() {
        this.$refs.preview.resize();
      },
      thumbnail() {
        return this.target.uuid
          ? `thumbnail://${this.target.uuid}?32&ts=` + Date.now()
          : "";
      },
    },
  });
})();
