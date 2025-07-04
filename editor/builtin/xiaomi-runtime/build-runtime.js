const e = Editor.require("app://editor/share/adapters-build-utils");
const i = require(Editor.url("packages://xiaomi-runtime/lib/utils"));
const t = require("fire-path");
const n = require("fire-fs");
const o = require("del");
const { promisify: r } = require("util");
const a = Editor.require("app://editor/share/build-utils");
const s = Editor.require("app://editor/share/3d-physics-build-utils");
var u;
var l;
var d;
var m;
var c;
var g;
const p = "project://xiaomi-runtime.json";
const f = {
  "certificate.pem": function (e, i) {
    let t = Editor.Profile.load(p);

    if (!t.get("useDebugKey")) {
      e.contents = n.readFileSync(t.get("certificatePath"));
    }

    e.basename = `sign/${i.debug ? "debug" : "release"}/certificate.pem`;
  },
  "private.pem": function (e, i) {
    let t = Editor.Profile.load(p);

    if (!t.get("useDebugKey")) {
      e.contents = n.readFileSync(t.get("privatePath"));
    }

    e.basename = `sign/${i.debug ? "debug" : "release"}/private.pem`;
  },
  "manifest.json": function (e, i) {
    let n = Editor.Profile.load(p);
    let o = JSON.parse(e.contents.toString());
    a.combineDestJson(i, o, t.basename(e.path));
    o.package = n.get("package");
    o.name = n.get("name");
    o.icon = `/image/${t.parse(u).base}`;
    o.versionName = n.get("versionName");
    o.versionCode = n.get("versionCode");
    o.minPlatformVersion = n.get("minPlatformVersion");
    o.orientation = n.get("deviceOrientation");
    o.config.logLevel = n.get("logLevel");
    let r = [];
    for (var s = 0, l = i.bundles.length; s < l; s++) {
      var d = i.bundles[s];

      if ("subpackage" === d.compressionType) {
        r.push({ name: "usr_" + d.name, root: "subpackages/" + d.name + "/" });
      }
    }
    o.subpackages = r;
    a.combineBuildTemplateJson(i, o, t.basename(e.path));
    o = JSON.stringify(o, null, 4);
    e.contents = new Buffer(o);
  },
  "main.js": function (e, i) {
    let t = e.contents.toString();
    let n = i.debug ? "require('adapter.js')" : "require('adapter-min.js')";
    t = t.replace("require('adapter-js-path')", n);

    t = s.updateMinigameRequire(
        i,
        t,
        "require(window._CCSettings.debug ? 'physics.js' : 'physics-min.js');"
      );

    e.contents = new Buffer(t);
  },
};

module.exports = {
  name: Editor.T("xiaomi-runtime.platform_name"),
  platform: "xiaomi",
  extends: "mini-game",
  buttons: [
    Editor.Builder.DefaultButtons.Build,
    Editor.Builder.DefaultButtons.Play,
  ],
  buildStart: function (e) {
    let i = Editor.Profile.load(p);
    e.startSceneAssetBundle = i.get("startSceneAssetBundle") || false;
  },
  compileFlags: function (e) {
    return { support_jit: false, minigame: true };
  },
  delPattern: function (e, i) {
    let n = e.dest;
    return [
      t.join(n, "**/*"),
      `!${t.join(n, "node_modules")}`,
      `!${t.join(n, "node_modules", "**/*")}`,
      `!${t.join(n, "manifest.json")}`,
      `!${t.join(n, "sign")}`,
      `!${t.join(n, "sign", "**/*")}`,
    ];
  },
  md5: {
    globalIgnore: function () {
      return [/.*/];
    },
  },
  messages: {
    "script-build-finished": async function (i, a) {
      let s = null;
      try {
        (function (e) {
          let i = Editor.Profile.load(p);
          if (!i) {
            throw new Error("config file not found");
          }
          var t = i.get("package");
          var o = i.get("name");
          var r = i.get("icon");
          var a = i.get("versionName");
          var s = i.get("versionCode");
          var f = i.get("minPlatformVersion");
          c = e.debug;
          g = e.sourceMaps;
          u = r || "";
          u = r.trim();
          l = i.get("privatePath") || "";
          d = i.get("certificatePath") || "";
          m = i.get("useDebugKey");
          var b = true;
          var y = [];
          var v = "";

          [
              { name: Editor.T("xiaomi-runtime.package"), value: t },
              { name: Editor.T("xiaomi-runtime.name"), value: o },
              { name: Editor.T("xiaomi-runtime.desktop_icon"), value: r },
              { name: Editor.T("xiaomi-runtime.version_name"), value: a },
              { name: Editor.T("xiaomi-runtime.version_number"), value: s },
              {
                name: Editor.T("xiaomi-runtime.support_min_platform"),
                value: f,
              },
            ].forEach(function (e) {
            if (!e.value) {
              b = false;
              y.push(e.name);
            }
          });

          if (!b) {
            v += y.join("、") + Editor.T("xiaomi-runtime.not_empty");
          }

          if (r) {
            if (!n.existsSync(u)) {
              b = false;
              v += r + Editor.T("xiaomi-runtime.icon_not_exist");
            }
          }

          if (!m) {
            if ("" === l) {
              b = false;
              v += Editor.T("xiaomi-runtime.select_private_pem_path");
            } else {
              if (!n.existsSync(l)) {
                b = false;
                v += `${l} ` + Editor.T("xiaomi-runtime.signature_not_exist");
              }
            }

            if ("" === d) {
              b = false;
              v += Editor.T("xiaomi-runtime.select_certificate_pem_path");
            } else {
              if (!n.existsSync(d)) {
                b = false;
                v += `${d}` + Editor.T("xiaomi-runtime.signature_not_exist");
              }
            }
          }

          if (!b) {
            throw new Error(v);
          }
        })(a);

        (async function (e) {
          let i = Editor.url(
              "packages://adapters/platforms/xiaomi/res/node_modules"
            );

          let a = t.join(e.dest, "node_modules");
          try {
            let e = JSON.parse(
                n.readFileSync(
                  t.join(i, "quickgame-cli/package.json"),
                  "utf8"
                )
              );

            let r = JSON.parse(
              n.readFileSync(
                t.join(a, "quickgame-cli/package.json"),
                "utf8"
              )
            );

            if (e.version === r.version) {
              return;
            }
            Editor.log("Removing old node_modules...");
            await o(t.join(a, "**/*").replace(/\\/g, "/"), { force: true });
          } catch (e) {}
          Editor.log("Copying node_modules, please wait ...");
          let s = r(n.copy);
          try {
            await s(i, a);
          } catch (e) {
            Editor.error("Copy node_module failed", e);
          }
        })(a);

        (function (e) {
          let i = Editor.Profile.load(p).get("icon");
          n.copySync(i, t.join(e.dest, "image", t.parse(i).base));
        })(a);

        a.settings.server = Editor.Profile.load(p).get("tinyPackageServer");
        await e.buildAdapter(a, null);

        await e.copyRes(
          a,
          [
            "./node_modules",
            "./node_modules/**/*",
            "./openSSLWin64",
            "./openSSLWin64/**/*",
          ],
          f
        );

        (function () {
          let e = Editor.Profile.load(p);

          if (!(e.get("useDebugKey") ||
            e.get("package").indexOf("test") ||
            e.get("name").indexOf("test") ||
            c || g)) {
            Editor.Metrics.trackEvent(
              "Project",
              "BetaPlatforms",
              "xiaomi-runtime",
              {
                packageName: e.get("package"),
                appName: e.get("name"),
                version: e.get("versionName"),
                orientation: e.get("deviceOrientation"),
              }
            );
          }
        })();
      } catch (e) {
        s = e;
      }
      i.reply(s);
    },
    "build-finished": async function (e, o) {
      let r = null;
      try {
        (function (e) {
          for (var i = 0, o = e.bundles.length; i < o; i++) {
            var r = e.bundles[i];
            if ("subpackage" !== r.compressionType) {
              continue;
            }
            let o = t.join(r.scriptDest, "index.js");

            if (n.existsSync(o)) {
              n.renameSync(o, t.join(r.scriptDest, "main.js"));
            }
          }
        })(o);

        await (async function (e) {
          let t = Editor.Profile.load(p);
          let n = e.debug;
          let o = e.dest;
          Editor.log("Build rpk");
          let r = ["quickgame", n ? "build" : "release", "--cocos-wx-game"];

          if (t.get("tinyPackageServer")) {
            r.push("--ignore", "remote");
          }

          await i.execCmd(
            "win32" === process.platform ? "npx.cmd" : "npx",
            r,
            o
          );
        })(o);

        (function (e) {
          let i = Editor.Profile.load(p);

          let t = {
            packageName: i.get("package"),
            resUrl: i.get("tinyPackageServer"),
            orientation: i.get("deviceOrientation"),
            projectName: i.get("name"),
          };

          Editor.Ipc.sendToMain("builder:notify-build-result", e, t);
        })(o);
      } catch (e) {
        r = e;
      }
      e.reply(r);
    },
    play: (e, i) => {
      Editor.Panel.open("xiaomi-runtime.qrcode", i);
    },
  },
  settings: Editor.url("packages://xiaomi-runtime/build-runtime-ui.js"),
};
