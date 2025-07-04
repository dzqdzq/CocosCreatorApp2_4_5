"use strict";
let t = require("path");
let e = require("fs");
let i = Editor.Profile.load("project://vivo-runtime.json");
let n = i.getSelfData();

exports.template = `\n        <ui-prop name="${Editor.T(
  "vivo-runtime.pack_res_to_first_pack"
)}" >\n             <ui-checkbox v-value="runtimeSetting.packFirstScreenRes"></ui-checkbox>\n        </ui-prop>\n        <ui-prop name="${Editor.T(
  "vivo-runtime.package"
)}" auto-height>\n            <ui-input class="flex-1" placeholder="${Editor.T(
  "vivo-runtime.package_hint"
)}" v-value="runtimeSetting.package"></ui-input>\n        </ui-prop>\n\n        <ui-prop name="${Editor.T(
  "vivo-runtime.name"
)}" auto-height>\n            <ui-input class="flex-1" placeholder="${Editor.T(
  "vivo-runtime.name_hint"
)}" v-value="runtimeSetting.name"></ui-input>\n        </ui-prop>\n\n        <ui-prop name="${Editor.T(
  "vivo-runtime.desktop_icon"
)}">\n            <ui-input v-value="runtimeSetting.icon" class="flex-1" placeholder="${Editor.T(
  "vivo-runtime.desktop_icon_hint"
)}"></ui-input>\n        <ui-button class="tiny" v-on:confirm="onChooseIconPath">···</ui-button>\n        </ui-prop>\n\n        <ui-prop name="${Editor.T(
  "vivo-runtime.version_name"
)}" auto-height>\n            <ui-input class="flex-1" placeholder="${Editor.T(
  "vivo-runtime.version_name_hint"
)}" v-value="runtimeSetting.versionName"></ui-input>\n        </ui-prop>\n\n        <ui-prop name="${Editor.T(
  "vivo-runtime.version_number"
)}" auto-height>\n            <ui-input class="flex-1" placeholder="${Editor.T(
  "vivo-runtime.version_number_hint"
)}" v-value="runtimeSetting.versionCode"></ui-input>\n        </ui-prop>\n\n        <ui-prop name="${Editor.T(
  "vivo-runtime.support_min_platform"
)}" auto-height>\n            <ui-input class="flex-1" placeholder="${Editor.T(
  "vivo-runtime.support_min_platform_hint"
)}" v-value="runtimeSetting.minPlatformVersion"></ui-input>\n        </ui-prop>\n\n        <ui-prop name="${Editor.T(
  "vivo-runtime.screen_orientation"
)}">\n            <ui-select class="flex-1" v-value="runtimeSetting.deviceOrientation">\n                <option value="portrait">${Editor.T(
  "vivo-runtime.vertical_screen"
)}</option>\n                <option value="landscape">${Editor.T(
  "vivo-runtime.horizontal_screen"
)}</option>\n            </ui-select>\n        </ui-prop>\n\n        <ui-prop name="${Editor.T(
  "vivo-runtime.log_level"
)}">\n            <ui-select class="flex-1" v-value="runtimeSetting.logLevel">\n                <option value="log">log</option>\n                <option value="off">off</option>\n                <option value="error">error</option>\n                <option value="warn">warn</option>\n                <option value="info">info</option>\n                <option value="debug">debug</option>\n            </ui-select>\n        </ui-prop>\n\n        <ui-prop name="${Editor.T(
  "vivo-runtime.small_packet_path"
)}" auto-height>\n            <ui-input class="flex-1" v-value="runtimeSetting.tinyPackageServer" placeholder="${Editor.T(
  "vivo-runtime.small_packet_path_hint"
)}"></ui-input>\n        </ui-prop>\n\n         <ui-prop name="${Editor.T(
  "vivo-runtime.keystore"
)}" auto-height>\n           <ui-checkbox v-value="runtimeSetting.useDebugKey" v-on:confirm="onChangeMode">${Editor.T(
  "vivo-runtime.use_debug_keystore"
)}</ui-checkbox>\n        </ui-prop>\n        <ui-prop name="${Editor.T(
  "vivo-runtime.certificate_pem_path"
)}" v-disabled="runtimeSetting.disabledMode" >\n        <ui-input v-value="runtimeSetting.certificatePath" class="flex-1" placeholder="${Editor.T(
  "vivo-runtime.certificate_pem_path_hint"
)}"></ui-input>\n        <ui-button class="tiny" v-on:confirm="onCertificatePath">···</ui-button>\n         <ui-button class="tiny" v-on:confirm="_onNewKeystoreClick">\n                ${Editor.T(
  "SHARED.new"
)}\n            </ui-button>\n        </ui-prop>\n         <ui-prop name="${Editor.T(
  "vivo-runtime.private_pem_path"
)}"  v-disabled="runtimeSetting.disabledMode">\n        <ui-input v-value="runtimeSetting.privatePath" class="flex-1" placeholder="${Editor.T(
  "vivo-runtime.private_pem_path_hint"
)}"></ui-input>\n        <ui-button class="tiny" v-on:confirm="onPrivatePath">···</ui-button>\n        </ui-prop>\n\n        <ui-prop name="${Editor.T(
  "vivo-runtime.custom_npm_path"
)}" v-show="runtimeSetting.showNpmPath">\n            <ui-input v-value="runtimeSetting.npmPath" class="flex-1" placeholder="${Editor.T(
  "vivo-runtime.custom_npm_path_hint"
)}"></ui-input>\n        <ui-button class="tiny" v-on:confirm="onChooseNpmPath">···</ui-button>\n        </ui-prop>\n\n          <ui-prop name="${Editor.T(
  "vivo-runtime.separate_engine"
)}" auto-height>\n            <ui-checkbox v-value="runtimeSetting.separateEngineMode"></ui-checkbox>\n        </ui-prop>\n\n`;

exports.name = "qgame";

exports.data = function () {
    return { runtimeSetting: n, originEncryptJs: false, profile: null };
  };

exports.watch = {
    runtimeSetting: {
      handler(t) {
        Object.keys(this.runtimeSetting).forEach((t) => {
          i.set(t, this.runtimeSetting[t]);
        });

        i.save();
      },
      deep: true,
    },
  };

const o = require(Editor.url("packages://builder/utils/event"));

exports.created = function () {
  this.originEncryptJs = this.project.encryptJs;
  this.includeSDKBox = this.project.includeSDKBox;
  this.project.includeSDKBox = false;
  this.project.encryptJs = false;
  o.on("certificate-created", this._onCertificateCreated);
  o.on("npmPath-show", this._onNpmPathShow);
};

exports.directives = {};

exports.beforeDestroy = function () {
  o.removeListener("certificate-created", this._onCertificateCreated);
  o.removeListener("npmPath-show", this._onNpmPathShow);
  this.project.encryptJs = this.originEncryptJs;
  this.project.includeSDKBox = this.includeSDKBox;
};

exports.methods = {
    _getProjectPath: () =>
      Editor.Project && Editor.Project.path
        ? Editor.Project.path
        : Editor.projectInfo.path,
    _onCertificateCreated(...i) {
      console.log("parsms ", ...i);
      if (!i || -1 === i) {
        return;
      }
      let n = i[0];
      let o = t.join(n, "certificate.pem");

      if (e.existsSync(o)) {
        this.runtimeSetting.certificatePath = o;
      }

      let r = t.join(n, "private.pem");

      if (e.existsSync(r)) {
        this.runtimeSetting.privatePath = r;
      }
    },
    _onNpmPathShow(...t) {
      this.runtimeSetting.showNpmPath = true;
    },
    _onNewKeystoreClick() {
      Editor.Panel.open("vivo-runtime");
    },
    onChangeMode() {
      if (this.runtimeSetting.useDebugKey) {
        this.runtimeSetting.disabledMode = "disabled is-disabled";
      } else {
        this.runtimeSetting.disabledMode = "";
      }
    },
    onChooseIconPath(t) {
      t.stopPropagation();
      let e = Editor.Dialog.openFile({
        defaultPath: require("path").join(this._getProjectPath(), "asserts"),
        properties: ["openFile"],
        filters: [
          { name: Editor.T("vivo-runtime.select_pic"), extensions: ["png"] },
        ],
      });

      if (e && e[0]) {
        this.runtimeSetting.icon = e[0];
      }
    },
    onChooseNpmPath(t) {
      t.stopPropagation();
      let e = Editor.Dialog.openFile({
        defaultPath: require("path").join(this._getProjectPath(), "asserts"),
        properties: ["openDirectory"],
      });

      if (e && e[0]) {
        this.runtimeSetting.npmPath = e[0];
      }
    },
    onCertificatePath(i) {
      i.stopPropagation();
      let n = Editor.Dialog.openFile({
        defaultPath: this._getProjectPath(),
        properties: ["openFile"],
        filters: [
          {
            name: Editor.T("vivo-runtime.select_certificate_pem_path"),
            extensions: ["pem"],
          },
        ],
      });
      if (n && n[0]) {
        this.runtimeSetting.certificatePath = n[0];
        var o = t.join(t.dirname(n[0]), "private.pem");

        if (!(("" !== this.runtimeSetting.privatePath && e.existsSync(this.runtimeSetting.privatePath)) || !e.existsSync(o))) {
          this.runtimeSetting.privatePath = o;
        }
      }
    },
    onPrivatePath(i) {
      i.stopPropagation();
      let n = Editor.Dialog.openFile({
        defaultPath: this._getProjectPath(),
        properties: ["openFile"],
        filters: [
          {
            name: Editor.T("vivo-runtime.select_private_pem_path"),
            extensions: ["pem"],
          },
        ],
      });
      if (n && n[0]) {
        this.runtimeSetting.privatePath = n[0];
        var o = t.join(t.dirname(n[0]), "certificate.pem");

        if (!(("" !== this.runtimeSetting.certificatePath && e.existsSync(this.runtimeSetting.certificatePath)) || !e.existsSync(o))) {
          this.runtimeSetting.certificatePath = o;
        }
      }
    },
  };
