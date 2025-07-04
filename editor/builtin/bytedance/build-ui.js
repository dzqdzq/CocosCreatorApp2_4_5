"use strict";
let e = Editor.Profile.load("project://bytedance.json");
let t = e.getSelfData();
const n = Editor.remote.Profile.load("global://features.json");
const a = require("electron").remote.dialog;
const o = /^v?[0-9.]*(?:-p.[0-9]+)?$/;

exports.template = `\n    <ui-prop name="${Editor.T(
  "BUILDER.start_scene_asset_bundle"
)}"\n            tooltip="${Editor.T(
  "BUILDER.start_scene_asset_bundle_tooltip"
)}"\n    >\n        <ui-checkbox v-value="bytedanceData.startSceneAssetBundle"></ui-checkbox>\n    </ui-prop>\n\n    <ui-prop name="${Editor.T(
  "BUILDER.orientation"
)}">\n        <ui-select class="flex-1" v-value="bytedanceData.orientation">\n            <option value="landscape">Landscape</option>\n            <option value="portrait">Portrait</option>\n        </ui-select>\n    </ui-prop>\n\n    <ui-prop name="appid">\n        <ui-input class="flex-1" v-value="bytedanceData.appid" placeholder="testappid"></ui-input>\n    </ui-prop>\n    \n    <ui-prop name="${Editor.T(
  "bytedance.remote_server_address"
)}" \n             tooltip="${Editor.T(
  "bytedance.remote_server_address_tips"
)}">\n        <ui-input class="flex-1" v-value="bytedanceData.REMOTE_SERVER_ROOT" placeholder="${Editor.T(
  "BUILDER.optional_input_tips"
)}"></ui-input>\n    </ui-prop>\n\n    <ui-prop name="${Editor.T(
  "bytedance.sub_context"
)}" \n             tooltip="${Editor.T(
  "bytedance.sub_context_tips"
)}">\n        <ui-input class="flex-1" v-value="bytedanceData.subContext" placeholder="${Editor.T(
  "BUILDER.optional_input_tips"
)}"></ui-input>\n    </ui-prop>\n    <ui-prop name="${Editor.T(
  "bytedance.separate_engine"
)}"\n             tooltip="${Editor.T(
  "bytedance.separate_engine_tips"
)}"\n             v-if="!local.debug && showSeparateEngine()">\n        <ui-checkbox v-value="bytedanceData.separate_engine">\n        </ui-checkbox>\n    </ui-prop>\n`;

exports.name = "bytedance";
exports.props = { local: null, project: null, anysdk: null };

exports.created = function () {
    Object.keys(this.bytedanceData).forEach((t) => {
      this.bytedanceData[t] = e.get(t);
    });
  };

exports.watch = {
    bytedanceData: {
      handler(t) {
        e.set("", t);
        e.save();
      },
      deep: true,
    },
  };

exports.data = function () {
    return { bytedanceData: t };
  };

exports.directives = {};

exports.methods = {
    checkParams() {
      if (!this.local.debug && this.bytedanceData.separate_engine) {
        let e = Editor.remote.Profile.load("local://settings.json");

        let t = Editor.remote.Profile.load("global://settings.json").get(
          "use-default-js-engine"
        );

        if (false === e.get("use-global-engine-setting")) {
          t = true === e.get("use-default-js-engine");
        }

        let n = Editor.remote.versions.CocosCreator;
        if (!t || !o.test(n)) {
          a.showErrorBox(
            Editor.T("BUILDER.error.build_error"),
            Editor.T("BUILDER.error.separate_engine")
          );

          return false;
        }
      }
      return true;
    },
    showSeparateEngine: () => (n && n.get("bytedance-separation-engine")) || false,
  };
