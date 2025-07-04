(() => {
  "use strict";
  Editor.Panel.extend({
    dependencies: [
      "packages://inspector/share/meta-header.js",
      "packages://inspector/share/code-preview.js",
    ],
    style:
      "\n        .shader-title {\n            font-size: 15px;\n            margin-bottom: 5px;\n            font-weight: bold;\n          }\n      ",
    template:
      '\n        <cc-meta-header\n          :target="target"\n          icon="unpack://static/icon/assets/shader.png"\n        ></cc-meta-header>\n  \n        <div class="props flex-1" v-if="!multi">\n          <ui-section>\n            <div slot="header shader-title">Effect</div>\n            <cc-code-preview\n              type="glsl"\n              :path="target.__path__"\n            >\n            </cc-code-preview>\n          </ui-section>\n\n          <div v-for="(index, shader) in compiledShaders">\n\n            <ui-section style="margin-top: 20px;" folded>\n              <div slot="header shader-title">Compiled Pass {{index}} Vertex Shader</div>\n              <cc-code-preview\n                type="glsl"\n                :code="shader.glsl1.vert"\n              >\n              </cc-code-preview>\n            </ui-section>\n\n            <ui-section folded>\n              <div slot="header shader-title">Compiled Pass {{index}} Fragment Shader</div>\n              <cc-code-preview\n                type="glsl"\n                :code="shader.glsl1.frag"\n              >\n              </cc-code-preview>\n            </ui-section>\n            \n          </div>\n        </div>\n        \n      ',
    computed: {
      compiledShaders() {
        return this.target.compiledShaders;
      },
    },
  });
})();
