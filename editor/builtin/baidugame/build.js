const e = Editor.require("app://editor/share/adapters-build-utils");
const t = require("fire-path");
const i = Editor.require("app://editor/share/build-utils");
const n = "project://baidugame.json";
const o = Editor.require("app://editor/share/3d-physics-build-utils");
const r = {
  "game.js": function (e, t) {
    let i = e.contents.toString();
    let n = t.debug ? "require('cocos2d-js.js')" : "require('cocos2d-js-min.js')";
    i = i.replace("require('cocos2d-js-path')", n);
    let r = t.debug ? "require('adapter.js')" : "require('adapter-min.js')";
    i = i.replace("require('adapter-js-path')", r);
    i = o.updateMinigameRequire(t, i);
    e.contents = new Buffer(i);
  },
  "game.json": function (e, o) {
    let r = Editor.Profile.load(n);
    let a = JSON.parse(e.contents.toString());
    i.combineDestJson(o, a, t.basename(e.path));
    a.deviceOrientation = r.get("orientation");
    let s = r.get("subContext");

    if (s) {
      a.openDataContext = s;
    } else {
      delete a.openDataContext;
    }

    let d = [];
    for (var l = 0, u = o.bundles.length; l < u; l++) {
      var p = o.bundles[l];

      if ("subpackage" === p.compressionType) {
        d.push({ name: p.name, root: "subpackages/" + p.name });
      }
    }
    a.subpackages = d;
    i.combineBuildTemplateJson(o, a, t.basename(e.path));
    e.contents = new Buffer(JSON.stringify(a, null, 4));
  },
  "project.swan.json": function (e, o) {
    let r = Editor.Profile.load(n);
    let a = JSON.parse(e.contents.toString());
    i.combineDestJson(o, a, t.basename(e.path));
    a.appid = r.get("appid") || "testappid";
    a.projectname = o.projectName;
    i.combineBuildTemplateJson(o, a, t.basename(e.path));
    e.contents = new Buffer(JSON.stringify(a, null, 4));
  },
};

module.exports = {
  name: Editor.T("baidugame.platform_name"),
  platform: "baidugame",
  extends: "mini-game",
  buttons: [Editor.Builder.DefaultButtons.Build],
  buildStart: function (e) {
    let t = e.excludedModules;
    let i = t.indexOf("SubContext");

    if (-1 !== i) {
      t.splice(i, 1);
    }

    let o = Editor.Profile.load(n);
    e.startSceneAssetBundle = o.get("startSceneAssetBundle") || false;
  },
  compileFlags: function (e) {
    return { support_jit: false, minigame: true };
  },
  delPattern: function (e) {
    let i = Editor.Profile.load(n).get("subContext");
    let o = e.dest;

    let r = [
      t.join(o, "**/*"),
      `!${t.join(o, "game.json")}`,
      `!${t.join(o, "project.swan.json")}`,
    ];

    if (i) {
      r.push(`!${t.join(o, i)}`, `!${t.join(o, i, "**/*")}`);
    }

    return r;
  },
  md5: {
    globalIgnore: function () {
      return [/.*/];
    },
  },
  messages: {
    "script-build-finished": async function (t, i) {
      let o = null;
      try {
        (function () {
          let e = Editor.Profile.load(n);
          if (!e) {
            throw new Error("config file not found");
          }

          if (!e.get("appid")) {
            Editor.warn("appid is empty, use 'testappid' by default");
          }
        })();

        i.settings.server = Editor.Profile.load(n).get("REMOTE_SERVER_ROOT");

        await e.buildAdapter(
          i,
          "./platforms/baidu/wrapper/sub-context-adapter.js"
        );

        await e.copyRes(i, null, r);
      } catch (e) {
        o = e;
      }
      t.reply(o);
    },
    "build-finished": function (e, t) {
      let i = null;
      try {
        (function (e) {
          let t = Editor.Profile.load(n);

          let i = {
            id: t.get("appid"),
            resUrl: t.get("REMOTE_SERVER_ROOT"),
            orientation: t.get("orientation"),
          };

          Editor.Ipc.sendToMain("builder:notify-build-result", e, i);
        })(t);
      } catch (e) {
        i = e;
      }
      e.reply(i);
    },
  },
  settings: Editor.url("packages://baidugame/build-ui.js"),
};
