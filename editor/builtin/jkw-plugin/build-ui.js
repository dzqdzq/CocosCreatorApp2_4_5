"use strict";
let t = Editor.Profile.load("project://cpk-publish.json");
let e = t.getSelfData();

exports.template = `\n        <ui-prop name="${Editor.T(
  "cpk-publish.pack_res_to_first_pack"
)}" >\n             <ui-checkbox v-value="runtimeSetting.packFirstScreenRes"></ui-checkbox>\n        </ui-prop>\n        <ui-prop name="${Editor.T(
  "cpk-publish.screen_orientation"
)}">\n            <ui-select class="flex-1" v-value="runtimeSetting.deviceOrientation">\n                <option value="portrait">${Editor.T(
  "cpk-publish.vertical_screen"
)}</option>\n                <option value="landscape">${Editor.T(
  "cpk-publish.horizontal_screen"
)}</option>\n            </ui-select>\n        </ui-prop>\n        <ui-prop name="${Editor.T(
  "cpk-publish.out_cpk_path"
)}" >\n            <ui-checkbox v-value="runtimeSetting.useCustomCpkPath"></ui-checkbox>\n            <ui-input v-value="runtimeSetting.outputCpkPath" class="flex-1" v-show="runtimeSetting.useCustomCpkPath"\n                 placeholder="${Editor.T(
  "cpk-publish.out_cpk_path_hint"
)}"></ui-input>\n            <ui-button class="tiny" v-on:confirm="onCpkPath" v-show="runtimeSetting.useCustomCpkPath">···</ui-button>\n        </ui-prop>\n\n        <ui-prop name="${Editor.T(
  "cpk-publish.use_native_renderer"
)}" v-show="false">\n            <ui-checkbox v-value="project.nativeRenderer"></ui-checkbox>\n        </ui-prop>\n\n        <ui-prop name="${Editor.T(
  "cpk-publish.small_packet_path"
)}" auto-height>\n            <ui-input class="flex-1" v-value="runtimeSetting.tinyPackageServer" placeholder="${Editor.T(
  "cpk-publish.small_packet_path_hint"
)}"></ui-input>\n        </ui-prop>\n\n        <ui-prop name="${Editor.T(
  "cpk-publish.worker_path"
)}" auto-height  v-show="false">\n            <ui-checkbox v-value="project.nativeRenderer"></ui-checkbox>\n            <ui-input\n                 class = "flex-1"\n                 v-value = "runtimeSetting.workerPath"\n                 placeholder = "${Editor.T(
  "cpk-publish.worker_path_hint"
)}"\n            ></ui-input>\n        </ui-prop>\n\n        <ui-prop name="${Editor.T(
  "cpk-publish.separate_engine"
)}" auto-height>\n            <ui-checkbox v-value="runtimeSetting.separateEngineMode"></ui-checkbox>\n        </ui-prop>\n`;

exports.name = "jkw-game";

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
    onCpkPath(t) {
      t.stopPropagation();
      let e = require("fs-extra");
      var i = this._getProjectPath();

      if ("" !== this.runtimeSetting.outputCpkPath &&
        e.existsSync(this.runtimeSetting.outputCpkPath)) {
        i = this.runtimeSetting.outputCpkPath;
      }

      let n = Editor.Dialog.openFile({
        defaultPath: i,
        properties: ["openDirectory"],
        filters: [{ name: Editor.T("cpk-publish.out_cpk_path_hint") }],
      });

      if (n && n[0]) {
        this.runtimeSetting.outputCpkPath = n[0];
      }
    },
  };
