const e = require("fire-fs"),
  t = require("events"),
  r = require("async"),
  i = require("winston"),
  { promisify: o } = require("util");
var a = require("fire-path");
const s = require("electron").ipcMain,
  l = require("../../core/gulp-build"),
  n = require(Editor.url("app://editor/share/build-utils")),
  d = require("../../share/build-platforms"),
  c = require("./platformChecker");
var u = Object.assign(new t(), {
  DefaultButtons: { Build: 1, Compile: 2, Play: 3, Upload: 4 },
  doCustomProcess(e, t, r, i) {
    console.log(`Builder: do custom process [${e}]`),
      ((t = Object.assign({}, t)).bundles = r),
      (async () => {
        var r = this.simpleBuildTargets[t.actualPlatform];
        r &&
          r.messages[e] &&
          (await new Promise((i, o) => {
            Editor.Ipc.sendToMain(
              `${r.package}:${e}`,
              t,
              (e) => {
                e ? o(e) : i();
              },
              -1
            );
          }));
        var i = u.listeners(e);
        if (i)
          for (var a = 0; a < i.length; ++a) {
            let e = i[a];
            await o(e)(t);
          }
      })().then(i, (e) => {
        i(e);
      });
  },
  _getOptionsFromCommand(t) {
    let r = Editor.Profile.load("local://builder.json"),
      i = Editor.Profile.load("project://builder.json"),
      o = n.getOptions(i, r),
      a = Editor.Profile.load("project://project.json");
    Object.assign(o, {
      excludedModules: a.get("excluded-modules"),
      autoCompile: !1,
    });
    let s = {};
    if ("string" == typeof t) {
      let e = t.split(";");
      for (let t = 0, r = e.length; t < r; t++) {
        let r = e[t].split("=");
        if (!r[1]) continue;
        let i = r[0];
        if ("boolean" == typeof o[i])
          try {
            r[1] = JSON.parse(r[1]);
          } catch (e) {
            Editor.error(e);
          }
        else if ("number" == typeof o[i])
          try {
            r[1] = Number.parseFloat(r[1]);
          } catch (e) {
            Editor.error(e);
          }
        else if (Array.isArray(o[i])) {
          let e = `{"value": ${r[1]}}`.replace(/'/g, '"');
          try {
            let t = JSON.parse(e);
            r[1] = t.value;
          } catch (e) {
            Editor.error(e);
          }
        } else if ("object" == typeof o[i]) {
          let e = r[1].replace(/'/g, '"');
          try {
            let t = JSON.parse(e);
            r[1] = Object.assign({}, o[i], t);
          } catch (e) {
            Editor.error(e);
          }
        }
        s[i] = r[1];
      }
    }
    s.platform &&
      (c.check(s.platform),
      (s.platform = c.transform(s.platform)),
      (s.actualPlatform = s.platform),
      (s.platform = this.actualPlatform2Platform(s.actualPlatform)));
    let l = s.configPath,
      d = {};
    if (l && e.existsSync(l))
      try {
        d = JSON.parse(e.readFileSync(l, "utf8"));
      } catch (e) {
        Editor.error(`Parse ${l} failed. ` + e);
      }
    const u = Editor.require("app://editor/share/build-platforms");
    let p = s.platform || d.platform || o.platform;
    if (p) {
      u[p].isNative && (o.inlineSpriteFrames = o.inlineSpriteFrames_native);
    }
    let m = Object.assign({}, o, d, s);
    return m.buildPath
      ? (n.updateOptions(m), { options: m })
      : { error: new Error("Please specify the [buildPath] option") };
  },
  actualPlatform2Platform(e) {
    let t = Editor.Builder.simpleBuildTargets[e];
    return (t && t.extends) || e;
  },
  _registerCommandProgressBar() {
    const e = require("electron");
    var t = new (require("progress"))("[  :state [:bar] :percent :etas  ]", {
      incomplete: " ",
      width: 40,
      total: 100,
    });
    let r = 0;
    e.ipcMain.on("builder:state-changed", (e, i, o) => {
      t.tick(100 * (o - r), { state: i }), (r = o);
    });
  },
  build: function (e, t) {
    Editor.Ipc.sendToMain("builder:state-changed", "start", 0),
      s.emit("builder:build-start");
    let o = d[e.platform].isNative,
      a = "runtime" === e.platform;
    o && !a && (e.md5Cache = e.nativeMd5Cache), delete e.nativeMd5Cache;
    var c = e.scenes,
      p = c.indexOf(e.startScene);
    if (-1 === p) {
      var m = "Failed to find start scene in scene list.";
      return (
        Editor.error("Build Failed: %s", m),
        Editor.Ipc.sendToMain("builder:state-changed", "error", 1, m),
        void 0
      );
    }
    if (0 !== p) {
      var f = c[0];
      (c[0] = c[p]), (c[p] = f);
    }
    var g = Object.assign({}, e, {
      project: Editor.Project.path,
      projectName: e.title,
      scenes: c,
      debugBuildWorker: u.debugWorker,
    });
    i.normal(
      `Start building with options : ${JSON.stringify(
        n.getCommonOptions(g),
        null,
        2
      )}`
    ),
      r.waterfall(
        [
          (e) => {
            u.doCustomProcess("build-start", n.getCommonOptions(g), null, e);
          },
          (e) => {
            l.startWithArgs(g, e);
          },
          (e, t) => {
            if (
              (Editor.Ipc.sendToMain(
                "builder:state-changed",
                "custom-build-process",
                0.99
              ),
              u.doCustomProcess("build-finished", n.getCommonOptions(g), e, t),
              !this.simpleBuildTargets[g.actualPlatform])
            ) {
              let t = "",
                r = "",
                i = "",
                o = g.orientation,
                a = g[g.actualPlatform];
              a &&
                (a.packageName && (t = a.packageName),
                a.REMOTE_SERVER_ROOT && (i = a.REMOTE_SERVER_ROOT),
                o.landscapeLeft || o.landscapeRight
                  ? (o = "landscape")
                  : (o.portrait || o.upsideDown) && (o = "portrait")),
                (g.buildResults = e),
                Editor.Ipc.sendToMain("builder:notify-build-result", g, {
                  packageName: t,
                  id: r,
                  resUrl: i,
                  orientation: o,
                });
            }
          },
        ],
        (r) => {
          r
            ? (Editor.error("Build Failed: %s", r.stack || r),
              Editor.Ipc.sendToMain("builder:state-changed", "error", 1, r))
            : (Editor.log(
                e.platform.toLocaleLowerCase() ===
                  e.actualPlatform.toLocaleLowerCase()
                  ? 'Built to "' + e.dest + '" successfully'
                  : "Built " +
                      this._getOutputDir(e.actualPlatform) +
                      " successfully"
              ),
              Editor.Ipc.sendToMain("builder:state-changed", "finish", 1)),
            t && t(r);
        }
      );
  },
  _getOutputDir(e) {
    let t = Editor.Builder.simpleBuildTargets[e];
    return (t && t.output) || e;
  },
  buildCommand: function (e, t) {
    let i = this._getOptionsFromCommand(e);
    if (i.error) return t(i.error);
    let o = i.options;
    this._registerCommandProgressBar(),
      Editor.assetdb.queryAssets(null, "scene", (e, i) => {
        (i = (i = i.filter((e) => -1 === o.excludeScenes.indexOf(e.uuid))).map(
          (e) => e.uuid
        )),
          (o.scenes = i);
        let a = !!i.find(function (e) {
          return e === o.startScene;
        });
        (o.startScene && a) ||
          (i.length > 0 ? (o.startScene = i[0]) : (o.startScene = "")),
          r.series(
            [
              (e) => {
                console.log(`Start to build platform [${o.platform}]`),
                  this.build(o, e);
              },
              (e) => {
                let t = d[o.platform];
                if (!1 === o.autoCompile || !t.isNative || !t.useTemplate)
                  return e();
                console.log(`Start to compile platform [${o.platform}]`),
                  Editor.Ipc.sendToMain("builder:state-changed", "start", 0),
                  Editor.NativeUtils.compile(o, function (t) {
                    if (t)
                      return (
                        Editor.Ipc.sendToMain(
                          "builder:state-changed",
                          "error",
                          1
                        ),
                        e(t)
                      );
                    Editor.Ipc.sendToMain("builder:state-changed", "finish", 1),
                      e();
                  });
              },
            ],
            (e) => {
              t(e);
            }
          );
      });
  },
  compile(e, t) {
    let i = e.platform;
    if (
      "ios" === i ||
      "android" === i ||
      "mac" === i ||
      "win32" === i ||
      "android-instant" === i
    )
      return (
        Editor.Ipc.sendToMain("builder:state-changed", "start", 0),
        r.series(
          [
            (t) => {
              Editor.NativeUtils.compile(e, t);
            },
            (t) => {
              Editor.Ipc.sendToMain(
                "builder:state-changed",
                "custom-compile-process",
                0.99
              ),
                u.doCustomProcess(
                  "compile-finished",
                  n.getCommonOptions(e),
                  null,
                  t
                );
            },
          ],
          (e) => {
            if (e)
              return (
                Editor.Ipc.sendToMain("builder:state-changed", "error", 1),
                Editor.failed(e),
                t && t(e),
                void 0
              );
            t && t(),
              Editor.Ipc.sendToMain("builder:state-changed", "finish", 1);
          }
        ),
        void 0
      );
    t && t(new Error(`Not support compile platform [${i}]`));
  },
  compileCommand(e, t) {
    let r = this._getOptionsFromCommand(e);
    if (r.error) return t(r.error);
    let o = r.options;
    i.normal(
      `Start compiling with options : ${JSON.stringify(
        n.getCommonOptions(o),
        null,
        2
      )}`
    ),
      this._registerCommandProgressBar(),
      this.compile(o, t);
  },
  debugWorker: !1,
  buildTemplates: Object.create(null),
  simpleBuildTargets: Object.create(null),
});
s.on("builder:notify-build-result", async (t, r, i) => {
  let l = !1,
    n = () => {
      l = !0;
    };
  s.once("builder:build-start", n);
  let d = r.buildResults;
  const c = require("get-folder-size");
  let u = ["assets", "remote", "res", "src", "subpackages"];
  try {
    let t,
      m = await o(Editor.assetdb.queryAssets.bind(Editor.assetdb))(
        "db://**/*",
        ["javascript", "typescript"]
      ),
      f = 0;
    (u = u.filter((t) => e.existsSync(a.join(r.dest, t)))),
      (await Promise.all(u.map((e) => o(c)(a.join(r.dest, e))))).forEach(
        (e) => {
          f += e;
        }
      ),
      (f = (f / 1024).toFixed(0));
    var p = Editor.url("unpack://engine/modules.json");
    let g = e
      .readJsonSync(p)
      .filter((e) => !r.excludedModules.includes(e.name))
      .map((e) => e.name);
    t = g.join(",");
    let b = !!g.find((e) => e.includes("3D")),
      h = 0;
    d.forEach((e) => {
      h += Object.keys(e.buildResults._buildAssets).length;
    }),
      !l &&
        Editor.CocosAnalytics.trackCocosEvent("ProjectComplete", {
          store: r.actualPlatform,
          projectId: Editor.Project.id,
          scenes: r.scenes.length + "",
          scripts: m.length + "",
          resources: h + "",
          moduleConf: t || "",
          size: f,
          projectNm: i.projectName || r.projectName,
          packageName: i.packageName || "",
          orientation: i.orientation || "",
          resUrl: i.resUrl || "",
          appd: i.id || "",
          dimension: b ? 2 : 1,
        }),
      s.off("builder:build-start", n);
  } catch (e) {}
}),
  (module.exports = u);
