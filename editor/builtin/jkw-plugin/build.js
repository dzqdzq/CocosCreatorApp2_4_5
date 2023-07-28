const e = "project://cpk-publish.json";
let t = require("./lib/cpk-util.js");
module.exports = {
  name: Editor.T("cpk-publish.platform_name"),
  platform: "jkw-game",
  output: "cocos-play",
  extends: "runtime",
  buttons: [Editor.Builder.DefaultButtons.Build],
  messages: {
    "script-build-finished": function (t, r) {
      let i = Editor.Profile.load(e);
      r.settings.server = i.get("tinyPackageServer") || "";
      t.reply();
    },
    "build-finished": async function (r, i) {
      try {
        var a = await t.gatherInfo(r, i);
        if (false === a) {
          return;
        }
        if (false === (a = await t.organizeResources(r))) {
          return;
        }
        await t.pack(r);

        (function (t) {
          var r = Editor.Profile.load(e).getSelfData();
          let i = {
            resUrl: r.tinyPackageServer,
            orientation: r.deviceOrientation,
            projectName: r.name,
          };
          Editor.Ipc.sendToMain("builder:notify-build-result", t, i);
        })(i);
      } catch (e) {
        r.reply(e);
      }
    },
  },
  md5: {
    globalIgnore: function () {
      return [/.*/];
    },
  },
  beforeFinish: function (e) {
    let t = require("path");
    let r = require("fs-extra");
    let i = Editor.Profile.load("project://cpk-publish.json").getSelfData();

    let a = Editor.url(
      "packages://runtime-adapters/platforms/cocos-play/res/main.js"
    );

    if ("landscape" === i.deviceOrientation) {
      a = Editor.url(
          "packages://runtime-adapters/platforms/cocos-play/res/main_landscape.js"
        );
    }

    var n = t.join(e.dest, "main.js");
    r.copySync(a, n);
  },
  buildStart: function (t) {
    let r = Editor.Profile.load(e);
    t.startSceneAssetBundle = r.get("packFirstScreenRes") || false;
    t.separateEngineMode = r.get("separateEngineMode") || false;
  },
  delPattern: function (e) {
    let t = require("path");
    let r = e.dest;
    return [t.join(r, "**/*")];
  },
  settings: Editor.url("packages://cpk-publish/build-ui.js"),
};
