const e = Editor.require("app://editor/share/adapters-build-utils");
const t = require("fire-path");
const n = require("fire-fs");
const i = require(Editor.url("packages://wechatgame/utils/wechat-game"));
const o = require("crypto");
const r = Editor.require("app://editor/share/build-utils");
const s = "project://wechatgame.json";
const a = Editor.require("app://editor/share/3d-physics-build-utils");

const u = {
  "2.2.1": "2.2.2",
  "2.2.2": "2.2.3",
  "2.4.2": "2.4.1",
  "2.4.4": "2.4.5",
  "2.4.5": "2.4.7",
};

const l = {
  "game.js": function (e, t) {
    let n = e.contents.toString();

    let i = t.debug
      ? "require('cocos/cocos2d-js.js')"
      : "require('cocos/cocos2d-js-min.js')";

    if (t.separateEngineMode) {
      i = "requirePlugin('cocos')";
    }

    n = n.replace("require('cocos2d-js-path')", i);
    let o = t.debug ? "require('adapter.js')" : "require('adapter-min.js')";
    n = n.replace("require('adapter-js-path')", o);
    n = a.updateMinigameRequire(t, n);
    e.contents = new Buffer(n);
  },
  "game.json": function (e, n) {
    let i = Editor.Profile.load(s);
    let o = JSON.parse(e.contents.toString());
    r.combineDestJson(n, o, t.basename(e.path));
    o.deviceOrientation = i.get("orientation");

    if (i.get("subContext")) {
      o.openDataContext = i.get("subContext");
    } else {
      delete o.openDataContext;
    }

    if (n.separateEngineMode) {
      let e = o.plugins.cocos;
      let t = Editor.versions.CocosCreator;
      e.version = u[t] || t;
    } else {
      delete o.plugins;
    }
    let a = [];
    for (var l = 0, c = n.bundles.length; l < c; l++) {
      var d = n.bundles[l];

      if ("subpackage" === d.compressionType) {
        a.push({ name: d.name, root: "subpackages/" + d.name });
      }
    }
    o.subpackages = a;
    r.combineBuildTemplateJson(n, o, t.basename(e.path));
    e.contents = new Buffer(JSON.stringify(o, null, 4));
  },
  "project.config.json": function (e, n) {
    let i = Editor.Profile.load(s);
    let o = JSON.parse(e.contents.toString());
    r.combineDestJson(n, o, t.basename(e.path));
    o.appid = i.get("appid") || "wx6ac3f5090a6b99c5";
    o.projectname = n.projectName;
    r.combineBuildTemplateJson(n, o, t.basename(e.path));
    e.contents = new Buffer(JSON.stringify(o, null, 4));
  },
  "signature.json": function (e, i) {
    if (!i.separateEngineMode) {
      e.contents = null;
      return;
    }
    let r = JSON.parse(e.contents.toString());
    const s = n.readFileSync(t.join(i.dest, "cocos/cocos2d-js-min.js"));
    r.signature[0].md5 = o.createHash("md5").update(s).digest("hex");
    e.contents = new Buffer(JSON.stringify(r, null, 4));
  },
  "plugin.json": function (e, t) {
    if (!t.separateEngineMode) {
      e.contents = null;
    }
  },
};

module.exports = {
  name: Editor.T("wechatgame.platform_name"),
  platform: "wechatgame",
  extends: "mini-game",
  buttons: [
    Editor.Builder.DefaultButtons.Build,
    Editor.Builder.DefaultButtons.Play,
  ],
  buildStart: function (e) {
    let t = e.excludedModules;
    let n = t.indexOf("SubContext");

    if (-1 !== n) {
      t.splice(n, 1);
    }

    let i = Editor.Profile.load(s);
    e.startSceneAssetBundle = i.get("startSceneAssetBundle");
    e.separateEngineMode = !e.debug && i.get("separate_engine");
  },
  compileFlags: function (e) {
    return { support_jit: false, minigame: true };
  },
  delPattern: function (e) {
    let n = Editor.Profile.load(s).get("subContext");
    let i = e.dest;

    let o = [
      t.join(i, "**/*"),
      `!${t.join(i, "game.json")}`,
      `!${t.join(i, "project.config.json")}`,
    ];

    if (n) {
      o.push(`!${t.join(i, n)}`, `!${t.join(i, n, "**/*")}`);
    }

    return o;
  },
  engineBuildPath: function (e) {
    return t.join(e.dest, "cocos");
  },
  md5: {
    globalIgnore: function () {
      return [/.*/];
    },
  },
  messages: {
    "script-build-finished": async function (t, n) {
      let i = null;
      try {
        (function () {
          let e = Editor.Profile.load(s);
          if (!e) {
            throw new Error("config file not found");
          }

          if (!e.get("appid")) {
            Editor.warn("appid is empty, use 'wx6ac3f5090a6b99c5' by default");
          }
        })();

        n.settings.server = Editor.Profile.load(s).get("REMOTE_SERVER_ROOT");

        await e.buildAdapter(
          n,
          "./platforms/wechat/wrapper/sub-context-adapter.js"
        );

        await e.copyRes(n, null, l);
      } catch (e) {
        i = e;
      }
      t.reply(i);
    },
    "build-finished": function (e, i) {
      let o = null;
      try {
        (function (e) {
          for (var i = 0, o = e.bundles.length; i < o; i++) {
            var r = e.bundles[i];
            if ("subpackage" !== r.compressionType) {
              continue;
            }
            let o = t.join(r.scriptDest, "index.js");

            if (n.existsSync(o)) {
              n.renameSync(o, t.join(r.scriptDest, "game.js"));
            }
          }
        })(i);

        (function (e) {
          let t = Editor.Profile.load(s);

          let n = {
            id: t.get("appid"),
            resUrl: t.get("REMOTE_SERVER_ROOT"),
            orientation: t.get("orientation"),
          };

          Editor.Ipc.sendToMain("builder:notify-build-result", e, n);
        })(i);
      } catch (e) {
        o = e;
      }
      e.reply(o);
    },
    play: function (e, t) {
      i.run(t);
    },
  },
  settings: Editor.url("packages://wechatgame/build-ui.js"),
};
