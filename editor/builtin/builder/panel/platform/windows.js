"use strict";
const e = require(Editor.url("packages://builder/panel/platform/common"));
const t = require("electron").remote.dialog;
const i = require(Editor.url("app://editor/share/build-utils"));

exports.template = `\n    <ui-prop name="${Editor.T(
  "BUILDER.template"
)}">\n        <ui-select class="flex-1" v-value="local.template">\n            <template v-for="item in templates">\n                <option v-bind:value="item">{{item}}</option>\n            </template>\n        </ui-select>\n    </ui-prop>\n\n    <ui-prop name="${Editor.T(
  "BUILDER.remote_server"
)}" tooltip="${Editor.T(
  "BUILDER.remote_server_tooltip"
)}">\n        <ui-input class="flex-1" v-value="project['win32'].REMOTE_SERVER_ROOT" placeholder="${Editor.T(
  "BUILDER.optional_input_tips"
)}"></ui-input>\n    </ui-prop>\n\n    <ui-prop name="${Editor.T(
  "BUILDER.win_size"
)}">\n        <ui-num-input v-value="windows.width"></ui-num-input>\n            <span>X</span>\n        <ui-num-input v-value="windows.height"></ui-num-input>\n    </ui-prop>\n\n    \x3c!--<ui-prop name="VS Version" auto-height>\n        <ui-select class="flex-1" v-value="local.vsVersion">\n            <template v-for="item in vsVersions">\n                <option v-bind:value="item.value">{{item.text}}</option>\n            </template>\n        </ui-select>\n    </ui-prop>--\x3e\n\n    ${
  e.native.xxtea
}\n`;

exports.name = "win32";
exports.props = { local: null, project: null };

exports.data = function () {
    return {
      templates: [],
      vsVersions: [
        { value: "auto", text: "Auto" },
        { value: "2015", text: "VS2015" },
        { value: "2017", text: "VS2017" },
      ],
      windows: this.project[exports.name],
    };
  };

exports.created = function () {
  this.local.vsVersion = "2017";
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
      return (!(i.getAbsoluteBuildPath(this.local.buildPath).length > 58) || (t.showErrorBox(
        Editor.T("BUILDER.error.path_too_long_title"),
        Editor.T("BUILDER.error.path_too_long_desc", { max_length: 58 })
      ), false));
    },
  };

exports.beforeDestroy = function () {
    this.project.includeAnySDK = this.originIncludeAnySDK;
  };
