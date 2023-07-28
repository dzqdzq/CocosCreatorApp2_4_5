const e = "project://huawei-runtime.json";
const i = "manifest.json";
Editor.url("packages://runtime-adapters/package/index.js");
var n;
var t;
var r;
var a;
var o;
var s;
var u;
var d;
var c;
var m;
var p;
var l;
var f;
var g = require("path");
var h = require("fs-extra");
var y = require("fix-path");
var v = "game.js";
var E = {};
var _ = false;
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
  var r = g.join(e.dest, "assets");
  var o = g.join(e.dest, "remote");
  var u = g.join(e.dest, "src");
  var d = g.join(e.dest, "jsb-adapter");
  var c = g.join(e.dest, "subpackages");
  var p = g.join(t, "jsb-adapter");
  var l = g.join(t, "assets");
  var y = g.join(t, "remote");
  var E = g.join(t, "src");
  var _ = g.join(t, "subpackages");
  h.copySync(d, p);

  if (false === ("" !== n.tinyPackageServer) && h.existsSync(o)) {
    h.copySync(o, y);
  }

  h.copySync(r, l);
  h.copySync(u, E);

  if (h.existsSync(c)) {
    h.copySync(c, _);
  }

  (function (e) {
    var i = g.join(e, "image");
    h.ensureDirSync(i);
    h.writeFileSync(g.join(i, g.parse(a).base), h.readFileSync(a));
  })(t);

  (function (e) {
    h.copySync(g.join(f.dest, "main.js"), g.join(e, v));
  })(t);

  (function (e) {
    var t = g.join(e, i);
    var r = n.package;
    var o = n.name;
    var u = n.versionName;
    var d = n.versionCode;
    var c = n.minPlatformVersion;
    var p = n.deviceOrientation;
    var l = n.logLevel;

    var f = {
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

    if (s) {
      f.subpackages = s;
    }

    if ((h.existsSync(m))) {
      var y;
      try {
        y = h.readJsonSync(m);

        Editor.log(
          Editor.T("huawei-runtime.custom_manifest_data"),
          JSON.stringify(y)
        );
      } catch (e) {
        Editor.log(Editor.T("huawei-runtime.custom_manifest_data_error"));
      }
      if (y) {
        for (var v in y) if ("package" !== v &&
          "appType" !== v &&
          "name" !== v &&
          "versionName" !== v &&
          "versionCode" !== v &&
          "icon" !== v &&
          "minPlatformVersion" !== v &&
          "permissions" !== v) {
          f[v] = y[v];
        }
      }
    }
    var E = {};
    var _ = {};

    if (f.config) {
      E = f.config;
    }

    if (f.display) {
      _ = f.display;
    }

    E.logLevel = l;
    _.orientation = p;
    _.fullScreen = n.fullScreen;
    f.display = _;
    var w = JSON.stringify(f);
    h.writeFileSync(t, w);
  })(t);
}
function b(e, i) {
  Editor.log("Checking config file " + i.dest);
  t = i.dest;
  r = g.join(t, "build");
  o = Editor.url("packages://runtime-adapters/package");
  i.dest;
  h.emptyDirSync(r);
  var a = g.join(t, "build");

  (function (e) {
    s = [];
    let i = [];
    for (var n = 0, t = e.bundles.length; n < t; n++) {
      var a = e.bundles[n];
      if ("subpackage" !== a.compressionType) {
        continue;
      }
      let t = a.name;
      let o = g.join(r, "assets", t);
      if (i.includes(o)) {
        continue;
      }
      i.push(o);
      let u = g.join(a.scriptDest, "index.js");

      if (h.existsSync(u)) {
        h.renameSync(u, g.join(a.scriptDest, "game.js"));
      }

      s.push({ name: t, resource: "subpackages/" + t });
    }
  })(i);

  h.emptyDirSync(g.join(t, "dist"));

  (async function () {
    let r = require("./build-jsb-adapter");
    let s = g.join(w("engine"), "index.js");
    let u = g.join(t, "jsb-adapter", "engine", "index.js");
    await r.build({ rootPath: s, dstPath: u, isDebug: f.debug });
    S(i, a);

    (function () {
      var i = require("child_process").exec;
      var r = "win32" === process.platform ? "npm.cmd" : "npm";
      E = {};

      if (n.npmPath) {
        _ = false;

        Editor.log(
          Editor.T("huawei-runtime.custom_npm_path_config"),
          n.npmPath
        );

        if ("win32" === process.platform) {
          E.Path = n.npmPath;
        } else {
          E.PATH = n.npmPath;
        }
      } else {
        if (l) {
          Editor.log(
            Editor.T("huawei-runtime.custom_npm_path_not_config")
          );
        }

        if (!_) {
          _ = true;
          y();
        }

        E = process.env;
      }

      (function (a) {
        i(`${r} -v`, { env: E, cwd: t }, (i) => {
          if (i) {
            if (n.npmPath) {
              e.reply(
                new Error(
                  Editor.T("huawei-runtime.custom_npm_path_config_error")
                )
              );

              return;
            }
            Editor.Ipc.sendToWins("builder:events", "npmPath-show");
            if ("win32" === process.platform) {
              e.reply(
                new Error(
                  Editor.T("huawei-runtime.window_default_npm_path_error")
                )
              );

              return;
            }
            e.reply(
              new Error(
                Editor.T("huawei-runtime.mac_default_npm_path_error")
              )
            );
          } else {
            if (a) {
              a();
            }
          }
        });
      })(function () {
        if (h.existsSync(g.join(o, "node_modules"))) {
          T(e, i);
        } else {
          Editor.log(Editor.T("huawei-runtime.begin_install_npm"));

          void i(`${r} install`, { env: process.env, cwd: o }, (n) => {
            if (!n) {
              Editor.log(
                Editor.T("huawei-runtime.npm_installed_success")
              );

              T(e, i);
              return;
            }
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
  var r = g.join(t, "dist");
  var a = g.join(t, "build");
  var o = c ? j("private.pem") : u;
  var s = c ? j("certificate.pem") : d;
  var m = n.package;

  var l = `node ${Editor.url(
    "packages://runtime-adapters/package/index.js"
  )} ${a} ${r} ${m} ${o} ${s}`;

  Editor.log(Editor.T("huawei-runtime.rpk_installing"));

  i(`${l}`, { env: E, cwd: t }, (i) => {
    if (i) {
      e.reply(new Error(Editor.T("huawei-runtime.rpk_install_fail") + i));
      return;
    }
    Editor.log(Editor.T("huawei-runtime.rpk_install_success"));

    (function () {
      let e = {
        resUrl: n.tinyPackageServer,
        orientation: n.deviceOrientation,
        projectName: n.name,
      };
      Editor.Ipc.sendToMain("builder:notify-build-result", f, e);
      if (true === n.useDebugKey ||
        n.package.indexOf("test") > -1 ||
        n.name.indexOf("test") > -1 ||
        true === p) {
        return;
      }
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
    })();

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
      n.settings.server = t.get("tinyPackageServer") || "";
      i.reply();
    },
    "build-finished": function (i, t) {
      f = t;
      var r = (n = Editor.Profile.load(e).getSelfData()).package;
      var o = n.name;
      var s = n.icon;
      var y = n.versionName;
      var v = n.versionCode;
      var E = n.minPlatformVersion;
      l = n.showNpmPath;
      u = n.privatePath;
      d = n.certificatePath;
      c = n.useDebugKey;
      a = s || "";
      m = n.manifestPath;
      p = t.debug;
      sendStatisticsSourceMaps = t.sourceMaps;

      if (!m) {
        Editor.log(Editor.T("huawei-runtime.not_mainfest_data"));
      }

      var _ = true;
      var w = [];
      var j = "";

      [
          { name: Editor.T("huawei-runtime.package"), value: r },
          { name: Editor.T("huawei-runtime.name"), value: o },
          { name: Editor.T("huawei-runtime.desktop_icon"), value: s },
          { name: Editor.T("huawei-runtime.version_name"), value: y },
          { name: Editor.T("huawei-runtime.version_number"), value: v },
          { name: Editor.T("huawei-runtime.support_min_platform"), value: E },
        ].forEach(function (e) {
        if (!e.value) {
          _ = false;
          w.push(e.name);
        }
      });

      if (!_) {
        j += w.join("、") + Editor.T("huawei-runtime.not_empty");
      }

      if (s) {
        if (!h.existsSync(a)) {
          _ = false;
          j += s + Editor.T("huawei-runtime.icon_not_exist");
        }
      }

      if (!c) {
        if ("" === u) {
          _ = false;
          j += Editor.T("huawei-runtime.private_pem_path_error");
        } else {
          if (!h.existsSync(u)) {
            _ = false;
            j += `${u}` + Editor.T("huawei-runtime.signature_not_exist");
          }
        }

        if ("" === d) {
          _ = false;
          j += Editor.T("huawei-runtime.certificate_pem_path_error");
        } else {
          if (!h.existsSync(d)) {
            _ = false;
            j += `${d} ` + Editor.T("huawei-runtime.signature_not_exist");
          }
        }
      }

      if (!_) {
        i.reply(new Error(j));
        return;
      }

      if (h.existsSync(g.join(t.dest, "remote")) &&
        "" === n.tinyPackageServer) {
        Editor.warn(
          Editor.T("huawei-runtime.had_set_remote_without_tiny_mode")
        );
      }

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
    i.startSceneAssetBundle = n.get("packFirstScreenRes") || false;
  },
  delPattern: function (e) {
    let i = e.dest;
    return [g.join(i, "**/*")];
  },
  settings: Editor.url("packages://huawei-runtime/build-ui.js"),
};
