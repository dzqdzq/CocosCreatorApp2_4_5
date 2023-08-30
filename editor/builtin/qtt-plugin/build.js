const t = "project://qtt-runtime.json";
let e = require("./lib/cpk-util.js");
module.exports = {
  name: Editor.T("qtt-runtime.platform_name"),
  platform: "qtt-game",
  extends: "runtime",
  buttons: [Editor.Builder.DefaultButtons.Build],
  messages: {
    "script-build-finished": function (e, r) {
      let i = Editor.Profile.load(t);
      r.settings.server = i.get("tinyPackageServer") || "";
      e.reply();
    },
    "build-finished": async function (r, i) {
      try {
        var n = await e.gatherInfo(i, r);
        if (false === n) {
          return;
        }
        if (false === (n = await e.organizeResources(r))) {
          return;
        }
        await e.pack(r);

        (function (e) {
          var r = Editor.Profile.load(t).getSelfData();
          let i = {
            resUrl: r.tinyPackageServer,
            orientation: r.deviceOrientation,
            projectName: r.name,
          };
          Editor.Ipc.sendToMain("builder:notify-build-result", e, i);
        })(i);
      } catch (t) {
        r.reply(t);
      }
    },
  },
  md5: {
    globalIgnore: function () {
      return [/.*/];
    },
  },
  beforeFinish: function (t) {
    let e = require("fs-extra");
    let r = require("path");
    let i = Editor.url("packages://runtime-adapters/platforms/qtt/res/main.js");
    var n = r.join(t.dest, "main.js");
    e.copySync(i, n);
  },
  buildStart: function (e) {
    let r = Editor.Profile.load(t);
    e.startSceneAssetBundle = r.get("packFirstScreenRes") || false;
  },
  delPattern: function (t) {
    let e = require("path");
    let r = t.dest;
    return [e.join(r, "**/*")];
  },
  settings: Editor.url("packages://qtt-runtime/build-ui.js"),
};
