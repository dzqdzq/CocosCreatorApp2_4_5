"use strict";
const e = require(Editor.url("packages://builder/panel/platform/common"));
const t = require("electron").remote.dialog;
require("fire-path");
require(Editor.url("app://editor/share/build-utils"));

exports.template = `\n    <ui-prop name="${Editor.T(
  "BUILDER.template"
)}">\n        <ui-select class="flex-1" v-value="local.template">\n            <template v-for="item in templates">\n                <option v-bind:value="item">{{item}}</option>\n            </template>\n        </ui-select>\n    </ui-prop>\n\n    <ui-prop name="${Editor.T(
  "BUILDER.bundle_identifier"
)}" >\n        <ui-input class="flex-1" v-value="packageName"></ui-input>\n    </ui-prop>\n\n    <ui-prop name="${Editor.T(
  "BUILDER.remote_server"
)}" tooltip="${Editor.T(
  "BUILDER.remote_server_tooltip"
)}">\n        <ui-input class="flex-1" v-value="project['mac'].REMOTE_SERVER_ROOT" placeholder="${Editor.T(
  "BUILDER.optional_input_tips"
)}"></ui-input>\n    </ui-prop>\n    <ui-prop name="${Editor.T(
  "BUILDER.win_size"
)}">\n        <ui-num-input v-value="mac.width"></ui-num-input>\n            <span>X</span>\n        <ui-num-input v-value="mac.height"></ui-num-input>\n    </ui-prop>\n\n    ${
  e.native.xxtea
}\n`;

const r = (exports.name = "mac");
exports.props = { local: null, project: null };

exports.data = function () {
    let e = this.project[r];
    return { templates: [], packageName: e.packageName, mac: e };
  };

exports.watch = {
    packageName: {
      handler(e) {
        let t = this.project[r];

        if (t) {
          t.packageName = e;
        }
      },
    },
  };

exports.created = function () {
  this.originIncludeAnySDK = this.project.includeAnySDK;
  this.project.includeAnySDK = false;

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
      var r = this.local.template;
      if (t.length <= 0) {
        return this.set("profiles.local.template", "");
      }

      if (-1 === t.indexOf(r)) {
        this.set("profiles.local.template", t[0]);
      }
    }
  });
};

exports.directives = {};

exports.methods = {
    checkParams() {
      let e = this.packageName;
      if (!/^[a-zA-Z0-9_.]*$/.test(e)) {
        t.showErrorBox(
          Editor.T("BUILDER.error.build_error"),
          Editor.T("BUILDER.error.package_name_not_legal")
        );

        return false;
      }
      let r = e.split(".");
      for (let e = 0; e < r.length; e++) {
        if (!isNaN(r[e][0])) {
          t.showErrorBox(
            Editor.T("BUILDER.error.build_error"),
            Editor.T("BUILDER.error.package_name_start_with_number")
          );

          return false;
        }
      }
      return true;
    },
  };

exports.beforeDestroy = function () {
    this.project.includeAnySDK = this.originIncludeAnySDK;
  };
