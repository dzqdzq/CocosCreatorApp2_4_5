"use strict";
let e = require("path");
let t = require("fs");
let i = Editor.Profile.load("project://huawei-runtime.json");
let n = i.getSelfData();

exports.template = `\n        <ui-prop name="${Editor.T(
  "huawei-runtime.pack_res_to_first_pack"
)}" >\n             <ui-checkbox v-value="runtimeSetting.packFirstScreenRes"></ui-checkbox>\n        </ui-prop>\n        <ui-prop name="${Editor.T(
  "huawei-runtime.package"
)}" auto-height>\n            <ui-input class="flex-1" placeholder="${Editor.T(
  "huawei-runtime.package_hint"
)}" v-value="runtimeSetting.package"></ui-input>\n        </ui-prop>\n        <ui-prop name="${Editor.T(
  "huawei-runtime.name"
)}" auto-height>\n            <ui-input class="flex-1" placeholder="${Editor.T(
  "huawei-runtime.name_hint"
)}" v-value="runtimeSetting.name"></ui-input>\n        </ui-prop>\n        <ui-prop name="${Editor.T(
  "huawei-runtime.desktop_icon"
)}">\n        <ui-input v-value="runtimeSetting.icon" class="flex-1" placeholder="${Editor.T(
  "huawei-runtime.desktop_icon_hint"
)}"></ui-input>\n        <ui-button class="tiny" v-on:confirm="onChooseIconPath">···</ui-button>\n        </ui-prop>\n        <ui-prop name="${Editor.T(
  "huawei-runtime.version_name"
)}" auto-height>\n            <ui-input class="flex-1" placeholder="${Editor.T(
  "huawei-runtime.version_name_hint"
)}" v-value="runtimeSetting.versionName"></ui-input>\n        </ui-prop>\n        <ui-prop name="${Editor.T(
  "huawei-runtime.version_number"
)}" auto-height>\n            <ui-input class="flex-1" placeholder="${Editor.T(
  "huawei-runtime.version_number_hint"
)}" v-value="runtimeSetting.versionCode"></ui-input>\n        </ui-prop>\n        <ui-prop name="${Editor.T(
  "huawei-runtime.support_min_platform"
)}" auto-height>\n            <ui-input class="flex-1" placeholder="${Editor.T(
  "huawei-runtime.support_min_platform_hint"
)}" v-value="runtimeSetting.minPlatformVersion"></ui-input>\n        </ui-prop>\n\n        <ui-prop name="${Editor.T(
  "huawei-runtime.custom_manifest_file_path"
)}">\n        <ui-input v-value="runtimeSetting.manifestPath" class="flex-1" placeholder="${Editor.T(
  "huawei-runtime.custom_manifest_file_path_hint"
)}"></ui-input>\n        <ui-button class="tiny" v-on:confirm="onChooseMainfestPath">···</ui-button>\n        </ui-prop>\n\n\n        <ui-prop name="${Editor.T(
  "huawei-runtime.screen_orientation"
)}">\n            <ui-select class="flex-1" v-value="runtimeSetting.deviceOrientation">\n                <option value="portrait">${Editor.T(
  "huawei-runtime.vertical_screen"
)}</option>\n    <option value="landscape">${Editor.T(
  "huawei-runtime.horizontal_screen"
)}</option>\n            </ui-select>\n        </ui-prop>\n\n        <ui-prop name="${Editor.T(
  "huawei-runtime.full_screen"
)}" auto-height>\n            <ui-checkbox v-value="runtimeSetting.fullScreen"></ui-checkbox>\n        </ui-prop>\n\n        <ui-prop name="logLevel">\n            <ui-select class="flex-1" v-value="runtimeSetting.logLevel">\n                <option value="off">off</option>\n                <option value="error">error</option>\n                <option value="warn">warn</option>\n                <option value="info">info</option>\n                <option value="log">log</option>\n                <option value="debug">debug</option>\n            </ui-select>\n        </ui-prop>\n\n        <ui-prop name="${Editor.T(
  "huawei-runtime.use_native_renderer"
)}" v-show="false">\n            <ui-checkbox v-value="project.nativeRenderer"></ui-checkbox>\n        </ui-prop>\n\n       <ui-prop name="${Editor.T(
  "huawei-runtime.small_packet_path"
)}" auto-height>\n            <ui-input class="flex-1" v-value="runtimeSetting.tinyPackageServer" placeholder="${Editor.T(
  "huawei-runtime.small_packet_path_hint"
)}"></ui-input>\n       </ui-prop>\n\n       <ui-prop name="${Editor.T(
  "huawei-runtime.keystore"
)}" auto-height>\n           <ui-checkbox v-value="runtimeSetting.useDebugKey" v-on:confirm="onChangeMode">${Editor.T(
  "huawei-runtime.use_debug_keystore"
)}</ui-checkbox>\n        </ui-prop>\n\n        <ui-prop name="${Editor.T(
  "huawei-runtime.certificate_pem_path"
)}" v-disabled="runtimeSetting.disabledMode" >\n        <ui-input v-value="runtimeSetting.certificatePath" class="flex-1" placeholder="${Editor.T(
  "huawei-runtime.certificate_pem_path_hint"
)}"></ui-input>\n        <ui-button class="tiny" v-on:confirm="onCertificatePath">···</ui-button>\n         <ui-button class="tiny" v-on:confirm="_onNewKeystoreClick">\n                ${Editor.T(
  "SHARED.new"
)}\n            </ui-button>\n\n        </ui-prop>\n         <ui-prop name="${Editor.T(
  "huawei-runtime.private_pem_path"
)}"  v-disabled="runtimeSetting.disabledMode">\n        <ui-input v-value="runtimeSetting.privatePath" class="flex-1" placeholder="${Editor.T(
  "huawei-runtime.private_pem_path_hint"
)}"></ui-input>\n        <ui-button class="tiny" v-on:confirm="onPrivatePath">···</ui-button>\n          <ui-button class="tiny" v-on:confirm="_onViewFingerPrintClick">\n               ${Editor.T(
  "huawei-runtime.print_finger"
)}\n            </ui-button>\n        </ui-prop>\n\n        <ui-prop name="${Editor.T(
  "huawei-runtime.custom_npm_path"
)}" v-show="runtimeSetting.showNpmPath">\n            <ui-input v-value="runtimeSetting.npmPath" class="flex-1" placeholder="${Editor.T(
  "huawei-runtime.custom_npm_path_hint"
)}"></ui-input>\n        <ui-button class="tiny" v-on:confirm="onChooseNpmPath">···</ui-button>\n        </ui-prop>\n`;

exports.name = "huawei";

exports.data = function () {
    return { runtimeSetting: n, originEncryptJs: false, profile: null };
  };

exports.watch = {
    runtimeSetting: {
      handler(e) {
        Object.keys(this.runtimeSetting).forEach((e) => {
          i.set(e, this.runtimeSetting[e]);
        });

        i.save();
      },
      deep: true,
    },
  };

const r = require(Editor.url("packages://builder/utils/event"));

exports.created = function () {
  this.originEncryptJs = this.project.encryptJs;
  this.includeSDKBox = this.project.includeSDKBox;
  this.project.encryptJs = false;
  this.project.includeSDKBox = false;
  r.on("certificate-created", this._onCertificateCreated);
  r.on("npmPath-show", this._onNpmPathShow);
};

exports.directives = {};

exports.beforeDestroy = function () {
  r.removeListener("certificate-created", this._onCertificateCreated);
  r.removeListener("npmPath-show", this._onNpmPathShow);
  this.project.encryptJs = this.originEncryptJs;
  this.project.includeSDKBox = this.includeSDKBox;
};

exports.methods = {
    _getProjectPath: () => Editor.Project.path,
    _onCertificateCreated(...i) {
      console.log("parsms ", ...i);
      if (!i || -1 === i) {
        return;
      }
      let n = i[0];
      let r = e.join(n, "certificate.pem");

      if (t.existsSync(r)) {
        this.runtimeSetting.certificatePath = r;
      }

      let o = e.join(n, "private.pem");

      if (t.existsSync(o)) {
        this.runtimeSetting.privatePath = o;
      }
    },
    _onNpmPathShow(...e) {
      this.runtimeSetting.showNpmPath = true;
    },
    _onNewKeystoreClick() {
      Editor.Panel.open("huawei-runtime");
    },
    _onViewFingerPrintClick(e) {
      if (!this.runtimeSetting.certificatePath) {
        Editor.error(
          new Error(Editor.T("huawei-runtime.select_certificate_path"))
        );

        return;
      }
      var t = {};

      if (this.runtimeSetting.npmPath) {
        t.Path = this.runtimeSetting.npmPath;
      } else {
        require("fix-path")();
        t = process.env;
      }

      let i = this;
      this._isInstallNodejs(t, function () {
        i._printFinger(t);
      });
    },
    _isInstallNodejs(e, t) {
      (0, require("child_process").exec)("node -v", { env: e }, (e) =>
        e
          ? this.runtimeSetting.npmPath
            ? (Editor.error(
                new Error(
                  Editor.T("huawei-runtime.custom_npm_path_config_error")
                )
              ),
              void 0)
            : "win32" === process.platform
            ? (Editor.error(
                new Error(
                  Editor.T("huawei-runtime.window_default_npm_path_error")
                )
              ),
              void 0)
            : (Editor.error(
                new Error(Editor.T("huawei-runtime.mac_default_npm_path_error"))
              ),
              void 0)
          : (t && t(), void 0)
      );
    },
    _printFinger(e) {
      let t = require("child_process").exec;

      var i = Editor.url(
          "packages://runtime-adapters/package/print-cert-fp.js"
        );

      var n = Editor.url("packages://runtime-adapters/package");
      t(
        `node ${i}  ${this.runtimeSetting.certificatePath}`,
        { env: e, cwd: n },
        (e, t) => {
          if (!e) {
            return t
              ? (Editor.log(
                  Editor.T("huawei-runtime.certificate_fingerprint"),
                  t
                ),
                void 0)
              : (Editor.error(
                  new Error(
                    Editor.T(
                      "huawei-runtime.select_certificate_path_after_view_certificate"
                    )
                  )
                ),
                void 0);
          }

          if ("win32" === process.platform) {
            Editor.log(
                  new Error(
                    Editor.T(
                      "huawei-runtime.certificate_fingerprint_window_error"
                    ) + e
                  )
                );
          } else {
            Editor.log(
                  new Error(
                    Editor.T("huawei-runtime.certificate_fingerprint_mac_error") +
                      e
                  )
                );
          }
        }
      );
    },
    onChangeMode() {
      if (this.runtimeSetting.useDebugKey) {
        this.runtimeSetting.disabledMode = "disabled is-disabled";
      } else {
        this.runtimeSetting.disabledMode = "";
      }
    },
    onChooseIconPath(e) {
      e.stopPropagation();
      let t = Editor.Dialog.openFile({
        defaultPath: this._getProjectPath() + "/asserts",
        properties: ["openFile"],
        filters: [
          {
            name: Editor.T("huawei-runtime.choose_image"),
            extensions: ["png"],
          },
        ],
      });

      if (t && t[0]) {
        this.runtimeSetting.icon = t[0];
      }
    },
    onChooseNpmPath(e) {
      e.stopPropagation();
      let t = Editor.Dialog.openFile({
        defaultPath: require("path").join(this._getProjectPath(), "asserts"),
        properties: ["openDirectory"],
      });

      if (t && t[0]) {
        this.runtimeSetting.npmPath = t[0];
      }
    },
    onChooseMainfestPath(e) {
      e.stopPropagation();
      let t = Editor.Dialog.openFile({
        defaultPath: this._getProjectPath() + "/asserts",
        properties: ["openFile"],
        filters: [
          {
            name: Editor.T("huawei-runtime.choose_json_file"),
            extensions: ["json"],
          },
        ],
      });

      if (t && t[0]) {
        this.runtimeSetting.manifestPath = t[0];
      }
    },
    onCertificatePath(i) {
      i.stopPropagation();
      let n = Editor.Dialog.openFile({
        defaultPath: this._getProjectPath(),
        properties: ["openFile"],
        filters: [
          {
            name: Editor.T("huawei-runtime.certificate_pem_path_hint"),
            extensions: ["pem"],
          },
        ],
      });
      if (n && n[0]) {
        this.runtimeSetting.certificatePath = n[0];
        var r = e.join(e.dirname(n[0]), "private.pem");

        if (!(("" !== this.runtimeSetting.privatePath && t.existsSync(this.runtimeSetting.privatePath)) || !t.existsSync(r))) {
          this.runtimeSetting.privatePath = r;
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
            name: Editor.T("huawei-runtime.private_pem_path_hint"),
            extensions: ["pem"],
          },
        ],
      });
      if (n && n[0]) {
        this.runtimeSetting.privatePath = n[0];
        var r = e.join(e.dirname(n[0]), "certificate.pem");

        if (!(("" !== this.runtimeSetting.certificatePath && t.existsSync(this.runtimeSetting.certificatePath)) || !t.existsSync(r))) {
          this.runtimeSetting.certificatePath = r;
        }
      }
    },
  };
