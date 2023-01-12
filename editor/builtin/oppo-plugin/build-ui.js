"use strict";
const t = Editor.remote.Profile.load("global://features.json");
require("electron").remote.dialog;
let e = require("path"),
  i = require("fs"),
  n = Editor.Profile.load("project://oppo-runtime.json"),
  o = n.getSelfData();
(exports.template = `\n        <ui-prop name="${Editor.T(
  "oppo-runtime.pack_res_to_first_pack"
)}">\n             <ui-checkbox v-value="runtimeSetting.packFirstScreenRes"></ui-checkbox>\n        </ui-prop>\n        <ui-prop name="${Editor.T(
  "oppo-runtime.package"
)}" auto-height>\n            <ui-input class="flex-1" placeholder="${Editor.T(
  "oppo-runtime.package_hint"
)}" v-value="runtimeSetting.package"></ui-input>\n        </ui-prop>\n\n        <ui-prop name="${Editor.T(
  "oppo-runtime.name"
)}" auto-height>\n            <ui-input class="flex-1" placeholder="${Editor.T(
  "oppo-runtime.name_hint"
)}" v-value="runtimeSetting.name"></ui-input>\n        </ui-prop>\n\n         <ui-prop name="${Editor.T(
  "oppo-runtime.desktop_icon"
)}">\n        <ui-input v-value="runtimeSetting.icon" class="flex-1" placeholder="${Editor.T(
  "oppo-runtime.desktop_icon_hint"
)}"></ui-input>\n        <ui-button class="tiny" v-on:confirm="onChooseIconPath">···</ui-button>\n        </ui-prop>\n\n        <ui-prop name="${Editor.T(
  "oppo-runtime.version_name"
)}" auto-height>\n            <ui-input class="flex-1" placeholder="${Editor.T(
  "oppo-runtime.version_name_hint"
)}" v-value="runtimeSetting.versionName"></ui-input>\n        </ui-prop>\n\n        <ui-prop name="${Editor.T(
  "oppo-runtime.version_number"
)}" auto-height>\n            <ui-input class="flex-1" placeholder="${Editor.T(
  "oppo-runtime.version_number_hint"
)}" v-value="runtimeSetting.versionCode"></ui-input>\n        </ui-prop>\n\n        <ui-prop name="${Editor.T(
  "oppo-runtime.support_min_platform"
)}" auto-height>\n            <ui-input class="flex-1" placeholder="${Editor.T(
  "oppo-runtime.support_min_platform_hint"
)}" v-value="runtimeSetting.minPlatformVersion"></ui-input>\n        </ui-prop>\n\n        <ui-prop name="${Editor.T(
  "oppo-runtime.screen_orientation"
)}">\n            <ui-select class="flex-1" v-value="runtimeSetting.deviceOrientation">\n                <option value="portrait">${Editor.T(
  "oppo-runtime.vertical_screen"
)}</option>\n                <option value="landscape">${Editor.T(
  "oppo-runtime.horizontal_screen"
)}</option>\n            </ui-select>\n        </ui-prop>\n\n       <ui-prop name="${Editor.T(
  "oppo-runtime.small_packet_path"
)}" auto-height>\n            <ui-input class="flex-1" v-value="runtimeSetting.tinyPackageServer" placeholder="${Editor.T(
  "oppo-runtime.small_packet_path_hint"
)}"></ui-input>\n       </ui-prop>\n\n        <ui-prop name="${Editor.T(
  "oppo-runtime.keystore"
)}" auto-height>\n           <ui-checkbox v-value="runtimeSetting.useDebugKey" v-on:confirm="onChangeMode">${Editor.T(
  "oppo-runtime.use_debug_keystore"
)}</ui-checkbox>\n        </ui-prop>\n        <ui-prop name="${Editor.T(
  "oppo-runtime.certificate_pem_path"
)}" v-disabled="runtimeSetting.disabledMode" >\n        <ui-input v-value="runtimeSetting.certificatePath" class="flex-1" placeholder="${Editor.T(
  "oppo-runtime.certificate_pem_path_hint"
)}"></ui-input>\n        <ui-button class="tiny" v-on:confirm="onCertificatePath">···</ui-button>\n            <ui-button class="tiny" v-on:confirm="_onNewKeystoreClick">\n                ${Editor.T(
  "SHARED.new"
)}\n            </ui-button>\n        </ui-prop>\n        <ui-prop name="${Editor.T(
  "oppo-runtime.private_pem_path"
)}"  v-disabled="runtimeSetting.disabledMode">\n        <ui-input v-value="runtimeSetting.privatePath" class="flex-1" placeholder="${Editor.T(
  "oppo-runtime.private_pem_path_hint"
)}"></ui-input>\n        <ui-button class="tiny" v-on:confirm="onPrivatePath">···</ui-button>\n        </ui-prop>\n\n        <ui-prop name="${Editor.T(
  "oppo-runtime.custom_npm_path"
)}" v-show="runtimeSetting.showNpmPath">\n            <ui-input v-value="runtimeSetting.npmPath" class="flex-1" placeholder="${Editor.T(
  "oppo-runtime.custom_npm_path_hint"
)}"></ui-input>\n        <ui-button class="tiny" v-on:confirm="onChooseNpmPath">···</ui-button>\n        </ui-prop>\n\n          <ui-prop name="${Editor.T(
  "oppo-runtime.separate_engine"
)}"  v-if="!local.debug && showSeparateEngine()" auto-height>\n            <ui-checkbox v-value="runtimeSetting.separateEngineMode"></ui-checkbox>\n        </ui-prop>\n\n`),
  (exports.name = "quickgame"),
  (exports.data = function () {
    return { runtimeSetting: o, originEncryptJs: !1, profile: null };
  }),
  (exports.watch = {
    runtimeSetting: {
      handler(t) {
        Object.keys(this.runtimeSetting).forEach((t) => {
          n.set(t, this.runtimeSetting[t]);
        }),
          n.save();
      },
      deep: !0,
    },
  });
const r = require(Editor.url("packages://builder/utils/event"));
(exports.created = function () {
  (this.originEncryptJs = this.project.encryptJs),
    (this.includeSDKBox = this.project.includeSDKBox),
    (this.project.encryptJs = !1),
    (this.project.includeSDKBox = !1),
    r.on("certificate-created", this._onCertificateCreated),
    r.on("npmPath-show", this._onNpmPathShow);
}),
  (exports.directives = {}),
  (exports.beforeDestroy = function () {
    r.removeListener("certificate-created", this._onCertificateCreated),
      r.removeListener("npmPath-show", this._onNpmPathShow),
      (this.project.encryptJs = this.originEncryptJs),
      (this.project.includeSDKBox = this.includeSDKBox);
  }),
  (exports.methods = {
    _getProjectPath: () =>
      Editor.Project && Editor.Project.path
        ? Editor.Project.path
        : Editor.projectInfo.path,
    _onCertificateCreated(...t) {
      if ((console.log("parsms ", ...t), !t || -1 === t)) return;
      let n = t[0],
        o = e.join(n, "certificate.pem");
      i.existsSync(o) && (this.runtimeSetting.certificatePath = o);
      let r = e.join(n, "private.pem");
      i.existsSync(r) && (this.runtimeSetting.privatePath = r);
    },
    _onNpmPathShow(...t) {
      this.runtimeSetting.showNpmPath = !0;
    },
    _onNewKeystoreClick() {
      Editor.Panel.open("oppo-runtime");
    },
    onChangeMode() {
      this.runtimeSetting.useDebugKey
        ? (this.runtimeSetting.disabledMode = "disabled is-disabled")
        : (this.runtimeSetting.disabledMode = "");
    },
    onChooseIconPath(t) {
      t.stopPropagation();
      let e = Editor.Dialog.openFile({
        defaultPath: require("path").join(this._getProjectPath(), "asserts"),
        properties: ["openFile"],
        filters: [
          { name: Editor.T("oppo-runtime.select_pic"), extensions: ["png"] },
        ],
      });
      e && e[0] && (this.runtimeSetting.icon = e[0]);
    },
    onChooseNpmPath(t) {
      t.stopPropagation();
      let e = Editor.Dialog.openFile({
        defaultPath: require("path").join(this._getProjectPath(), "asserts"),
        properties: ["openDirectory"],
      });
      e && e[0] && (this.runtimeSetting.npmPath = e[0]);
    },
    onCertificatePath(t) {
      t.stopPropagation();
      let n = Editor.Dialog.openFile({
        defaultPath: this._getProjectPath(),
        properties: ["openFile"],
        filters: [
          {
            name: Editor.T("oppo-runtime.certificate_pem_path_hint"),
            extensions: ["pem"],
          },
        ],
      });
      if (n && n[0]) {
        this.runtimeSetting.certificatePath = n[0];
        var o = e.join(e.dirname(n[0]), "private.pem");
        ("" !== this.runtimeSetting.privatePath &&
          i.existsSync(this.runtimeSetting.privatePath)) ||
          !i.existsSync(o) ||
          (this.runtimeSetting.privatePath = o);
      }
    },
    onPrivatePath(t) {
      t.stopPropagation();
      let n = Editor.Dialog.openFile({
        defaultPath: this._getProjectPath(),
        properties: ["openFile"],
        filters: [
          {
            name: Editor.T("oppo-runtime.private_pem_path_hint"),
            extensions: ["pem"],
          },
        ],
      });
      if (n && n[0]) {
        this.runtimeSetting.privatePath = n[0];
        var o = e.join(e.dirname(n[0]), "certificate.pem");
        ("" !== this.runtimeSetting.certificatePath &&
          i.existsSync(this.runtimeSetting.certificatePath)) ||
          !i.existsSync(o) ||
          (this.runtimeSetting.certificatePath = o);
      }
    },
    showSeparateEngine: () => (t && t.get("quickgame-separation-engine")) || !1,
  });
