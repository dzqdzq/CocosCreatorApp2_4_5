"use strict";
const e = Editor.remote.Profile.load("global://features.json");
const t = require("electron").remote.dialog;
const a = /^v?[0-9.]*(?:-p.[0-9]+)?$/;

exports.template = `\n    <ui-prop name="${Editor.T(
  "BUILDER.start_scene_asset_bundle"
)}"\n            tooltip="${Editor.T(
  "BUILDER.start_scene_asset_bundle_tooltip"
)}"\n    >\n        <ui-checkbox v-value="wechatgame.startSceneAssetBundle"></ui-checkbox>\n    </ui-prop>\n\n    <ui-prop name="${Editor.T(
  "BUILDER.orientation"
)}">\n        <ui-select class="flex-1" v-value="wechatgame.orientation">\n            <option value="landscape">Landscape</option>\n            <option value="portrait">Portrait</option>\n        </ui-select>\n    </ui-prop>\n\n    <ui-prop name="appid">\n        <ui-input class="flex-1" v-value="wechatgame.appid" placeholder="wx6ac3f5090a6b99c5"></ui-input>\n    </ui-prop>\n    \n    <ui-prop name="${Editor.T(
  "wechatgame.remote_server_address"
)}" \n             tooltip="${Editor.T(
  "wechatgame.remote_server_address_tips"
)}">\n        <ui-input class="flex-1" v-value="wechatgame.REMOTE_SERVER_ROOT" placeholder="${Editor.T(
  "BUILDER.optional_input_tips"
)}"></ui-input>\n    </ui-prop>\n\n    <ui-prop name="${Editor.T(
  "wechatgame.sub_context"
)}" \n             tooltip="${Editor.T(
  "wechatgame.sub_context_tips"
)}">\n        <ui-input class="flex-1" v-value="wechatgame.subContext" placeholder="${Editor.T(
  "BUILDER.optional_input_tips"
)}"></ui-input>\n    </ui-prop>\n    <ui-prop name="${Editor.T(
  "wechatgame.separate_engine"
)}"\n             tooltip="${Editor.T(
  "wechatgame.separate_engine_tips"
)}"\n             v-if="!local.debug && showSeparateEngine()">\n        <ui-checkbox v-value="wechatgame.separate_engine">\n        </ui-checkbox>\n    </ui-prop>\n`;

exports.name = "wechatgame";
exports.props = { local: null, project: null, anysdk: null };

exports.created = function () {
  this.profile = Editor.Profile.load("project://wechatgame.json");

  Object.keys(this.wechatgame).forEach((e) => {
    this.wechatgame[e] = this.profile.get(e);
  });
};

exports.watch = {
    wechatgame: {
      handler(e) {
        this.profile.set("", e);
        this.profile.save();
      },
      deep: true,
    },
  };

exports.data = function () {
    return {
      wechatgame: {
        appid: "wx6ac3f5090a6b99c5",
        orientation: "portrait",
        REMOTE_SERVER_ROOT: "",
        subContext: "",
        separate_engine: false,
        startSceneAssetBundle: false,
      },
    };
  };

exports.directives = {};

exports.methods = {
    checkParams() {
      if (!this.local.debug && this.wechatgame.separate_engine) {
        let e = Editor.remote.Profile.load("local://settings.json");

        let o = Editor.remote.Profile.load("global://settings.json").get(
          "use-default-js-engine"
        );

        if (false === e.get("use-global-engine-setting")) {
          o = true === e.get("use-default-js-engine");
        }

        let i = Editor.remote.versions.CocosCreator;
        if (!o || !a.test(i)) {
          t.showErrorBox(
            Editor.T("BUILDER.error.build_error"),
            Editor.T("BUILDER.error.separate_engine")
          );

          return false;
        }
      }
      return true;
    },
    showSeparateEngine: () => (e && e.get("wechat-separation-engine")) || false,
  };
