(() => {
  "use strict";
  Editor.Panel.extend({
    dependencies: [
      "packages://inspector/share/meta-header.js",
      "packages://inspector/share/texture-compress-section.js",
    ],
    style:
      "\n      .preview {\n        margin: 20px;\n      }\n\n      .title {\n        font-weight: bold;\n        text-overflow: ellipsis;\n        overflow: hidden;\n        display: flex;\n        flex: none;\n        flex-direction: row;\n        align-items: center;\n        padding-bottom: 2px;\n        margin: 5px 10px;\n        margin-bottom: 10px;\n        border-bottom: 1px solid #666;\n        height: 24px;\n        overflow: hidden;\n      }\n\n      .image-wrapper {\n        width: 100%;\n        padding: 10px;\n        box-sizing: border-box;\n      }\n\n      .preview-img {\n        width: 100%;\n        margin-bottom: 20px;\n        border: 2px solid #666;\n      }\n\n      .image-info {\n        text-align: center;\n        padding: 2px 10px;\n        font-size: 10px;\n        font-weight: bold;\n        color: rgb(255, 255, 255);\n      }\n    ",
    template: `\n      <cc-meta-header\n        :target="target"\n      ></cc-meta-header>\n\n      <div class="props flex-1">\n        <div>\n          <ui-prop name="${Editor.T(
      "AUTOATLAS.max_width"
    )}" type="number" \n            v-value="target.maxWidth"\n            v-values="target.multiValues.maxWidth"\n            :multi-values="multi"\n          ></ui-prop>\n          <ui-prop name="${Editor.T(
      "AUTOATLAS.max_height"
    )}" type="number" \n            v-value="target.maxHeight"\n            v-values="target.multiValues.maxHeight"\n            :multi-values="multi"\n          ></ui-prop>\n          <ui-prop name="${Editor.T(
      "AUTOATLAS.padding"
    )}" type="number" \n            v-value="target.padding"\n            v-values="target.multiValues.padding"\n            :multi-values="multi"\n          ></ui-prop>\n          <ui-prop name="${Editor.T(
      "AUTOATLAS.allow_rotation"
    )}" type="boolean" \n            v-value="target.allowRotation"\n            v-values="target.multiValues.allowRotation"\n            :multi-values="multi"\n          ></ui-prop>\n          <ui-prop name="${Editor.T(
      "AUTOATLAS.force_squared"
    )}" type="boolean" \n            v-value="target.forceSquared"\n            v-values="target.multiValues.forceSquared"\n            :multi-values="multi"\n          ></ui-prop>\n          <ui-prop name="${Editor.T(
      "AUTOATLAS.powerOfTwo"
    )}" type="boolean" \n            v-value="target.powerOfTwo"\n            v-values="target.multiValues.powerOfTwo"\n            :multi-values="multi"\n          ></ui-prop>\n          <ui-prop name="${Editor.T(
      "AUTOATLAS.heuristices"
    )}" type="enum" \n            v-value="target.algorithm"\n            v-values="target.multiValues.algorithm"\n            :multi-values="multi"\n          >\n            <option value="MaxRects">MaxRects</option>\n            \x3c!-- TODO: 这个算法还有问题，等待修复后再集成 \n              <option value="ipacker">ipacker</option> \n            --\x3e\n          </ui-prop>\n          <ui-prop name="${Editor.T(
      "AUTOATLAS.padding_bleed"
    )}" tooltip="${Editor.T(
      "AUTOATLAS.padding_bleed_info"
    )}" type="boolean" \n            v-value="target.paddingBleed"\n            v-values="target.multiValues.paddingBleed"\n            :multi-values="multi"\n          ></ui-prop>\n          <ui-prop name="${Editor.T(
      "AUTOATLAS.filter_unused"
    )}" tooltip="${Editor.T(
      "AUTOATLAS.filter_unused_warn"
    )}">\n            <ui-checkbox class="item" \n              v-value="target.filterUnused"\n              v-values="target.multiValues.filterUnused"\n              :multi-values="multi"\n            >\n              <i class="fa fa-exclamation-triangle fa-1" aria-hidden="true" style="color:yellow" title="${Editor.T(
      "AUTOATLAS.filter_unused_warn"
    )}"></i>\n            </ui-checkbox>\n          </ui-prop>\n\n          <ui-section>\n            <div slot="header">Texture</div>\n\n            <ui-prop name="Premultiply Alpha" type="boolean" \n              v-value="target.premultiplyAlpha"\n              v-values="target.multiValues.premultiplyAlpha"\n              :multi-values="multi"\n            ></ui-prop>\n            <ui-prop name="Filter Mode" type="enum" \n              v-value="target.filterMode"\n              v-values="target.multiValues.filterMode"\n              :multi-values="multi"\n            >\n              <option value="point">Point</option>\n              <option value="bilinear">Bilinear</option>\n              <option value="trilinear">Trilinear</option>\n            </ui-prop>\n            <ui-prop name="Packable" type="boolean" \n              v-value="target.packable"\n              v-values="target.multiValues.packable"\n              :multi-values="multi"\n            ></ui-prop>\n\n            <texture-compress v-ref:preview v-if="!multi"\n              :target.sync="target"\n            >\n            </texture-compress>\n          </ui-section>\n          \n        </div>\n\n        <div style="display:flex">\n          <ui-button class="preview flex-1" @confirm="_onPreviewClick"\n            v-if="!multi"\n          >\n            Preview\n          </ui-button>\n        </div>\n\n        <div v-if="!multi">\n          <div class="title">Packed Textures</div>\n\n          <div class="image-wrapper">\n            <div v-for="texture in packedTextures">\n              <div class="image-info">\n                <span class="info-name">{{texture.name}}</span>  \n                <span class="info-result">{{texture.result}}</span>\n              </div>\n              <img class="preview-img"\n                :src="texture.path"\n              ></img>\n            </div>\n          </div>\n\n          <div class="title">Unpacked Textures</div>\n\n          <div class="image-wrapper">\n            <div v-for="texture in unpackedTextures">\n              <div class="image-info">\n                <span class="info-name">{{texture.name}}</span>  \n                <span class="info-result">{{texture.result}}</span>\n              </div>\n              <img class="preview-img"\n                :src="texture.path"\n              ></img>\n            </div>\n          </div>\n        </div>\n\n        <ui-loader v-if="generating">Generating...</ui-loader>\n      </div>\n    `,
    props: {
      packedTextures: {
        type: Array,
        default: function () {
          return [];
        },
      },
      unpackedTextures: {
        type: Array,
        default: function () {
          return [];
        },
      },
      generating: false,
    },
    ready() {
      this._getInfo();
    },
    watch: { target: "_getInfo" },
    methods: {
      _onPreviewClick() {
        this.generating = true;

        Editor.Ipc.sendToPanel(
          "scene",
          "scene:generate-texture-packer-preview-files",
          this.target.uuid,
          (e) => {
            this.generating = false;
            if (e) {
              this.packedTextures = [];
              this.unpackedTextures = [];
              return;
            }
            this._getInfo();
          },
          -1
        );
      },
      _getInfo() {
        Editor.Ipc.sendToPanel(
          "scene",
          "scene:query-texture-packer-preview-files",
          this.target.uuid,
          (e, n) => {
            if (n) {
              n.packedTextures.forEach((e) => {
                    e.path += "?time=" + Date.now();
                  });

              n.unpackedTextures.forEach((e) => {
                e.path += "?time=" + Date.now();
              });

              this.packedTextures = n.packedTextures;
              this.unpackedTextures = n.unpackedTextures;
            } else {
              this.packedTextures = [];
              this.unpackedTextures = [];
            }
          }
        );
      },
    },
  });
})();
