"use strict";
let t = require("path");
let i = require("fs");
let e = Editor.Profile.load("project://xiaomi-runtime.json");
let n = e.getSelfData();

exports.template = `\n        <ui-prop name="${Editor.T(
  "BUILDER.start_scene_asset_bundle"
)}"\n            tooltip="${Editor.T(
  "BUILDER.start_scene_asset_bundle_tooltip"
)}"\n        >\n            <ui-checkbox v-value="runtimeSetting.startSceneAssetBundle"></ui-checkbox>\n        </ui-prop>\n\n        <ui-prop name="${Editor.T(
  "xiaomi-runtime.package"
)}" auto-height>\n            <ui-input class="flex-1" placeholder="${Editor.T(
  "xiaomi-runtime.package_hint"
)}" v-value="runtimeSetting.package"></ui-input>\n        </ui-prop>\n\n        <ui-prop name="${Editor.T(
  "xiaomi-runtime.name"
)}" auto-height>\n            <ui-input class="flex-1" placeholder="${Editor.T(
  "xiaomi-runtime.name_hint"
)}" v-value="runtimeSetting.name"></ui-input>\n        </ui-prop>\n\n        <ui-prop name="${Editor.T(
  "xiaomi-runtime.desktop_icon"
)}">\n            <ui-input v-value="runtimeSetting.icon" class="flex-1" placeholder="${Editor.T(
  "xiaomi-runtime.desktop_icon_hint"
)}"></ui-input>\n        <ui-button class="tiny" v-on:confirm="onChooseIconPath">···</ui-button>\n        </ui-prop>\n\n        <ui-prop name="${Editor.T(
  "xiaomi-runtime.version_name"
)}" auto-height>\n            <ui-input class="flex-1" placeholder="${Editor.T(
  "xiaomi-runtime.version_name_hint"
)}" v-value="runtimeSetting.versionName"></ui-input>\n        </ui-prop>\n\n        <ui-prop name="${Editor.T(
  "xiaomi-runtime.version_number"
)}" auto-height>\n            <ui-input class="flex-1" placeholder="${Editor.T(
  "xiaomi-runtime.version_number_hint"
)}" v-value="runtimeSetting.versionCode"></ui-input>\n        </ui-prop>\n\n        <ui-prop name="${Editor.T(
  "xiaomi-runtime.support_min_platform"
)}" auto-height>\n            <ui-input class="flex-1" placeholder="${Editor.T(
  "xiaomi-runtime.support_min_platform_hint"
)}" v-value="runtimeSetting.minPlatformVersion"></ui-input>\n        </ui-prop>\n\n        <ui-prop name="${Editor.T(
  "xiaomi-runtime.screen_orientation"
)}">\n            <ui-select class="flex-1" v-value="runtimeSetting.deviceOrientation">\n                <option value="portrait">${Editor.T(
  "xiaomi-runtime.vertical_screen"
)}</option>\n                <option value="landscape">${Editor.T(
  "xiaomi-runtime.horizontal_screen"
)}</option>\n            </ui-select>\n        </ui-prop>\n\n        <ui-prop name="${Editor.T(
  "xiaomi-runtime.log_level"
)}">\n            <ui-select class="flex-1" v-value="runtimeSetting.logLevel">\n                <option value="log">log</option>\n                <option value="off">off</option>\n                <option value="error">error</option>\n                <option value="warn">warn</option>\n                <option value="info">info</option>\n                <option value="debug">debug</option>\n            </ui-select>\n        </ui-prop>\n\n        <ui-prop name="${Editor.T(
  "xiaomi-runtime.small_packet_path"
)}" auto-height>\n            <ui-input class="flex-1" v-value="runtimeSetting.tinyPackageServer" placeholder="${Editor.T(
  "xiaomi-runtime.small_packet_path_hint"
)}"></ui-input>\n        </ui-prop>\n\n         <ui-prop name="${Editor.T(
  "xiaomi-runtime.keystore"
)}" auto-height>\n           <ui-checkbox v-value="runtimeSetting.useDebugKey" v-on:confirm="onChangeMode">${Editor.T(
  "xiaomi-runtime.use_debug_keystore"
)}</ui-checkbox>\n        </ui-prop>\n        <ui-prop name="${Editor.T(
  "xiaomi-runtime.certificate_pem_path"
)}" v-disabled="runtimeSetting.disabledMode" >\n        <ui-input v-value="runtimeSetting.certificatePath" class="flex-1" placeholder="${Editor.T(
  "xiaomi-runtime.certificate_pem_path_hint"
)}"></ui-input>\n        <ui-button class="tiny" v-on:confirm="onCertificatePath">···</ui-button>\n         <ui-button class="tiny" v-on:confirm="_onNewKeystoreClick">\n                ${Editor.T(
  "SHARED.new"
)}\n            </ui-button>\n        </ui-prop>\n         <ui-prop name="${Editor.T(
  "xiaomi-runtime.private_pem_path"
)}"  v-disabled="runtimeSetting.disabledMode">\n        <ui-input v-value="runtimeSetting.privatePath" class="flex-1" placeholder="${Editor.T(
  "xiaomi-runtime.private_pem_path_hint"
)}"></ui-input>\n        <ui-button class="tiny" v-on:confirm="onPrivatePath">···</ui-button>\n        </ui-prop>\n`;

exports.name = "xiaomi";

exports.data = function () {
    return { runtimeSetting: n, originEncryptJs: false };
  };

exports.watch = {
    runtimeSetting: {
      handler(t) {
        Object.keys(this.runtimeSetting).forEach((t) => {
          e.set(t, this.runtimeSetting[t]);
        });

        e.save();
      },
      deep: true,
    },
  };

const o = require(Editor.url("packages://builder/utils/event"));

exports.created = function () {
  this.originEncryptJs = this.project.encryptJs;
  this.project.encryptJs = false;
  o.on("certificate-created", this._onCertificateCreated);
};

exports.directives = {};

exports.beforeDestroy = function () {
  o.removeListener("certificate-created", this._onCertificateCreated);
  this.project.encryptJs = this.originEncryptJs;
};

exports.methods = {
    _getProjectPath: () =>
      Editor.Project && Editor.Project.path
        ? Editor.Project.path
        : Editor.projectInfo.path,
    _onCertificateCreated(...e) {
      console.log("parsms ", ...e);
      if (!e || -1 === e) {
        return;
      }
      let n = e[0];
      let o = t.join(n, "certificate.pem");

      if (i.existsSync(o)) {
        this.runtimeSetting.certificatePath = o;
      }

      let r = t.join(n, "private.pem");

      if (i.existsSync(r)) {
        this.runtimeSetting.privatePath = r;
      }
    },
    _onNewKeystoreClick() {
      Editor.Panel.open("xiaomi-runtime");
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
      let i = Editor.Dialog.openFile({
        defaultPath: require("path").join(this._getProjectPath(), "asserts"),
        properties: ["openFile"],
        filters: [
          { name: Editor.T("xiaomi-runtime.select_pic"), extensions: ["png"] },
        ],
      });

      if (i && i[0]) {
        this.runtimeSetting.icon = i[0];
      }
    },
    onCertificatePath(e) {
      e.stopPropagation();
      let n = Editor.Dialog.openFile({
        defaultPath: this._getProjectPath(),
        properties: ["openFile"],
        filters: [
          {
            name: Editor.T("xiaomi-runtime.select_certificate_pem_path"),
            extensions: ["pem"],
          },
        ],
      });
      if (n && n[0]) {
        this.runtimeSetting.certificatePath = n[0];
        var o = t.join(t.dirname(n[0]), "private.pem");

        if (!(("" !== this.runtimeSetting.privatePath && i.existsSync(this.runtimeSetting.privatePath)) || !i.existsSync(o))) {
          this.runtimeSetting.privatePath = o;
        }
      }
    },
    onPrivatePath(e) {
      e.stopPropagation();
      let n = Editor.Dialog.openFile({
        defaultPath: this._getProjectPath(),
        properties: ["openFile"],
        filters: [
          {
            name: Editor.T("xiaomi-runtime.select_private_pem_path"),
            extensions: ["pem"],
          },
        ],
      });
      if (n && n[0]) {
        this.runtimeSetting.privatePath = n[0];
        var o = t.join(t.dirname(n[0]), "certificate.pem");

        if (!(("" !== this.runtimeSetting.certificatePath && i.existsSync(this.runtimeSetting.certificatePath)) || !i.existsSync(o))) {
          this.runtimeSetting.certificatePath = o;
        }
      }
    },
  };
