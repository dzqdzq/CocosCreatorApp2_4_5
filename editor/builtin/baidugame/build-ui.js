"use strict";

exports.template = `\n    <ui-prop name="${Editor.T(
  "BUILDER.start_scene_asset_bundle"
)}"\n        tooltip="${Editor.T(
  "BUILDER.start_scene_asset_bundle_tooltip"
)}"\n    >\n        <ui-checkbox v-value="baidugame.startSceneAssetBundle"></ui-checkbox>\n    </ui-prop>\n    \n    <ui-prop name="${Editor.T(
  "BUILDER.orientation"
)}">\n        <ui-select class="flex-1" v-value="baidugame.orientation">\n            <option value="landscape">Landscape</option>\n            <option value="portrait">Portrait</option>\n        </ui-select>\n    </ui-prop>\n\n    <ui-prop name="appid">\n        <ui-input class="flex-1" v-value="baidugame.appid" placeholder="testappid"></ui-input>\n    </ui-prop>\n    \n    <ui-prop name="${Editor.T(
  "baidugame.remote_server_address"
)}" \n             tooltip="${Editor.T(
  "baidugame.remote_server_address_tips"
)}">\n        <ui-input class="flex-1" v-value="baidugame.REMOTE_SERVER_ROOT" placeholder="${Editor.T(
  "BUILDER.optional_input_tips"
)}"></ui-input>\n    </ui-prop>\n\n    <ui-prop name="${Editor.T(
  "baidugame.sub_context"
)}" \n             tooltip="${Editor.T(
  "baidugame.sub_context_tips"
)}">\n        <ui-input class="flex-1" v-value="baidugame.subContext" placeholder="${Editor.T(
  "BUILDER.optional_input_tips"
)}"></ui-input>\n    </ui-prop>\n`;

exports.name = "baidugame";
exports.props = { data: null, project: null, anysdk: null };

exports.created = function () {
  this.profile = Editor.Profile.load("project://baidugame.json");

  Object.keys(this.baidugame).forEach((e) => {
    this.baidugame[e] = this.profile.get(e);
  });
};

exports.watch = {
    baidugame: {
      handler(e) {
        this.profile.set("", e);
        this.profile.save();
      },
      deep: true,
    },
  };

exports.data = function () {
    return {
      baidugame: {
        appid: "testappid",
        orientation: "portrait",
        REMOTE_SERVER_ROOT: "",
        subContext: "",
        startSceneAssetBundle: false,
      },
    };
  };

exports.directives = {};
exports.methods = {};
