const e = Editor.require("app://editor/share/adapters-build-utils");
const t = Editor.require("app://editor/share/build-utils");
const i = "project://alipay-minigame.json";
const r = Editor.require("app://editor/share/3d-physics-build-utils");
const n = require("path");
const o = {
  "game.js": function (e, t) {
    let i = e.contents.toString();
    let n = t.debug ? "require('cocos2d-js.js')" : "require('cocos2d-js-min.js')";
    i = i.replace("require('cocos2d-js-path')", n);
    let o = t.debug ? "require('adapter.js')" : "require('adapter-min.js')";
    i = i.replace("require('adapter-js-path')", o);
    i = r.updateMinigameRequire(t, i);
    e.contents = new Buffer(i);
  },
  "game.json": function (e, r) {
    let o = Editor.Profile.load(i);
    let a = e.contents.toString();
    a = JSON.parse(a);
    t.combineDestJson(r, a, n.basename(e.path));
    a.screenOrientation = o.get("deviceOrientation");
    t.combineBuildTemplateJson(r, a, n.basename(e.path));
    e.contents = new Buffer(JSON.stringify(a, null, 4));
  },
};

module.exports = {
  name: Editor.T("alipay-minigame.platform_name"),
  platform: "alipay",
  extends: "mini-game",
  buttons: [Editor.Builder.DefaultButtons.Build],
  buildStart: function (e) {
    let t = Editor.Profile.load(i);
    e.startSceneAssetBundle = t.get("startSceneAssetBundle") || false;
  },
  compileFlags: function (e) {
    return { support_jit: false, minigame: true };
  },
  delPattern: function (e) {
    let t = e.dest;
    return [n.join(t, "**/*"), `!${n.join(t, "game.json")}`];
  },
  md5: {
    globalIgnore: function () {
      return [/.*/];
    },
  },
  messages: {
    "script-build-finished": async function (t, r) {
      let n = null;
      try {
        (function () {
          if (!Editor.Profile.load(i)) {
            throw new Error("config file not found");
          }
        })();

        r.settings.server = Editor.Profile.load(i).get("remoteUrl");
        await e.buildAdapter(r, null);
        await e.copyRes(r, null, o);

        (function () {
          let e = Editor.Profile.load(i);
          Editor.Metrics.trackEvent(
            "Project",
            "BetaPlatforms",
            "alipay-minigame",
            { orientation: e.get("deviceOrientation") }
          );
        })();
      } catch (e) {
        n = e;
      }
      t.reply(n);
    },
    "build-finished": function (e, t) {
      let r = Editor.Profile.load(i);

      let n = {
        resUrl: r.get("remoteUrl"),
        orientation: r.get("deviceOrientation"),
      };

      Editor.Ipc.sendToMain("builder:notify-build-result", t, n);
      e.reply();
    },
  },
  settings: Editor.url("packages://alipay-minigame/build-ui.js"),
};
