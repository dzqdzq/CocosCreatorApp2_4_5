const e = "cocos-library",
  r = "project://oppo-runtime.json",
  i = "manifest.json",
  n = "7d8bb580016b6a2fb89d902deda0d3a4",
  o = "sign",
  t = "logo.png",
  a = "main.js";
var s,
  p,
  c,
  u,
  d,
  m,
  l,
  g,
  f,
  y,
  v,
  _ = require("path"),
  E = require("fs-extra"),
  { execSync: j, spawn: b } = require("child_process"),
  S = require("fix-path"),
  k = {},
  h = "win32" === process.platform;
function T(e) {
  let r = Editor.url("packages://runtime-adapters/platforms/oppo");
  return void 0 === e || "" === e ? r : _.join(r, e);
}
function x() {
  return _.join(
    Editor.url("packages://runtime-adapters/quickgame-toolkit/lib/bin"),
    "index"
  );
}
function P(r, f) {
  Editor.log("Checking config file " + f.dest),
    s.npmPath
      ? (Editor.log(Editor.T("oppo-runtime.custom_npm_path_config"), s.npmPath),
        (k.Path = s.npmPath))
      : (y && Editor.log(Editor.T("oppo-runtime.custom_npm_path_not_config")),
        S(),
        (k = process.env)),
    !1 !==
      (function (e) {
        try {
          j("node -v", { env: k });
        } catch (r) {
          return s.npmPath
            ? (e.reply(
                new Error(Editor.T("oppo-runtime.custom_npm_path_config_error"))
              ),
              void 0)
            : (Editor.Ipc.sendToWins("builder:events", "npmPath-show"),
              h &&
                e.reply(
                  new Error(
                    Editor.T("oppo-runtime.not_install_nodejs_windows_error")
                  )
                ),
              e.reply(
                new Error(Editor.T("oppo-runtime.not_install_nodejs_mac_error"))
              ),
              !1);
        }
        return !0;
      })(r) &&
      ((c = f.dest),
      (p = _.resolve(f.dest, "..", "tempTinyRes")),
      (function (e) {
        for (var r = [], i = [], n = 0, o = e.bundles.length; n < o; n++) {
          var t = e.bundles[n];
          if ("subpackage" !== t.compressionType) continue;
          let o = _.join(t.scriptDest, "index.js");
          E.existsSync(o) && E.renameSync(o, _.join(t.scriptDest, "main.js"));
          let a = t.name;
          i.includes(a) ||
            (i.push(a),
            r.push({ name: "usr_" + a, root: "subpackages/" + a + "/" }));
        }
        if (0 === r.length) return (d = void 0), void 0;
        d = r;
      })(f),
      E.writeFileSync(_.join(c, t), E.readFileSync(u)),
      (function () {
        var e = _.join(c, o);
        if ((E.emptyDirSync(e), !g)) {
          var r = _.join(e, "release");
          E.ensureDirSync(r),
            E.existsSync(m) &&
              E.writeFileSync(_.join(r, "private.pem"), E.readFileSync(m)),
            E.existsSync(l) &&
              E.writeFileSync(_.join(r, "certificate.pem"), E.readFileSync(l));
        }
      })(),
      (function () {
        var e = _.join(c, i),
          r = {
            package: s.package,
            name: s.name,
            versionName: s.versionName,
            versionCode: s.versionCode,
            minPlatformVersion: s.minPlatformVersion,
            icon: "/logo.png",
            features: [
              { name: "system.prompt" },
              { name: "system.router" },
              { name: "system.shortcut" },
            ],
            permissions: [{ origin: "*" }],
            orientation: s.deviceOrientation,
          };
        d && (r.subpackages = d),
          v.debug ||
            !0 !== s.separateEngineMode ||
            (r.plugins = {
              "cocos-library": {
                provider: n,
                version: CocosEngine,
                path: "cocos-library",
              },
            });
        var o = JSON.stringify(r);
        E.writeFileSync(e, o);
      })(),
      (function () {
        let r = _.join(c, e);
        if (v.debug || !s.separateEngineMode) return;
        let i = _.join(c, "src", "cocos2d-runtime.js"),
          n = _.join(r, "cocos2d-runtime.js"),
          o = _.join(c, a),
          t = _.join(r, "plugin.json");
        Editor.info(Editor.T("oppo-runtime.separate_engine_begin_hint")),
          E.emptyDirSync(r),
          E.copySync(i, n);
        let p = { main: "cocos2d-runtime.js" };
        E.writeJSONSync(t, p);
        let u = E.readFileSync(o, "utf-8");
        if (u.indexOf("require('src/cocos2d-runtime.js');") > -1) {
          let e =
            "if (window.requirePlugin) {\n\trequirePlugin('cocos-library/cocos2d-runtime.js');\n} else {\n\trequire('cocos-library/cocos2d-runtime.js');\n}";
          (u = u.replace("require('src/cocos2d-runtime.js');", e)),
            E.writeFileSync(o, u);
        }
        Editor.info(Editor.T("oppo-runtime.separate_engine_end_hint"));
      })(),
      (async function (e) {
        let r = require("./build-jsb-adapter"),
          i = _.join(T("engine"), "index.js"),
          n = _.join(c, "jsb-adapter", "engine", "index.js");
        await r.build({ rootPath: i, dstPath: n, isDebug: v.debug }), e && e();
      })(function () {
        (function () {
          if ("" === s.tinyPackageServer) return;
          var e = _.join(c, "remote"),
            r = _.join(p, "remote");
          E.emptyDirSync(r), E.existsSync(e) && E.moveSync(e, r);
        })(),
          (function (e) {
            if (void 0 === d)
              return (
                (function (e) {
                  var r = [x(), "pack"];
                  g || r.push("release");
                  var i = b("node", r, { env: k, cwd: c });
                  i.stdout.on("data", (e) => {}),
                    i.stderr.on("data", (e) => {
                      Editor.error(`${e}`);
                    }),
                    i.on("close", (r) => {
                      var i = _.join(
                        c,
                        "dist",
                        s.package + (g ? "." : ".signed.") + "rpk"
                      );
                      if (!E.existsSync(i))
                        return (
                          e.reply(
                            new Error(Editor.T("oppo-runtime.rpk_install_fail"))
                          ),
                          void 0
                        );
                      Editor.log(
                        Editor.T("oppo-runtime.rpk_install_success") + i
                      ),
                        w(),
                        e && e.reply(),
                        q();
                    });
                })(e),
                void 0
              );
            Editor.log(Editor.T("oppo-runtime.building_subpack_rpk")),
              (function (e) {
                var r = [x(), "subpack", "--no-build-js"];
                g || r.push("release");
                var i = b("node", r, { env: k, cwd: c });
                i.stdout.on("data", (e) => {}),
                  i.stderr.on("data", (e) => {
                    Editor.error(`${e}`);
                  }),
                  i.on("close", (r) => {
                    var i = _.join(
                      c,
                      "dist",
                      s.package + (g ? "." : ".signed.") + "rpk"
                    );
                    if (!E.existsSync(i))
                      return (
                        e.reply(
                          new Error(
                            Editor.T("oppo-runtime.build_subpack_rpk_error")
                          )
                        ),
                        void 0
                      );
                    var i = _.join(
                      c,
                      "dist",
                      s.package + (g ? "." : ".signed.") + "rpk"
                    );
                    Editor.log(
                      Editor.T("oppo-runtime.build_subpack_rpk_complet") + i
                    ),
                      w(),
                      e.reply(),
                      q();
                  });
              })(e);
          })(r);
      }));
}
function w() {
  var e = _.join(p, "remote"),
    r = _.join(c, "remote");
  "" !== s.tinyPackageServer &&
    E.existsSync(e) &&
    (E.emptyDirSync(r), E.copySync(e, r)),
    E.existsSync(p) && E.removeSync(p);
}
function q() {
  let e = {
    resUrl: s.tinyPackageServer,
    orientation: s.deviceOrientation,
    projectName: s.name,
  };
  Editor.Ipc.sendToMain("builder:notify-build-result", v, e),
    !0 === s.useDebugKey ||
      s.package.indexOf("test") > -1 ||
      s.name.indexOf("test") > -1 ||
      !0 === f ||
      Editor.Metrics.trackEvent("Project", "BetaPlatforms", "oppo-runtime", {
        packageName: s.package,
        appName: s.name,
        version: s.versionName,
        orientation: s.deviceOrientation,
      });
}
module.exports = {
  name: Editor.T("oppo-runtime.platform_name"),
  platform: "quickgame",
  extends: "runtime",
  buttons: [Editor.Builder.DefaultButtons.Build],
  messages: {
    "script-build-finished": function (e, i) {
      let n = Editor.Profile.load(r);
      (i.settings.server = n.get("tinyPackageServer") || ""), e.reply();
    },
    "build-finished": function (e, i) {
      v = i;
      var n = Editor.Profile.load(r),
        o = (s = n.getSelfData()).package,
        t = s.name,
        a = s.versionName,
        p = s.versionCode,
        c = s.minPlatformVersion;
      (y = s.showNpmPath),
        (m = s.privatePath),
        (l = s.certificatePath),
        (g = s.useDebugKey),
        (u = s.icon),
        (f = i.debug),
        (sendStatisticsSourceMaps = i.sourceMaps);
      var d = !0,
        j = [],
        b = "";
      if (
        ([
          { name: Editor.T("oppo-runtime.package"), value: o },
          { name: Editor.T("oppo-runtime.name"), value: t },
          { name: Editor.T("oppo-runtime.desktop_icon"), value: u },
          { name: Editor.T("oppo-runtime.version_name"), value: a },
          { name: Editor.T("oppo-runtime.version_number"), value: p },
          { name: Editor.T("oppo-runtime.support_min_platform"), value: c },
        ].forEach(function (e) {
          e.value || ((d = !1), j.push(e.name));
        }),
        d || (b += j.join("、") + Editor.T("oppo-runtime.not_empty")),
        u &&
          (E.existsSync(u) ||
            ((d = !1), (b += u + Editor.T("oppo-runtime.icon_not_exist")))),
        g ||
          ("" === m
            ? ((d = !1), (b += Editor.T("oppo-runtime.private_pem_path_error")))
            : E.existsSync(m) ||
              ((d = !1),
              (b += `${m}` + Editor.T("oppo-runtime.signature_not_exist"))),
          "" === l
            ? ((d = !1),
              (b += Editor.T("oppo-runtime.certificate_pem_path_error")))
            : E.existsSync(l) ||
              ((d = !1),
              (b += `${l}` + Editor.T("oppo-runtime.signature_not_exist")))),
        o.match(/^[a-zA-Z]+[0-9a-zA-Z_]*(\.[a-zA-Z]+[0-9a-zA-Z_]*)*$/) ||
          ((d = !1), (b += Editor.T("oppo-runtime.package_name_error"))),
        !d)
      )
        return e.reply(new Error(b)), void 0;
      E.existsSync(_.join(i.dest, "remote")) &&
        "" === s.tinyPackageServer &&
        Editor.warn(Editor.T("oppo-runtime.had_set_remote_without_tiny_mode")),
        P(e, i);
    },
  },
  md5: {
    globalIgnore: function () {
      return [/.*/];
    },
  },
  beforeFinish: function (e) {
    E.copySync(_.join(T("res"), a), _.join(e.dest, a));
  },
  buildStart: function (e) {
    let i = Editor.Profile.load(r);
    (e.startSceneAssetBundle = i.get("packFirstScreenRes") || !1),
      (e.separateEngineMode = (!e.debug && i.get("separateEngineMode")) || !1);
  },
  delPattern: function (e) {
    let r = e.dest;
    return [_.join(r, "**/*")];
  },
  settings: Editor.url("packages://oppo-runtime/build-ui.js"),
};
