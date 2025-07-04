"use strict";
let t = Editor.Profile.load("project://qtt-runtime.json");
let e = t.getSelfData();

exports.template = `\n        <ui-prop name="${Editor.T(
  "qtt-runtime.pack_res_to_first_pack"
)}">\n             <ui-checkbox v-value="runtimeSetting.packFirstScreenRes"></ui-checkbox>\n        </ui-prop>\n        <ui-prop name="${Editor.T(
  "qtt-runtime.screen_orientation"
)}" v-show="false">\n            <ui-select class="flex-1" v-value="runtimeSetting.deviceOrientation">\n                <option value="portrait">${Editor.T(
  "qtt-runtime.vertical_screen"
)}</option>\n                <option value="landscape">${Editor.T(
  "qtt-runtime.horizontal_screen"
)}</option>\n            </ui-select>\n        </ui-prop>\n        <ui-prop name="${Editor.T(
  "qtt-runtime.out_cpk_path"
)}" v-show="false">\n            <ui-checkbox v-value="runtimeSetting.useCustomCpkPath"></ui-checkbox>\n            <ui-input v-value="runtimeSetting.outputCpkPath" class="flex-1" v-show="runtimeSetting.useCustomCpkPath"\n                 placeholder="${Editor.T(
  "qtt-runtime.out_cpk_path_hint"
)}"></ui-input>\n            <ui-button class="tiny" v-on:confirm="onCpkPath" v-show="runtimeSetting.useCustomCpkPath">···</ui-button>\n        </ui-prop>\n\n             <ui-prop name="${Editor.T(
  "qtt-runtime.package"
)}" auto-height>\n            <ui-input class="flex-1" placeholder="${Editor.T(
  "qtt-runtime.package_hint"
)}" v-value="runtimeSetting.package"></ui-input>\n        </ui-prop>\n\n        <ui-prop name="${Editor.T(
  "qtt-runtime.name"
)}" auto-height>\n            <ui-input class="flex-1" placeholder="${Editor.T(
  "qtt-runtime.name_hint"
)}" v-value="runtimeSetting.name"></ui-input>\n        </ui-prop>\n\n         <ui-prop name="${Editor.T(
  "qtt-runtime.desktop_icon"
)}">\n        <ui-input v-value="runtimeSetting.icon" class="flex-1" placeholder="${Editor.T(
  "qtt-runtime.desktop_icon_hint"
)}"></ui-input>\n        <ui-button class="tiny" v-on:confirm="onChooseIconPath">···</ui-button>\n        </ui-prop>\n\n        <ui-prop name="${Editor.T(
  "qtt-runtime.version_name"
)}" auto-height>\n            <ui-input class="flex-1" placeholder="${Editor.T(
  "qtt-runtime.version_name_hint"
)}" v-value="runtimeSetting.versionName"></ui-input>\n        </ui-prop>\n\n        <ui-prop name="${Editor.T(
  "qtt-runtime.version_number"
)}" auto-height>\n            <ui-input class="flex-1" placeholder="${Editor.T(
  "qtt-runtime.version_number_hint"
)}" v-value="runtimeSetting.versionCode"></ui-input>\n        </ui-prop>\n\n        <ui-prop name="${Editor.T(
  "qtt-runtime.use_native_renderer"
)}" v-show="false">\n            <ui-checkbox v-value="project.nativeRenderer"></ui-checkbox>\n        </ui-prop>\n\n        <ui-prop name="${Editor.T(
  "qtt-runtime.small_packet_path"
)}" auto-height>\n            <ui-input class="flex-1" v-value="runtimeSetting.tinyPackageServer" placeholder="${Editor.T(
  "qtt-runtime.small_packet_path_hint"
)}"></ui-input>\n        </ui-prop>\n\n        <ui-prop name="${Editor.T(
  "qtt-runtime.worker_path"
)}" auto-height  v-show="false">\n            <ui-checkbox v-value="project.nativeRenderer"></ui-checkbox>\n            <ui-input\n                 class = "flex-1"\n                 v-value = "runtimeSetting.workerPath"\n                 placeholder = "${Editor.T(
  "qtt-runtime.worker_path_hint"
)}"\n            ></ui-input>\n        </ui-prop>\n\n`;

exports.name = "qtt-game";

exports.data = function () {
    return { runtimeSetting: e, originEncryptJs: false, profile: null };
  };

exports.watch = {
    runtimeSetting: {
      handler(e) {
        Object.keys(this.runtimeSetting).forEach((e) => {
          t.set(e, this.runtimeSetting[e]);
        });

        t.save();
      },
      deep: true,
    },
  };

exports.created = function () {
  this.originEncryptJs = this.project.encryptJs;
  this.includeSDKBox = this.project.includeSDKBox;
  this.project.encryptJs = false;
  this.project.includeSDKBox = false;
};

exports.directives = {};

exports.beforeDestroy = function () {
  this.project.encryptJs = this.originEncryptJs;
  this.project.includeSDKBox = this.includeSDKBox;
};

exports.methods = {
    _getProjectPath: () =>
      Editor.Project && Editor.Project.path
        ? Editor.Project.path
        : Editor.projectInfo.path,
    onChooseIconPath(t) {
      t.stopPropagation();
      let e = Editor.Dialog.openFile({
        defaultPath: require("path").join(this._getProjectPath(), "asserts"),
        properties: ["openFile"],
        filters: [
          { name: Editor.T("qtt-runtime.select_pic"), extensions: ["png"] },
        ],
      });

      if (e && e[0]) {
        this.runtimeSetting.icon = e[0];
      }
    },
    onCpkPath(t) {
      t.stopPropagation();
      let e = Editor.Dialog.openFile({
        defaultPath: this._getProjectPath(),
        properties: ["openDirectory"],
        filters: [{ name: Editor.T("qtt-runtime.out_cpk_path_hint") }],
      });

      if (e && e[0]) {
        this.runtimeSetting.outputCpkPath = e[0];
      }
    },
  };
