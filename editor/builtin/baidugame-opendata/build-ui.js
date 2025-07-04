"use strict";

exports.template = `\n    <ui-prop name="${Editor.T(
  "BUILDER.orientation"
)}">\n        <ui-select class="flex-1" v-value="baidugame.orientation">\n            <option value="landscape">Landscape</option>\n            <option value="portrait">Portrait</option>\n        </ui-select>\n    </ui-prop>\n`;

exports.name = "baidugame-subcontext";
exports.props = { data: null, project: null, anysdk: null };

exports.created = function () {
  this.profile = Editor.Profile.load("project://baidugame-opendata.json");

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
    return { baidugame: { orientation: "portrait" } };
  };

exports.directives = {};
exports.methods = {};
