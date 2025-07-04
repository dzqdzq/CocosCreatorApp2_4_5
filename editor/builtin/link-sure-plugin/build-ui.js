"use strict";
let t = Editor.Profile.load("project://link-sure-runtime.json");
let e = t.getSelfData();

exports.template = `\n        <ui-prop name="${Editor.T(
  "link-sure-runtime.pack_res_to_first_pack"
)}" >\n             <ui-checkbox v-value="runtimeSetting.packFirstScreenRes"></ui-checkbox>\n        </ui-prop>\n\n        <ui-prop name="${Editor.T(
  "link-sure-runtime.small_packet_path"
)}" auto-height>\n            <ui-input class="flex-1" v-value="runtimeSetting.tinyPackageServer" placeholder="${Editor.T(
  "link-sure-runtime.small_packet_path_hint"
)}"></ui-input>\n        </ui-prop>\n`;

exports.name = "link-sure";

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

exports.methods = {};
