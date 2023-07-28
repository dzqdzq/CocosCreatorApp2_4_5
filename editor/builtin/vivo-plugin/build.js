const e = "project://vivo-runtime.json";
const i = "minigame.config.js";
const n = "game.js";
const t = "boot.js";
const o = "manifest.json";
const r = "qgame-adapter.js";
const a = "cocos-library";
const s = "7d8bb580016b6a2fb89d902deda0d3a4";
const c = "src";
const l = "sign";
const d = "engine";
let u;
let m;
let p;
let v = require("child_process").spawn;
let f = require("path");
let g = require("fs-extra");
let j = require(Editor.url("packages://vivo-runtime/lib/cli"));
let y = "";
var E;
let S;
let _;
let b;
let h;
let P;
let k;
let T;
function x(e) {
  let i = Editor.url("packages://runtime-adapters/platforms/vivo");
  return void 0 === e ? i : f.join(i, e);
}
function w(e) {
  let i = Editor.url("packages://runtime-adapters/common/res");
  return void 0 === e ? i : f.join(i, e);
}
function D(e, i, n) {
  g.readdirSync(e).forEach(function (t) {
    let o = f.join(e, t);
    let r = g.statSync(o);
    if (r && r.isDirectory()) {
      D(o, i);
    } else {
      if (".js" !== f.extname(o)) {
        return;
      }
      let e = o.slice(i.length + 1, o.length);
      let t = f.basename(o);
      let r = true;
      if (void 0 !== n && n instanceof Array) {
        for (let e = 0; e < n.length; e++) {
          r = true;
          if ((t === n[e])) {
            r = false;
            break;
          }
        }
      }
      if (!r) {
        return;
      }
      let a = (e = e.replace(/\\/g, "/")).replace("engine/", "");
      let s = {};
      s.module_name = a;
      s.module_path = a;
      s.module_from = e;
      y += JSON.stringify(s) + ",\n";
    }
  });
}
function q() {
  let e = {
    package: u.package,
    name: u.name,
    icon: `/image/${f.parse(p).base}`,
    versionName: u.versionName,
    versionCode: u.versionCode,
    minPlatformVersion: u.minPlatformVersion,
    deviceOrientation: u.deviceOrientation,
    type: "game",
    config: { logLevel: u.logLevel },
    display: {},
  };

  if (true === u.separateEngineMode) {
    e.plugins = {
        "cocos-library": {
          provider: s,
          version: CocosEngine,
          path: "cocos-library",
        },
      };
  }

  e.subpackages = (function () {
    let e = [];
    let i = [];
    for (var n = 0, t = P.bundles.length; n < t; n++) {
      var o = P.bundles[n];
      if ("subpackage" !== o.compressionType) {
        continue;
      }
      let t = o.name;

      if (!i.includes(t)) {
        i.push(t);
        e.push({ name: "usr_" + t, root: t + "/" });
      }
    }

    if (0 === e.length) {
      e = void 0;
    }

    return e;
  })();

  g.writeJsonSync(f.join(m, c, o), e);
}
function N() {
  let e = f.join(m, c);
  g.copySync(f.join(x("res"), n), f.join(e, n));
  let i = f.join(e, "image");
  g.emptyDirSync(i);
  g.copySync(p, f.join(i, f.parse(p).base));
  q();

  (function () {
    for (let i = 0, n = P.bundles.length; i < n; i++) {
      var e = P.bundles[i];
      if ("subpackage" !== e.compressionType) {
        continue;
      }
      let n = f.join(m, "src", e.name);
      g.emptyDirSync(n);
      g.copySync(e.scriptDest, n);
      let t = "index.js";
      let o = f.join(n, t);
      let r = f.join(n, "game.js");

      if (g.existsSync(o)) {
        g.renameSync(o, r);
      }
    }
  })();
}
function $(e, i) {
  j.init(i, u.npmPath, h);
  m = i.dest;

  j.isLatestVersion(function (n, t) {
    if (true === n) {
      M(e, i);
      return;
    }
    (function (e, i) {
      Editor.log(Editor.T("vivo-runtime.download_qgame_adater"));

      j.installQGameAdapter(function (n) {
        if (n) {
          Editor.log(Editor.T("vivo-runtime.download_qgame_adater_fail"));
          M(e, i);
          return;
        }
        Editor.log(Editor.T("vivo-runtime.download_qgame_adater_success"));
        M(e, i);
      });
    })(e, i);
  });
}
function M(e, n) {
  Editor.log("Checking config file ", n.dest);
  T = j.getEnvirommentPath();
  Editor.log("Building game " + n.platform + " to " + m);
  if (true === u.separateEngineMode && !j.isSupportSeparateEngine()) {
    e.reply(new Error(Editor.T("vivo-runtime.separate_engine_dont_support")));
    return;
  }
  let o = f.join(m, c);
  let s = f.join(m, d);
  g.emptyDirSync(s);

  if (g.existsSync(o)) {
    g.moveSync(o, f.join(s, c));
  }

  var p = j.getQGameAdapterPath();

  if (!g.existsSync(p)) {
    p = f.join(x("res"), r);
  }

  g.copySync(p, f.join(s, "adapter", r));
  N();

  (function () {
    if (!_) {
      let e = f.join(m, l, "release");
      g.emptyDirSync(e);
      g.copySync(E, f.join(e, "private.pem"));
      g.copySync(S, f.join(e, "certificate.pem"));
      return;
    }
    let e = f.join(m, l, "debug");
    g.emptyDirSync(e);
    g.copySync(w("certificate.pem"), f.join(e, "certificate.pem"));
    g.copySync(w("private.pem"), f.join(e, "private.pem"));
  })();

  g.copySync(f.join(P.dest, "main.js"), f.join(m, d, c, t));

  (function () {
    if (!u.separateEngineMode) {
      return;
    }
    let e = f.join(m, a);
    let i = f.join(m, d, c, "cocos2d-runtime.js");
    let n = f.join(e, "cocos2d-runtime.js");
    let o = f.join(m, d, c, t);
    let r = f.join(e, "plugin.json");
    Editor.info(Editor.T("vivo-runtime.separate_engine_begin_hint"));
    g.emptyDirSync(e);
    g.copySync(i, n);
    let s = { main: "cocos2d-runtime.js" };
    g.writeJSONSync(r, s);
    let l = g.readFileSync(o, "utf-8");
    if (l.indexOf("require('src/cocos2d-runtime.js');") > -1) {
      let e =
        "if (window.requirePlugin) {\n\t\trequirePlugin('cocos-library/cocos2d-runtime.js');\n\t\t} else {\n\t\t\trequire('cocos-library/cocos2d-runtime.js');\n\t\t}";
      l = l.replace("require('src/cocos2d-runtime.js');", e);
      g.writeFileSync(o, l);
    }
    Editor.info(Editor.T("vivo-runtime.separate_engine_end_hint"));
  })();

  (async function (e) {
    let i = require("./build-jsb-adapter");
    let n = f.join(x(), "engine", "index.js");
    let t = f.join(m, d, "adapter", "index.js");
    await i.build({ rootPath: n, dstPath: t, isDebug: P.debug });

    if (e) {
      e();
    }
  })(function () {
    (function () {
      let e = f.join(m, "assets");

      if (g.existsSync(e)) {
        g.copySync(e, f.join(m, "src", "assets"), {
          filter: function (e) {
            let i = f.extname(e);
            return ".js" !== i;
          },
        });
      }

      if ("" !== u.tinyPackageServer) {
        return;
      }
      let i = f.join(m, "remote");

      if (g.existsSync(i)) {
        g.copySync(i, f.join(m, "src", "remote"));
      }
    })();

    g.copySync(
      x(f.join("engine", "rename-adapter.js")),
      f.join(m, d, "adapter", "rename-adapter.js")
    );

    (function () {
      y = "";
      D(f.join(m, "assets"), m);

      if (true === u.separateEngineMode) {
        D(f.join(m, d), m, ["cocos2d-runtime.js"]);
        D(f.join(m, a), m);
      } else {
        D(f.join(m, d), m);
      }

      (function () {
        let e = f.join(x("res"), i);
        let n = g.readFileSync(e, "utf8");
        n = n.replace("EXTERNALS_PLACEHOLDER", y);
        g.writeFileSync(f.join(m, i), n);
      })();
    })();

    O();
  });
}
function O() {
  Editor.log(Editor.T("vivo-runtime.rpk_installing"));
  var e = ["run"];

  if (_) {
    e.push("build");
  } else {
    e.push("release");
  }

  let i = "win32" === process.platform ? "npm.cmd" : "npm";
  let n = v(i, e, { env: T, cwd: m });
  n.stdout.on("data", (e) => {});

  n.stderr.on("data", (e) => {
    Editor.error(`${e}`);
  });

  n.on("close", (e) => {
    let i = f.join(m, "dist", u.package + (_ ? "." : ".signed.") + "rpk");
    if (!g.existsSync(i)) {
      k.reply(new Error(Editor.T("vivo-runtime.rpk_install_fail")));
      return;
    }
    Editor.log(Editor.T("vivo-runtime.rpk_install_success") + i);
    k.reply();

    (function () {
      let e = {
        resUrl: u.tinyPackageServer,
        orientation: u.deviceOrientation,
        projectName: u.name,
      };
      Editor.Ipc.sendToMain("builder:notify-build-result", P, e);
      if (true === u.useDebugKey ||
        u.package.indexOf("test") > -1 ||
        u.name.indexOf("test") > -1 ||
        true === b) {
        return;
      }
      Editor.Metrics.trackEvent(
        "Project",
        "BetaPlatforms",
        "vivo-runtime",
        {
          packageName: u.package,
          appName: u.name,
          version: u.versionName,
          orientation: u.deviceOrientation,
        }
      );
    })();
  });
}

module.exports = {
  name: Editor.T("vivo-runtime.platform_name"),
  platform: "qgame",
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
    "build-start": function (i, n) {
      let t = Editor.Profile.load(e).getSelfData();
      j.init(n, t.npmPath, t.showNpmPath);
      if (false === j.isInstallNodeJs(i, t.npmPath)) {
        return;
      }
      if (false === j.isInstallVivoMinigameTool()) {
        i.reply(
          new Error(
            "please install tools: npm install -g @vivo-minigame/cli@latest"
          )
        );

        return;
      }
      let o = j.isCliProject();
      if (false === j.isInitVivoProject() || false === o) {
        if (false === o) {
          g.emptyDirSync(n.dest);
        }

        j.initVivoProject(function (e) {
          if (e) {
            Editor.log("init  game project failed");
            return;
          }
          g.emptyDirSync(f.join(n.dest, "src"));
          i.reply();
        });

        return;
      }
      i.reply();
    },
    "build-finished": function (i, n) {
      k = i;
      P = n;
      let t = (u = Editor.Profile.load(e).getSelfData()).package;
      let o = u.name;
      let r = u.icon;
      let a = u.versionName;
      let s = u.versionCode;
      let c = u.minPlatformVersion;
      h = u.showNpmPath;
      b = n.debug;
      sendStatisticsSourceMaps = n.sourceMaps;
      p = r || "";
      p = r.trim();
      E = u.privatePath || "";
      S = u.certificatePath || "";
      _ = u.useDebugKey;
      let l = true;
      let d = [];
      let m = "";

      [
          { name: Editor.T("vivo-runtime.package"), value: t },
          { name: Editor.T("vivo-runtime.name"), value: o },
          { name: Editor.T("vivo-runtime.desktop_icon"), value: r },
          { name: Editor.T("vivo-runtime.version_name"), value: a },
          { name: Editor.T("vivo-runtime.version_number"), value: s },
          { name: Editor.T("vivo-runtime.support_min_platform"), value: c },
        ].forEach(function (e) {
        if (!e.value) {
          l = false;
          d.push(e.name);
        }
      });

      if (!l) {
        m += d.join("、") + Editor.T("vivo-runtime.not_empty");
      }

      if (r) {
        if (!g.existsSync(p)) {
          l = false;
          m += r + Editor.T("vivo-runtime.icon_not_exist");
        }
      }

      if (!_) {
        if ("" === E) {
          l = false;
          m += Editor.T("vivo-runtime.select_private_pem_path");
        } else {
          if (!g.existsSync(E)) {
            l = false;
            m += `${E} ` + Editor.T("vivo-runtime.signature_not_exist");
          }
        }

        if ("" === S) {
          l = false;
          m += Editor.T("vivo-runtime.select_certificate_pem_path");
        } else {
          if (!g.existsSync(S)) {
            l = false;
            m += `${S}` + Editor.T("vivo-runtime.signature_not_exist");
          }
        }
      }

      if (!l) {
        k.reply(new Error(m));
        return;
      }

      if (g.existsSync(f.join(n.dest, "remote")) &&
        "" === u.tinyPackageServer) {
        Editor.warn(Editor.T("vivo-runtime.had_set_remote_without_tiny_mode"));
      }

      $(k, n);
    },
    play: (e, i) => {
      Editor.Panel.open("vivo-runtime.qrcode", i);
    },
  },
  delPattern: function (e) {
    let i = e.dest;
    return [
      f.join(i, "**/*"),
      `!${f.join(i, ".eslintrc.json")}`,
      `!${f.join(i, ".npmignore")}`,
      `!${f.join(i, "babel.config.js")}`,
      `!${f.join(i, "minigame.config.js")}`,
      `!${f.join(i, "package.json")}`,
      `!${f.join(i, "package-lock.json")}`,
      `!${f.join(i, "node_modules")}`,
      `!${f.join(i, "node_modules", "**/*")}`,
    ];
  },
  md5: {
    globalIgnore: function () {
      return [/.*/];
    },
  },
  beforeFinish: function (e) {
    g.copySync(f.join(x("res"), t), f.join(e.dest, "main.js"));
  },
  buildStart: function (i) {
    let n = Editor.Profile.load(e);
    i.startSceneAssetBundle = n.get("packFirstScreenRes") || false;
    i.separateEngineMode = n.get("separateEngineMode") || false;
  },
  settings: Editor.url("packages://vivo-runtime/build-ui.js"),
};
