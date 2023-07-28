const e = Editor.require("app://editor/share/adapters-build-utils");
const t = require("fire-path");
const n = require("fire-fs");
const i = require("crypto");
const o = Editor.require("app://editor/share/build-utils");
const r = "project://bytedance.json";
const s = Editor.require("app://editor/share/3d-physics-build-utils");
const a = {};
const u = {
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
    n = s.updateMinigameRequire(t, n);
    e.contents = new Buffer(n);
  },
  "game.json": function (e, n) {
    let i = Editor.Profile.load(r);
    let s = JSON.parse(e.contents.toString());
    o.combineDestJson(n, s, t.basename(e.path));
    s.deviceOrientation = i.get("orientation");

    if (i.get("subContext")) {
      s.openDataContext = i.get("subContext");
    } else {
      delete s.openDataContext;
    }

    if (n.separateEngineMode) {
      let e = s.plugins.cocos;
      let t = Editor.versions.CocosCreator;
      e.version = a[t] || t;
    } else {
      delete s.plugins;
    }
    let u = [];
    for (var d = 0, l = n.bundles.length; d < l; d++) {
      var c = n.bundles[d];

      if ("subpackage" === c.compressionType) {
        u.push({ name: c.name, root: "subpackages/" + c.name });
      }
    }
    s.subpackages = u;
    o.combineBuildTemplateJson(n, s, t.basename(e.path));
    e.contents = new Buffer(JSON.stringify(s, null, 4));
  },
  "project.config.json": function (e, n) {
    let i = Editor.Profile.load(r);
    let s = JSON.parse(e.contents.toString());
    o.combineDestJson(n, s, t.basename(e.path));
    s.appid = i.get("appid");
    s.projectname = n.projectName;
    o.combineBuildTemplateJson(n, s, t.basename(e.path));
    e.contents = new Buffer(JSON.stringify(s, null, 4));
  },
  "signature.json": function (e, o) {
    if (!o.separateEngineMode) {
      e.contents = null;
      return;
    }
    let r = JSON.parse(e.contents.toString());
    const s = n.readFileSync(t.join(o.dest, "cocos/cocos2d-js-min.js"));
    r.signature[0].md5 = i.createHash("md5").update(s).digest("hex");
    e.contents = new Buffer(JSON.stringify(r, null, 4));
  },
  "plugin.json": function (e, t) {
    if (!t.separateEngineMode) {
      e.contents = null;
    }
  },
};

module.exports = {
  name: Editor.T("bytedance.platform_name"),
  platform: "bytedance",
  extends: "mini-game",
  buttons: [Editor.Builder.DefaultButtons.Build],
  buildStart: function (e) {
    let t = e.excludedModules;
    let n = t.indexOf("SubContext");

    if (-1 !== n) {
      t.splice(n, 1);
    }

    let i = Editor.Profile.load(r);
    e.startSceneAssetBundle = i.get("startSceneAssetBundle") || false;
    e.separateEngineMode = !e.debug && i.get("separate_engine");
  },
  compileFlags: function (e) {
    return { support_jit: false, minigame: true };
  },
  delPattern: function (e) {
    let n = Editor.Profile.load(r).get("subContext");
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
          let e = Editor.Profile.load(r);
          if (!e) {
            throw new Error("config file not found");
          }

          if (!e.get("appid")) {
            Editor.warn("appid is empty, use 'testappid' by default");
          }
        })();

        n.settings.server = Editor.Profile.load(r).get("REMOTE_SERVER_ROOT");

        await e.buildAdapter(
          n,
          "./platforms/bytedance/wrapper/sub-context-adapter.js"
        );

        await e.copyRes(n, null, u);
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
          let t = Editor.Profile.load(r);

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
  },
  settings: Editor.url("packages://bytedance/build-ui.js"),
};
