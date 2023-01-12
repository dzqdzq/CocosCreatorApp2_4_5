const e = "project://huawei-runtime.json",
  i = "manifest.json";
Editor.url("packages://runtime-adapters/package/index.js");
var n,
  t,
  r,
  a,
  o,
  s,
  u,
  d,
  c,
  m,
  p,
  l,
  f,
  g = require("path"),
  h = require("fs-extra"),
  y = require("fix-path"),
  v = "game.js",
  E = {},
  _ = !1;
function w(e) {
  let i = Editor.url("packages://runtime-adapters/platforms/huawei");
  return void 0 === e || "" === e ? i : g.join(i, e);
}
function j(e) {
  let i = Editor.url("packages://runtime-adapters/common/res");
  return void 0 === e || "" === e ? i : g.join(i, e);
}
function S(e, t) {
  h.emptyDirSync(t);
  var r = g.join(e.dest, "assets"),
    o = g.join(e.dest, "remote"),
    u = g.join(e.dest, "src"),
    d = g.join(e.dest, "jsb-adapter"),
    c = g.join(e.dest, "subpackages"),
    p = g.join(t, "jsb-adapter"),
    l = g.join(t, "assets"),
    y = g.join(t, "remote"),
    E = g.join(t, "src"),
    _ = g.join(t, "subpackages");
  h.copySync(d, p),
    !1 === ("" !== n.tinyPackageServer) && h.existsSync(o) && h.copySync(o, y),
    h.copySync(r, l),
    h.copySync(u, E),
    h.existsSync(c) && h.copySync(c, _),
    (function (e) {
      var i = g.join(e, "image");
      h.ensureDirSync(i),
        h.writeFileSync(g.join(i, g.parse(a).base), h.readFileSync(a));
    })(t),
    (function (e) {
      h.copySync(g.join(f.dest, "main.js"), g.join(e, v));
    })(t),
    (function (e) {
      var t = g.join(e, i),
        r = n.package,
        o = n.name,
        u = n.versionName,
        d = n.versionCode,
        c = n.minPlatformVersion,
        p = n.deviceOrientation,
        l = n.logLevel,
        f = {
          package: r,
          appType: "fastgame",
          name: o,
          versionName: u,
          versionCode: d,
          icon: `/image/${g.parse(a).base}`,
          minPlatformVersion: c,
          permissions: [{ origin: "*" }],
          router: {},
        };
      if ((s && (f.subpackages = s), h.existsSync(m))) {
        var y;
        try {
          (y = h.readJsonSync(m)),
            Editor.log(
              Editor.T("huawei-runtime.custom_manifest_data"),
              JSON.stringify(y)
            );
        } catch (e) {
          Editor.log(Editor.T("huawei-runtime.custom_manifest_data_error"));
        }
        if (y)
          for (var v in y)
            "package" !== v &&
              "appType" !== v &&
              "name" !== v &&
              "versionName" !== v &&
              "versionCode" !== v &&
              "icon" !== v &&
              "minPlatformVersion" !== v &&
              "permissions" !== v &&
              (f[v] = y[v]);
      }
      var E = {},
        _ = {};
      f.config && (E = f.config),
        f.display && (_ = f.display),
        (E.logLevel = l),
        (_.orientation = p),
        (_.fullScreen = n.fullScreen),
        (f.display = _);
      var w = JSON.stringify(f);
      h.writeFileSync(t, w);
    })(t);
}
function b(e, i) {
  Editor.log("Checking config file " + i.dest),
    (t = i.dest),
    (r = g.join(t, "build")),
    (o = Editor.url("packages://runtime-adapters/package")),
    i.dest,
    h.emptyDirSync(r);
  var a = g.join(t, "build");
  (function (e) {
    s = [];
    let i = [];
    for (var n = 0, t = e.bundles.length; n < t; n++) {
      var a = e.bundles[n];
      if ("subpackage" !== a.compressionType) continue;
      let t = a.name,
        o = g.join(r, "assets", t);
      if (i.includes(o)) continue;
      i.push(o);
      let u = g.join(a.scriptDest, "index.js");
      h.existsSync(u) && h.renameSync(u, g.join(a.scriptDest, "game.js")),
        s.push({ name: t, resource: "subpackages/" + t });
    }
  })(i),
    h.emptyDirSync(g.join(t, "dist")),
    (async function () {
      let r = require("./build-jsb-adapter"),
        s = g.join(w("engine"), "index.js"),
        u = g.join(t, "jsb-adapter", "engine", "index.js");
      await r.build({ rootPath: s, dstPath: u, isDebug: f.debug }),
        S(i, a),
        (function () {
          var i = require("child_process").exec,
            r = "win32" === process.platform ? "npm.cmd" : "npm";
          (E = {}),
            n.npmPath
              ? ((_ = !1),
                Editor.log(
                  Editor.T("huawei-runtime.custom_npm_path_config"),
                  n.npmPath
                ),
                "win32" === process.platform
                  ? (E.Path = n.npmPath)
                  : (E.PATH = n.npmPath))
              : (l &&
                  Editor.log(
                    Editor.T("huawei-runtime.custom_npm_path_not_config")
                  ),
                _ || ((_ = !0), y()),
                (E = process.env));
          (function (a) {
            i(`${r} -v`, { env: E, cwd: t }, (i) => {
              if (i) {
                if (n.npmPath)
                  return (
                    e.reply(
                      new Error(
                        Editor.T("huawei-runtime.custom_npm_path_config_error")
                      )
                    ),
                    void 0
                  );
                if (
                  (Editor.Ipc.sendToWins("builder:events", "npmPath-show"),
                  "win32" === process.platform)
                )
                  return (
                    e.reply(
                      new Error(
                        Editor.T("huawei-runtime.window_default_npm_path_error")
                      )
                    ),
                    void 0
                  );
                e.reply(
                  new Error(
                    Editor.T("huawei-runtime.mac_default_npm_path_error")
                  )
                );
              } else a && a();
            });
          })(function () {
            if (h.existsSync(g.join(o, "node_modules"))) T(e, i);
            else {
              Editor.log(Editor.T("huawei-runtime.begin_install_npm")),
                void i(`${r} install`, { env: process.env, cwd: o }, (n) => {
                  if (!n)
                    return (
                      Editor.log(
                        Editor.T("huawei-runtime.npm_installed_success")
                      ),
                      T(e, i),
                      void 0
                    );
                  e.reply(
                    new Error(
                      Editor.T("huawei-runtime.npm_installed_success") + n
                    )
                  );
                });
            }
          });
        })();
    })();
}
function T(e, i) {
  var r = g.join(t, "dist"),
    a = g.join(t, "build"),
    o = c ? j("private.pem") : u,
    s = c ? j("certificate.pem") : d,
    m = n.package,
    l = `node ${Editor.url(
      "packages://runtime-adapters/package/index.js"
    )} ${a} ${r} ${m} ${o} ${s}`;
  Editor.log(Editor.T("huawei-runtime.rpk_installing")),
    i(`${l}`, { env: E, cwd: t }, (i) => {
      if (i)
        return (
          e.reply(new Error(Editor.T("huawei-runtime.rpk_install_fail") + i)),
          void 0
        );
      Editor.log(Editor.T("huawei-runtime.rpk_install_success")),
        (function () {
          let e = {
            resUrl: n.tinyPackageServer,
            orientation: n.deviceOrientation,
            projectName: n.name,
          };
          if (
            (Editor.Ipc.sendToMain("builder:notify-build-result", f, e),
            !0 === n.useDebugKey ||
              n.package.indexOf("test") > -1 ||
              n.name.indexOf("test") > -1 ||
              !0 === p)
          )
            return;
          Editor.Metrics.trackEvent(
            "Project",
            "BetaPlatforms",
            "huawei-runtime",
            {
              packageName: n.package,
              appName: n.name,
              version: n.versionName,
              orientation: n.deviceOrientation,
            }
          );
        })(),
        e.reply();
    });
}
module.exports = {
  name: Editor.T("huawei-runtime.platform_name"),
  platform: "huawei",
  extends: "runtime",
  buttons: [
    Editor.Builder.DefaultButtons.Build,
    { label: Editor.T("BUILDER.play"), message: "play" },
  ],
  messages: {
    "script-build-finished": function (i, n) {
      let t = Editor.Profile.load(e);
      (n.settings.server = t.get("tinyPackageServer") || ""), i.reply();
    },
    "build-finished": function (i, t) {
      f = t;
      var r = (n = Editor.Profile.load(e).getSelfData()).package,
        o = n.name,
        s = n.icon,
        y = n.versionName,
        v = n.versionCode,
        E = n.minPlatformVersion;
      (l = n.showNpmPath),
        (u = n.privatePath),
        (d = n.certificatePath),
        (c = n.useDebugKey),
        (a = s || ""),
        (m = n.manifestPath),
        (p = t.debug),
        (sendStatisticsSourceMaps = t.sourceMaps),
        m || Editor.log(Editor.T("huawei-runtime.not_mainfest_data"));
      var _ = !0,
        w = [],
        j = "";
      if (
        ([
          { name: Editor.T("huawei-runtime.package"), value: r },
          { name: Editor.T("huawei-runtime.name"), value: o },
          { name: Editor.T("huawei-runtime.desktop_icon"), value: s },
          { name: Editor.T("huawei-runtime.version_name"), value: y },
          { name: Editor.T("huawei-runtime.version_number"), value: v },
          { name: Editor.T("huawei-runtime.support_min_platform"), value: E },
        ].forEach(function (e) {
          e.value || ((_ = !1), w.push(e.name));
        }),
        _ || (j += w.join("、") + Editor.T("huawei-runtime.not_empty")),
        s &&
          (h.existsSync(a) ||
            ((_ = !1), (j += s + Editor.T("huawei-runtime.icon_not_exist")))),
        c ||
          ("" === u
            ? ((_ = !1),
              (j += Editor.T("huawei-runtime.private_pem_path_error")))
            : h.existsSync(u) ||
              ((_ = !1),
              (j += `${u}` + Editor.T("huawei-runtime.signature_not_exist"))),
          "" === d
            ? ((_ = !1),
              (j += Editor.T("huawei-runtime.certificate_pem_path_error")))
            : h.existsSync(d) ||
              ((_ = !1),
              (j += `${d} ` + Editor.T("huawei-runtime.signature_not_exist")))),
        !_)
      )
        return i.reply(new Error(j)), void 0;
      h.existsSync(g.join(t.dest, "remote")) &&
        "" === n.tinyPackageServer &&
        Editor.warn(
          Editor.T("huawei-runtime.had_set_remote_without_tiny_mode")
        ),
        b(i, t);
    },
    play: (e, i) => {
      Editor.Panel.open("runtime-dev-tools", i);
    },
  },
  md5: {
    globalIgnore: function () {
      return [/.*/];
    },
  },
  beforeFinish: function (e) {
    h.copySync(g.join(w("res"), "main.js"), g.join(e.dest, "main.js"));
  },
  buildStart: function (i) {
    let n = Editor.Profile.load(e);
    i.startSceneAssetBundle = n.get("packFirstScreenRes") || !1;
  },
  delPattern: function (e) {
    let i = e.dest;
    return [g.join(i, "**/*")];
  },
  settings: Editor.url("packages://huawei-runtime/build-ui.js"),
};
