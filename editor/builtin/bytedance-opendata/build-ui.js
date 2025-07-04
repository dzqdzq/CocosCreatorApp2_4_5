const e = Editor.Profile.load("project://bytedance-opendata.json");
const t = e.getSelfData();

exports.template = `\n    <ui-prop name="${Editor.T(
  "BUILDER.orientation"
)}">\n        <ui-select class="flex-1" v-value="bytedanceData.orientation">\n            <option value="landscape">Landscape</option>\n            <option value="portrait">Portrait</option>\n        </ui-select>\n    </ui-prop>\n`;

exports.name = "bytedance-subcontext";
exports.props = { local: null, project: null, anysdk: null };

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
