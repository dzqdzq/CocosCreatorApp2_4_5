const e = "project://link-sure-runtime.json";
let t = require("./lib/cpk-util.js");
module.exports = {
  name: Editor.T("link-sure-runtime.platform_name"),
  platform: "link-sure",
  extends: "runtime",
  output: "linksure",
  buttons: [Editor.Builder.DefaultButtons.Build],
  messages: {
    "script-build-finished": function (t, r) {
      let i = Editor.Profile.load(e);
      (r.settings.server = i.get("tinyPackageServer") || ""), t.reply();
    },
    "build-finished": async function (r, i) {
      try {
        var n = await t.gatherInfo(r, i);
        if (!1 === n) return;
        if (!1 === (n = await t.organizeResources(r))) return;
        await t.pack(r),
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
    let t = require("fs-extra"),
      r = require("path"),
      i = Editor.url(
        "packages://runtime-adapters/platforms/link-sure/res/main.js"
      );
    var n = r.join(e.dest, "main.js");
    t.copySync(i, n);
  },
  buildStart: function (t) {
    let r = Editor.Profile.load(e);
    (t.startSceneAssetBundle = r.get("packFirstScreenRes") || !1),
      (t.separateEngineMode = r.get("separateEngineMode") || !1);
  },
  delPattern: function (e) {
    let t = require("path"),
      r = e.dest;
    return [t.join(r, "**/*")];
  },
  settings: Editor.url("packages://link-sure-runtime/build-ui.js"),
};
