"use strict";
const e = Editor.remote.Profile.load("global://features.json");
const t = require(Editor.url("packages://builder/panel/platform/common"));
const i = require("electron").remote.dialog;
require("fire-path");
require(Editor.url("app://editor/share/build-utils"));

exports.template = `\n    <ui-prop name="${Editor.T(
  "BUILDER.template"
)}">\n        <ui-select class="flex-1" v-value="local.template">\n            <template v-for="item in templates">\n                <option v-bind:value="item">{{item}}</option>\n            </template>\n        </ui-select>\n    </ui-prop>\n    \n    <ui-prop name="${Editor.T(
  "BUILDER.bundle_identifier"
)}">\n        <ui-input class="flex-1" v-value="packageName"></ui-input>\n    </ui-prop>\n\n    <ui-prop name="${Editor.T(
  "BUILDER.remote_server"
)}" tooltip="${Editor.T(
  "BUILDER.remote_server_tooltip"
)}">\n        <ui-input class="flex-1" v-value="project['ios'].REMOTE_SERVER_ROOT" placeholder="${Editor.T(
  "BUILDER.optional_input_tips"
)}"></ui-input>\n    </ui-prop>\n    \n    <ui-prop name="${Editor.T(
  "BUILDER.orientation"
)}" auto-height>\n        <div class="layout vertical">\n            <ui-checkbox class="item" v-value="project.orientation.portrait">\n                Portrait\n            </ui-checkbox>\n            <ui-checkbox class="item" v-value="project.orientation.upsideDown">\n                Upside Down\n            </ui-checkbox>\n            <ui-checkbox class="item" v-value="project.orientation.landscapeLeft">\n                Landscape Left\n            </ui-checkbox>\n            <ui-checkbox class="item" v-value="project.orientation.landscapeRight">\n                Landscape Right\n            </ui-checkbox>\n        </div>\n    </ui-prop>\n    \n    <ui-prop name="${Editor.T(
  "BUILDER.ios_enable_jit"
)}"\n        v-if="showJIT()" \n        tooltip="${Editor.T(
  "BUILDER.ios_enable_jit_tips"
)}">\n        <ui-checkbox class="item" \n            v-value="platform['ios'].ios_enable_jit">\n        </ui-checkbox>\n    </ui-prop>\n\n    ${
  t.native.xxtea
}\n`;

const o = (exports.name = "ios");
exports.props = { local: null, project: null, anysdk: null };

exports.data = function () {
    return { templates: [], packageName: this.project[o].packageName };
  };

exports.watch = {
    packageName: {
      handler(e) {
        let t = this.project[o];

        if (t) {
          t.packageName = e;
        }
      },
    },
  };

exports.created = function () {
    Editor.Ipc.sendToMain("app:query-cocos-templates", (e, t) => {
      if (e) {
        return Editor.warn(e);
      }

      t.forEach((e) => {
        if ("android-instant" !== e) {
          this.templates.push(e);
        }
      });

      if (
        (this.local)
      ) {
        var i = this.local.template;
        if (t.length <= 0) {
          return this.set("profiles.local.template", "");
        }

        if (-1 === t.indexOf(i)) {
          this.set("profiles.local.template", t[0]);
        }
      }
    });
  };

exports.directives = {};

exports.methods = {
    checkParams() {
      let e = this.packageName;
      if (!/^[a-zA-Z0-9_.-]*$/.test(e)) {
        i.showErrorBox(
          Editor.T("BUILDER.error.build_error"),
          Editor.T("BUILDER.error.package_name_not_legal")
        );

        return false;
      }
      let t = e.split(".");
      for (let e = 0; e < t.length; e++) {
        if (!isNaN(t[e][0])) {
          i.showErrorBox(
            Editor.T("BUILDER.error.build_error"),
            Editor.T("BUILDER.error.package_name_start_with_number")
          );

          return false;
        }
      }
      return true;
    },
    showJIT: () => (e && !e.get("iOSForceDisableJit")) || false,
  };
