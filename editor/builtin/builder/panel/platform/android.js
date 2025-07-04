"use strict";
const e = require("fs");
const t = require("electron");
const { promisify: i } = require("util");
const a = require(Editor.url("packages://builder/panel/platform/common"));
const o = require("electron").remote.dialog;
const r = (require("fire-path"), require(Editor.url("app://editor/share/build-utils")));

exports.template = `\n    <ui-prop name="${Editor.T(
  "BUILDER.template"
)}">\n        <ui-select class="flex-1" v-value="local.template">\n            <template v-for="item in templates">\n                <option v-bind:value="item">{{item}}</option>\n            </template>\n        </ui-select>\n    </ui-prop>\n    \n    <ui-prop name="${Editor.T(
  "BUILDER.package_name"
)}">\n        <ui-input class="flex-1" v-value="packageName"></ui-input>\n    </ui-prop>\n\n    <ui-prop name="${Editor.T(
  "BUILDER.remote_server"
)}" tooltip="${Editor.T(
  "BUILDER.remote_server_tooltip"
)}">\n        <ui-input class="flex-1" v-value="project['android'].REMOTE_SERVER_ROOT" placeholder="${Editor.T(
  "BUILDER.optional_input_tips"
)}"></ui-input>\n    </ui-prop>\n\n    <ui-prop name="Target API Level">\n        <ui-select class="flex-1" v-value="local.apiLevel">\n            <template v-for="item in apiLevels">\n                <option v-bind:value="item">{{item}}</option>\n            </template>\n        </ui-select>\n    </ui-prop>\n\n    <ui-prop name="APP ABI" auto-height>\n        <div class="layout vertical">\n            <ui-checkbox class="item" v-value="armeabiV7a">\n                armeabi-v7a\n            </ui-checkbox>\n            <ui-checkbox class="item" v-value="arm64V8a">\n                arm64-v8a\n            </ui-checkbox>\n            <ui-checkbox class="item" v-value="x86">\n                x86\n            </ui-checkbox>\n            <ui-checkbox class="item" v-value="x86_64">\n                x86_64\n            </ui-checkbox>\n        </div>\n    </ui-prop>\n\n    <ui-prop name="${Editor.T(
  "KEYSTORE.keystore"
)}">\n        <ui-checkbox v-value="local.useDebugKeystore">\n            ${Editor.T(
  "KEYSTORE.use_debug_keystore"
)}\n        </ui-checkbox>\n    </ui-prop>\n\n    \x3c!-- mi --\x3e\n    \n    <ui-prop name="${Editor.T(
  "KEYSTORE.keystore_path"
)}" v-disabled="local.useDebugKeystore">\n        <div class="layout horizontal center flex-1">\n            <ui-input class="flex-2" v-value="local.keystorePath"></ui-input>\n            <ui-button class="tiny" v-on:confirm="_onChooseKeystoreClick">\n                ···\n            </ui-button>\n            <ui-button class="tiny" v-on:confirm="_onShowKeystoreClick">\n                ${Editor.T(
  "SHARED.open"
)}\n            </ui-button>\n            <ui-button class="tiny" v-on:confirm="_onNewKeystoreClick">\n                ${Editor.T(
  "SHARED.new"
)}\n            </ui-button>\n        </div>\n    </ui-prop>\n    \n    <ui-prop name="${Editor.T(
  "KEYSTORE.keystore_password"
)}" v-disabled="local.useDebugKeystore">\n        <ui-input class="flex-1" password v-value="local.keystorePassword"></ui-input>\n    </ui-prop>\n    \n    <ui-prop name="${Editor.T(
  "KEYSTORE.keystore_alias"
)}" v-disabled="local.useDebugKeystore">\n        <ui-input class="flex-1" v-value="local.keystoreAlias"></ui-input>\n    </ui-prop>\n    \n    <ui-prop name="${Editor.T(
  "KEYSTORE.keystore_alias_password"
)}" v-disabled="local.useDebugKeystore">\n        <ui-input class="flex-1" password v-value="local.keystoreAliasPassword"></ui-input>\n    </ui-prop>\n\n    \x3c!-- mi --\x3e\n\n    <ui-prop name="${Editor.T(
  "BUILDER.orientation"
)}" auto-height>\n        <div class="layout vertical">\n            <ui-checkbox class="item" v-value="portrait">\n                Portrait\n            </ui-checkbox>\n            <ui-checkbox class="item" v-value="upsideDown">\n                Upside Down\n            </ui-checkbox>\n            <ui-checkbox class="item" v-value="landscapeLeft">\n                Landscape Left\n            </ui-checkbox>\n            <ui-checkbox class="item" v-value="landscapeRight">\n                Landscape Right\n            </ui-checkbox>\n        </div>\n    </ui-prop>\n    \n    \x3c!-- android app bundle --\x3e\n    <ui-prop name="${Editor.T(
  "BUILDER.app_bundle"
)}">\n        <ui-checkbox class="item" v-value="project.appBundle"></ui-checkbox>\n    </ui-prop>\n\n    ${
  a.native.xxtea
}\n`;

const n = (exports.name = "android");
exports.props = { local: null, project: null, anysdk: null };

exports.data = function () {
  var e = this.project.orientation;
  var t = this.project[n];
  return {
    portrait: e.portrait,
    upsideDown: e.upsideDown,
    landscapeLeft: e.landscapeLeft,
    landscapeRight: e.landscapeRight,
    templates: [],
    apiLevels: [],
    armeabi: this.local.appABIs.indexOf("armeabi") >= 0,
    armeabiV7a: this.local.appABIs.indexOf("armeabi-v7a") >= 0,
    arm64V8a: this.local.appABIs.indexOf("arm64-v8a") >= 0,
    x86: this.local.appABIs.indexOf("x86") >= 0,
    x86_64: this.local.appABIs.indexOf("x86_64") >= 0,
    packageName: t.packageName,
  };
};

exports.watch = {
    portrait: {
      handler(e) {
        if (this.project) {
          this.project.orientation.portrait = e;
        }
      },
    },
    upsideDown: {
      handler(e) {
        if (this.project) {
          this.project.orientation.upsideDown = e;
        }
      },
    },
    landscapeLeft: {
      handler(e) {
        if (this.project) {
          this.project.orientation.landscapeLeft = e;
        }
      },
    },
    landscapeRight: {
      handler(e) {
        if (this.project) {
          this.project.orientation.landscapeRight = e;
        }
      },
    },
    armeabi: {
      handler(e) {
        this._abiValueChanged("armeabi", e);
      },
    },
    armeabiV7a: {
      handler(e) {
        this._abiValueChanged("armeabi-v7a", e);
      },
    },
    arm64V8a: {
      handler(e) {
        this._abiValueChanged("arm64-v8a", e);
      },
    },
    x86: {
      handler(e) {
        this._abiValueChanged("x86", e);
      },
    },
    x86_64: {
      handler(e) {
        this._abiValueChanged("x86_64", e);
      },
    },
    packageName: {
      handler(e) {
        let t = this.project[n];

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
        this.templates.push(e);
      });

    if (
      (this.local)
    ) {
      var i = this.local.template;
      if (t.length <= 0) {
        return (this.local.template = "");
      }

      if (-1 === t.indexOf(i)) {
        this.local.template = t[0];
      }
    }
  });

  Editor.Ipc.sendToMain("app:query-android-apilevels", (e, t) => {
    if (e) {
      return Editor.warn(e);
    }

    t.forEach((e) => {
        this.apiLevels.push(e);
      });

    if (
      (this.local)
    ) {
      var i = this.local.apiLevel;
      if (t.length <= 0) {
        return (this.local.apiLevel = "");
      }

      if (-1 === t.indexOf(i)) {
        this.local.apiLevel = t[t.length - 1];
      }
    }
  });
};

exports.directives = {};

exports.methods = {
    async checkParams(e) {
      let t = r.getAbsoluteBuildPath(this.local.buildPath);
      if (Editor.isWin32 && t.length > 58) {
        o.showErrorBox(
          Editor.T("BUILDER.error.path_too_long_title"),
          Editor.T("BUILDER.error.path_too_long_desc", { max_length: 58 })
        );

        return false;
      }
      let i = this._getAPILevel(this.local.apiLevel);
      if ("binary" === this.local.template && i < 22) {
        o.showErrorBox(
          Editor.T("BUILDER.error.build_error"),
          Editor.T("BUILDER.error.binary_api_level")
        );

        return false;
      }
      let a = this.packageName;
      if (!/^[a-zA-Z0-9_.]*$/.test(a)) {
        o.showErrorBox(
          Editor.T("BUILDER.error.build_error"),
          Editor.T("BUILDER.error.package_name_not_legal")
        );

        return false;
      }
      let n = a.split(".");
      for (let e = 0; e < n.length; e++) {
        if (!isNaN(n[e][0])) {
          o.showErrorBox(
            Editor.T("BUILDER.error.build_error"),
            Editor.T("BUILDER.error.package_name_start_with_number")
          );

          return false;
        }
      }
      if (e.appABIs.find((e) => {
        if ("arm64-v8a" === e) {
          return e;
        }
      }) &&
      parseInt(e.apiLevel.split("-")[1]) < 21) {
        o.showErrorBox(
          Editor.T("BUILDER.error.build_error"),
          Editor.T("BUILDER.error.arm64_not_support", {
            current_api: e.apiLevel,
            min_version: 21,
          })
        );

        return false;
      }
      if (i < 26) {
        let e = Editor.Profile.load("project://project.json").get("facebook");
        if (e && e.enable) {
          o.showErrorBox(
            Editor.T("BUILDER.error.build_error"),
            Editor.T("BUILDER.error.facebook_min_compile_version", {
              version: 26,
            })
          );

          return false;
        }
      }
      return true;
    },
    _getAPILevel(e) {
      let t = e.match("android-([0-9]+)$");
      let i = -1;

      if (t) {
        i = parseInt(t[1]);
      }

      return i;
    },
    _onChooseKeystoreClick(e) {
      e.stopPropagation();
      let t = Editor.Dialog.openFile({
        defaultPath: this.local.keystorePath || this.local.buildPath,
        properties: ["openFile"],
        filters: [{ name: "Keystore", extensions: ["keystore"] }],
        title: "Open Keystore",
      });

      if (t && t[0]) {
        this.local.keystorePath = t[0];
      }
    },
    _onShowKeystoreClick(i) {
      i.stopPropagation();
      if (!e.existsSync(this.local.keystorePath)) {
        Editor.warn("%s not exists!", this.local.keystorePath);
        return;
      }
      t.shell.showItemInFolder(this.local.keystorePath);
      t.shell.beep();
    },
    _onNewKeystoreClick: function (e) {
      e.stopPropagation();
      Editor.Ipc.sendToMain("keystore:open");
    },
    _abiValueChanged: function (e, t) {
      if (this.local.appABIs) {
        var i = this.local.appABIs.indexOf(e);

        if (t) {
          if (i < 0) {
            this.local.appABIs.push(e);
          }
        } else {
          if (i >= 0) {
            this.local.appABIs.splice(i, 1);
          }
        }
      }
    },
  };
