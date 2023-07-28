"use strict";
const e = require("fs");
const t = require("fire-path");
const i = require("url");
const o = require("electron");
const r = require(Editor.url("packages://builder/panel/platform/common"));
const a = require("electron").remote.dialog;
require(Editor.url("app://editor/share/build-utils"));

exports.template = `\n    <ui-prop name="${Editor.T(
  "BUILDER.template"
)}">\n        <ui-select class="flex-1" v-value="local.template">\n            <template v-for="item in templates">\n                <option v-bind:value="item">{{item}}</option>\n            </template>\n        </ui-select>\n    </ui-prop>\n    \n    <ui-prop name="${Editor.T(
  "BUILDER.package_name"
)}">\n        <ui-input class="flex-1" v-value="packageName"></ui-input>\n    </ui-prop>\n    \n    <ui-prop name="${Editor.T(
  "BUILDER.remote_server"
)}" tooltip="${Editor.T(
  "BUILDER.instant_remote_server_tooltip"
)}">\n        <ui-input class="flex-1" v-value="project['android-instant'].REMOTE_SERVER_ROOT" placeholder="${Editor.T(
  "BUILDER.optional_input_tips"
)}"></ui-input>\n    </ui-prop>\n    \n    <ui-prop name="${Editor.T(
  "BUILDER.default_url"
)}">\n        <ui-input class="flex-1" v-value="default_url" placeholder="${Editor.T(
  "BUILDER.optional_input_tips"
)}"></ui-input>\n        \n    </ui-prop>\n     \n     <ui-prop name="${Editor.T(
  "BUILDER.record_path"
)}">\n        <ui-input class="flex-1" v-value="project['android-instant'].recordPath"></ui-input>\n        <ui-button class="tiny" v-on:confirm="_onChooseDistPathClick">···</ui-button>\n        <ui-button class="tiny" v-on:confirm="_onRefactorClick">${Editor.T(
  "MESSAGE.refactor.open_refactor"
)}</ui-button>\n    </ui-prop>\n\n    <ui-prop name="Target API Level">\n        <ui-select class="flex-1" v-value="local.apiLevel">\n            <template v-for="item in apiLevels">\n                <option v-bind:value="item">{{item}}</option>\n            </template>\n        </ui-select>\n    </ui-prop>\n\n    <ui-prop name="APP ABI" auto-height>\n        <div class="layout vertical">\n            <ui-checkbox class="item" v-value="armeabiV7a">\n                armeabi-v7a\n            </ui-checkbox>\n            <ui-checkbox class="item" v-value="arm64V8a">\n                arm64-v8a\n            </ui-checkbox>\n            <ui-checkbox class="item" v-value="x86">\n                x86\n            </ui-checkbox>\n            <ui-checkbox class="item" v-value="x86_64">\n                x86_64\n            </ui-checkbox>\n        </div>\n    </ui-prop>\n\n    <ui-prop name="${Editor.T(
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
  r.native.xxtea
}\n`;

const n = (exports.name = "android-instant");
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
    armeabiV7a: this.local.appABIs.indexOf("armeabi-v7a") >= 0,
    arm64V8a: this.local.appABIs.indexOf("arm64-v8a") >= 0,
    x86: this.local.appABIs.indexOf("x86") >= 0,
    x86_64: this.local.appABIs.indexOf("x86_64") >= 0,
    default_url: "",
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
    default_url: {
      handler(e) {
        let t = this.project["android-instant"];
        let o = i.parse(e);
        let r = o.protocol;
        t.scheme = r ? r.substr(0, r.length - 1) : "";
        t.host = o.host || "";
        t.pathPattern = o.pathname || "";
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
  this._load_default();
  this.originIncludeAnySDK = this.project.includeAnySDK;
  this.project.includeAnySDK = false;

  Editor.Ipc.sendToMain("app:query-cocos-templates", (e, t) => {
    if (e) {
      return Editor.warn(e);
    }

    t.forEach((e) => {
        this.templates.push(e);
      });

    if (!this.local) {
      return;
    }
    let i = this.local.template;
    if (t.length <= 0) {
      return (this.local.template = "");
    }

    if (-1 === t.indexOf(i)) {
      this.local.template = t[0];
    }
  });

  Editor.Ipc.sendToMain("app:query-android-instant-apilevels", (e, t) => {
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
        this.local.apiLevel = t[0];
      }
    }
  });
};

exports.directives = {};

exports.beforeDestroy = function () {
    this.project.includeAnySDK = this.originIncludeAnySDK;
  };

exports.methods = {
    checkParams(i) {
      let o = this.project["android-instant"].recordPath || "";
      o = o.trim();
      if (!(
        this.project["android-instant"].skipRecord ||
        (o && e.existsSync(t.join(o, "packageInfo.json")))
      )) {
        a.showErrorBox(
          Editor.T("BUILDER.error.build_error"),
          Editor.T("BUILDER.error.refactor_info_not_found")
        );

        return false;
      }
      let r = this.packageName;
      if (!/^[a-zA-Z0-9_.]*$/.test(r)) {
        a.showErrorBox(
          Editor.T("BUILDER.error.build_error"),
          Editor.T("BUILDER.error.package_name_not_legal")
        );

        return false;
      }
      let n = r.split(".");
      for (let e = 0; e < n.length; e++) {
        if (!isNaN(n[e][0])) {
          a.showErrorBox(
            Editor.T("BUILDER.error.build_error"),
            Editor.T("BUILDER.error.package_name_start_with_number")
          );

          return false;
        }
      }
      return (!(
        i.appABIs.find((e) => {
          if ("arm64-v8a" === e) {
            return e;
          }
        }) && parseInt(i.apiLevel.split("-")[1]) < 21
      ) || (a.showErrorBox(
        Editor.T("BUILDER.error.build_error"),
        Editor.T("BUILDER.error.arm64_not_support", {
          current_api: i.apiLevel,
          min_version: 21,
        })
      ), false));
    },
    _load_default() {
      process.nextTick(() => {
        let e = this.project["android-instant"];

        if (!e.recordPath) {
          e.recordPath = "";
        }

        if (!e.REMOTE_SERVER_ROOT) {
          e.REMOTE_SERVER_ROOT = `http://${Editor.remote.Network.ip}:${Editor.remote.PreviewServer.previewPort}/preview-android-instant/`;
        }

        if (!e.hasOwnProperty("host")) {
          e.host = `org.cocos2d.${this.project.title}`;
        }

        if (!e.hasOwnProperty("pathPattern")) {
          e.pathPattern = "/game";
        }

        if (!e.hasOwnProperty("scheme")) {
          e.scheme = "https";
        }

        if (e.host &&
          e.scheme &&
          e.pathPattern) {
          this.default_url = `${e.scheme}://${e.host}${e.pathPattern}`;
        }
      });
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
    _onShowKeystoreClick(t) {
      t.stopPropagation();
      if (!e.existsSync(this.local.keystorePath)) {
        Editor.warn("%s not exists!", this.local.keystorePath);
        return;
      }
      o.shell.showItemInFolder(this.local.keystorePath);
      o.shell.beep();
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
    _onRefactorClick(e) {
      if (!this.project["android-instant"].recordPath) {
        a.showErrorBox(
          Editor.T("BUILDER.error.build_error"),
          Editor.T("BUILDER.error.instant_record_empty")
        );

        return;
      }
      Editor.Panel.open("google-instant-games", {
        recordPath: this.project["android-instant"].recordPath,
      });
    },
    _onChooseDistPathClick(e) {
      e.stopPropagation();
      let i = Editor.Dialog.openFile({
        defaultPath: t.join(
          Editor.Project.path,
          "/temp/android-instant-games/profiles"
        ),
        properties: ["openDirectory"],
      });
      if (i && i[0]) {
        this.project["android-instant"].recordPath = i[0];
      }
    },
  };
