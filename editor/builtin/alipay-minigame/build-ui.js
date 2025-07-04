let e = Editor.Profile.load("project://alipay-minigame.json");
let t = e.getSelfData();
"use strict";

exports.template = `\n        <ui-prop name="${Editor.T(
    "BUILDER.start_scene_asset_bundle"
  )}"\n                tooltip="${Editor.T(
    "BUILDER.start_scene_asset_bundle_tooltip"
  )}"\n        >\n            <ui-checkbox v-value="runtimeSetting.startSceneAssetBundle"></ui-checkbox>\n        </ui-prop>\n\n        <ui-prop name="${Editor.T(
    "alipay-minigame.screen_orientation"
  )}">\n            <ui-select class="flex-1" v-value="runtimeSetting.deviceOrientation">\n                <option value="portrait">${Editor.T(
    "alipay-minigame.vertical_screen"
  )}</option>\n                <option value="landscape">${Editor.T(
    "alipay-minigame.horizontal_screen"
  )}</option>\n            </ui-select>\n        </ui-prop>\n\n        <ui-prop name="${Editor.T(
    "alipay-minigame.remote_url"
  )}" auto-height>\n            <ui-input class="flex-1" v-value="runtimeSetting.remoteUrl" placeholder="${Editor.T(
    "alipay-minigame.remote_url_hint"
  )}"></ui-input>\n        </ui-prop>\n`;

exports.name = "alipay";

exports.data = function () {
    return { runtimeSetting: t, originEncryptJs: false, profile: null };
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

exports.created = function () {
  this.originEncryptJs = this.project.encryptJs;
  this.project.encryptJs = false;
};

exports.directives = {};

exports.beforeDestroy = function () {
    this.project.encryptJs = this.originEncryptJs;
  };
