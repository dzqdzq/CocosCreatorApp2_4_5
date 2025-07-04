"use strict";
Editor.remote.Profile.load("global://features.json");

exports.template = `\n    <ui-prop name="${Editor.T(
  "BUILDER.orientation"
)}">\n        <ui-select class="flex-1" v-value="wechatgame.orientation">\n            <option value="landscape">Landscape</option>\n            <option value="portrait">Portrait</option>\n        </ui-select>\n    </ui-prop>\n`;

exports.name = "wechatgame-subcontext";
exports.props = { local: null, project: null, anysdk: null };

exports.created = function () {
  this.profile = Editor.Profile.load("project://wechatgame-opendata.json");

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
    return { wechatgame: { orientation: "portrait" } };
  };

exports.directives = {};
