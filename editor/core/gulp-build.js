const e = require("fire-path");
const t = require("fire-url");
const i = require("fire-fs");
const { format: r, promisify: s } = require("util");
const n = require("electron").ipcMain;
const globby = require("globby");
const a = require("gulp").Gulp;
const l = require("gulp-rename");
const u = require("gulp-util");
const c = require("event-stream");
const d = require("stream-combiner2");
const p = require("gulp-rev-all");
const m = require("gulp-rev-delete-original");
const f = require("del");
const b = require("async");
const g = require("lodash");
const h = require("winston");
const v = require("crypto");
const j = require("./compiler");
const y = require("./native-utils");
const E = require("../share/build-platforms");
const w = require("./build-results");
const S = Editor.require("app://editor/share/3d-physics-build-utils");
const k = Editor.require("app://editor/share/bundle-utils");
const x = "build-platform_";
const M = "db://";
let settingStr = "window._CCSettings";
const C = 5;
const T = ["SubContext", "Canvas Renderer"];
const q = "default";
const merge_all_json = "merge_all_json";
const U = "subpackage";
const B = "zip";
function D(t) {
  return c.through(function (i) {
    if (".html" === e.extname(i.path)) {
      h.normal("Generating html from " + i.path);
      var r = t.webOrientation;

      if ("auto" === r) {
        r = "";
      }

      const webDebuggerSrc = Editor.url("app://node_modules/vConsole/dist/vconsole.min.js");
      const o = `<script src="${e.basename(webDebuggerSrc)}"><\/script>`;
      var s = {
        file: i,
        project: t.projectName || e.basename(t.project),
        previewWidth: t.previewWidth,
        previewHeight: t.previewHeight,
        orientation: r,
        webDebugger: t.embedWebDebugger ? o : "",
      };
      i.contents = new Buffer(u.template(i.contents, s));
    } else {
      if ("main.js" === e.basename(i.path)) {
        h.normal("Generating main.js from " + i.path);
        let e = i.contents.toString();
        s = {
          file: i,
          renderMode: t.renderMode,
          engineCode: "",
          projectCode: "",
        };
        i.contents = new Buffer(u.template(e, s));
      }
    }
    this.emit("data", i);
  });
}
function getSettingFileCon(e, t) {
  var i = JSON.stringify(e, null, t ? 4 : 0).replace(
    /"([A-Za-z_$][0-9A-Za-z_$]*)":/gm,
    "$1:"
  );
  return (i = t ? `${settingStr} = ${i};\n` : `${settingStr}=${i};`);
}
async function $(e, t, ...i) {
  let r = F(t.actualPlatform, e);
  if (r) {
    try {
      return await r(t, ...i);
    } catch (e) {
      Editor.error(e);
    }
  }
}
function F(e, t) {
  let i = Editor.Builder.simpleBuildTargets[e];
  return (i && i[t]) || null;
}
function P(e, i) {
  var r = e.root;
  var s = e.buildResults;
  var n = {};
  var o = e.sceneList;
  var debug22 = e.debug;
  var l = !e.preview;
  var u = Editor.assetdb;
  var c = Editor.assets;
  var compressUuid = Editor.Utils.UuidUtils.compressUuid;
  function p(e, i) {
    if (!e) {
      console.error("can not get url to build: " + i);
      return null;
    }
    if (!e.startsWith(M)) {
      console.error("unknown url to build: " + e);
      return null;
    }
    var r = u.isSubAssetByUuid(i);
    var s = e;

    if (r) {
      s = t.dirname(e);
    }

    var n = t.extname(s);

    if (n) {
      s = s.slice(0, -n.length);
    }

    return { uuid: i, relative: s, isSubAsset: r };
  }
  console.time("queryAssets");

  (function (e, t) {
    if (e) {
      for (
        var i = e.getAssetUuids(), s = [], n = 0, o = i.length;
        n < o;
        n++
      ) {
        var a = i[n];
        var l = u.uuidToUrl(a);
        var d = u.assetInfoByUuid(a);
        if (d) {
          var m = d.type;
          if (m) {
            var f = p(l, a);
            if (!f) {
              continue;
            }
            var b = c[m];
            f.ctor = b || cc.Asset;
            f.url = l;
            f.redirect = e._buildAssets[a].redirect;
            s.push(f);
          } else {
            console.error("Can not get asset type of " + a);
          }
        } else {
          s.push({ uuid: a, url: "", relative: "", ctor: cc.Asset });
        }
      }
      t(null, s);
    } else {
      if (!r) {
        return t(null, []);
      }
      console.time("queryMetas");

      u.queryMetas(r + "/**/*", "", function (e, i) {
        console.timeEnd("queryMetas");
        for (var r = [], s = 0, n = i.length; s < n; s++) {
          var o = i[s];
          var a = o.assetType();
          if ("folder" !== a && "javascript" !== a && "typescript" !== a) {
            var l = o.uuid;
            var d = u.uuidToUrl(l);
            var m = p(d, l);
            if (m) {
              var f = c[a];
              m.ctor = f || cc.Asset;
              m.url = d;
              r.push(m);
            }
          }
        }
        t(e, r);
      });
    }
  })(s, function (t, u) {
    console.timeEnd("queryAssets");
    if (t) {
      return i(t);
    }
    var c = [];
    var p = [];
    var m = [];

    u.forEach((e) => {
      var t = e.uuid;

      if (e.ctor === cc.SceneAsset && -1 === o.indexOf(t)) {
        o.push(t);
      }

      if (l) {
        t = compressUuid(t, true);
      }

      c.push(t);
      if (
        (e.redirect)
      ) {
        p.push(t);
        var i = m.indexOf(e.redirect);

        if (-1 === i) {
          i = m.length;
          m.push(e.redirect);
        }

        p.push(i);
      }
    });

    console.time("writeAssets");

    (function (e) {
      var types;
      var paths = (n.paths = {});

      if (!debug22) {
        types = n.types = [];
      }

      var s = {};
      e = g.sortBy(e, "relative");
      for (var o = Object.create(null), u = 0, c = e.length; u < c; u++) {
        var p = e[u];
        if (!p.ctor) {
          Editor.error(
            `Failed to get ctor of '${p.relative}'(${p.uuid}).\n` +
              "Please ensure the asset class is loaded in the main process of the editor."
          );
          continue;
        }
        if (p.ctor === cc.SceneAsset) {
          continue;
        }
        if (!p.url.startsWith(r + "/")) {
          continue;
        }
        if (p.isSubAsset && cc.js.isChildClassOf(p.ctor, cc.SpriteFrame)) {
          var m;
          var f = p.relative;
          if (f in o) {
            m = o[f];
          } else {
            let t = f + ".";

            m = e.some(function (e) {
              var i = e.relative;
              return (
                (i === f || i.startsWith(t)) &&
                !e.isSubAsset &&
                e.ctor === cc.SpriteAtlas
              );
            });

            o[f] = m;
          }
          if (m) {
            continue;
          }
        }
        var b = cc.js._getClassId(p.ctor, false);
        if (!debug22) {
          var h = s[b];

          if (void 0 === h) {
            types.push(b);
            h = types.length - 1;
            s[b] = h;
          }

          b = h;
        }
        var v = [p.relative.slice(r.length + 1), b];

        if (p.isSubAsset) {
          v.push(1);
        }

        let n = p.uuid;

        if (l) {
          n = compressUuid(n, true);
        }

        paths[n] = v;
      }
    })(u);

    console.timeEnd("writeAssets");
    n.uuids = c;

    (function (e) {
      n.scenes = {};

      e.forEach((e) => {
        var t = Editor.assetdb.uuidToUrl(e);

        if (t) {
          if (l) {
            e = compressUuid(e, true);
          }

          if (-1 === n.uuids.indexOf(e)) {
            n.uuids.push(e);
          }

          n.scenes[t] = e;
        } else {
          Editor.warn(
                `Can not get url of scene ${e}, it maybe deleted.`
              );
        }
      });
    })(o);

    n.redirect = p;
    n.deps = m;

    n.packs = s
        ? (function (e) {
            if (l && e) {
              var t = {};
              for (var i in e) {
                var r = e[i];
                t[i] = r.map((e) => compressUuid(e, true));
              }
              e = t;
            }
            return e;
          })(s._packedAssets)
        : {};

    n.name = e.name;
    n.importBase = e.importBase;
    n.nativeBase = e.nativeBase;
    n.debug = debug22;
    n.isZip = e.isZip;
    n.encrypted = e.encrypted;

    if ((!("stringify" in e) || e.stringify)) {
      n = JSON.stringify(n, null, debug22 ? 4 : 0);
    }

    i(null, n);
  });
}
function buildSettings(e, t) {
  var i = e.customSettings;
  var r = e.debug;
  var s = Object.create(null);

  let n = (function (e) {
      return F(e, "extends") || e;
    })(i.platform);

  let o = E[n].isNative;
  var a = Editor.assetdb;

  if (e.launchScene) {
    i.launchScene = Editor.assetdb.uuidToUrl(e.launchScene);
  }

  i.orientation = e.orientation;
  i.server = e.server;

  if (r) {
    i.debug = true;
  }

  a.queryMetas("db://**/*", "javascript", function (n, l) {
    var u;

    u = o
      ? (e) => e.isPlugin && e.loadPluginInNative
      : (e) => e.isPlugin && e.loadPluginInWeb;

    var c = l.filter(u).map((e) => e.uuid);

    (function (e, t) {
      for (var i = [], r = 0; r < t.length; r++) {
        var n = t[r];
        var o = a.uuidToUrl(n);
        o = o.slice(M.length);
        s[o] = n;
        i.push(o);
      }
      i.sort();
      e.jsList = i;
    })(i, c);

    if ((!("stringify" in e) || e.stringify)) {
      i = getSettingFileCon(i, r);
    }

    t(null, i, s);
  });
}

exports.startWithArgs = async function (t, g) {
  let A;
  let I;
  T.forEach((e) => {
    if (!t.excludedModules.includes(e)) {
      t.excludedModules.push(e);
    }
  });
  try {
    A = S.getPhysicsModule(t.excludedModules);
    I = A && S.getPhysicsBuildFlags(A);
  } catch (e) {
    return g(e);
  }
  await (async function (e) {
    return await $("buildStart", e);
  })(t);
  var z = new a();
  function N(e) {
    let t = true;
    return function (...i) {
      let r = i[0];

      if (t) {
        t = false;

        if (e) {
          e(...i);
        }
      } else {
        if (r) {
          Editor.error(r);
        }
      }
    };
  }
  var L = t.project;
  var W = t.platform;
  var H = t.actualPlatform;
  let J = "runtime" === W;
  let Z = "mini-game" === W;
  var G = !!t.debug;
  var V = t.sourceMaps;
  var Q = t.webOrientation;

  if ("auto" === Q) {
    Q = "";
  }

  var Y = t.debugBuildWorker;
  var K = E[W];
  var X = K.isNative;
  var ee = t.dest;

  if (!i.existsSync(ee)) {
    t.buildScriptsOnly = false;
  }

  Editor.log("Building " + L);
  Editor.log("Destination " + ee);
  if (e.normalize(ee) === e.normalize(L)) {
    return g(new Error("Can not export project at project folder."));
  }
  if (e.contains(Editor.App.path, ee)) {
    return g(new Error("Can not export project to fireball app folder."));
  }
  var te;

  var ie = {
    tmplBase: e.resolve(Editor.url("unpack://static"), "build-templates"),
    jsCacheDir: Editor.url("unpack://engine/bin/.cache/" + H),
    backupDir: "js backups (useful for debugging)",
  };

  te = G
    ? X
      ? J
        ? "cocos2d-runtime.js"
        : "cocos2d-jsb.js"
      : "cocos2d-js.js"
    : X
    ? J
      ? "cocos2d-runtime-min.js"
      : "cocos2d-jsb-min.js"
    : "cocos2d-js-min.js";

  Object.assign(ie, {
    template_shares: e.join(ie.tmplBase, "shares/**/*"),
    template_web_desktop: e.join(
      ie.tmplBase,
      G ? "web-desktop/template-dev/**/*" : "web-desktop/template/**/*"
    ),
    template_web_mobile: e.join(
      ie.tmplBase,
      G ? "web-mobile/template-dev/**/*" : "web-mobile/template/**/*"
    ),
    src: e.join(ee, "src"),
    assets: e.join(ee, "assets"),
    remote: e.join(ee, "remote"),
    subpackages: e.join(ee, "subpackages"),
    settings: e.join(ee, "src/settings.js"),
    jsCache: e.join(ie.jsCacheDir, te),
    jsCacheExcludes: e.join(ie.jsCacheDir, G ? ".excludes" : ".excludes-min"),
    webDebuggerSrc: Editor.url(
      "app://node_modules/vconsole/dist/vconsole.min.js"
    ),
    template_instant_games: e.join(ie.tmplBase, "fb-instant-games/**/*"),
    quickScripts: e.join(L, "temp/quick-scripts"),
    destQuickScripts: e.join(ee, "scripts"),
  });

  let re = (t.bundles = []);

  z.task("query-bundles", async function () {
    let i = require(Editor.url("app://editor/share/build-utils"));
    let { MAIN: r, START_SCENE: s } = cc.AssetManager.BuiltinBundleName;
    let n = await k.queryBundlesWithScenes();
    let o = await k.queryBundleFolders();
    k.verifyBundleFolders(o);
    for (let e in n) n[e] = n[e].map((e) => e.uuid);
    o.forEach((t) => {
      let {
          url: i,
          name: r,
          compressionType: s,
          priority: o,
          optimizeHotUpdate: a,
          inlineSpriteFrames: l,
          isRemoteBundle: u,
        } = t;

      let c = s[H] === U;
      let d = !c && u[H];
      let p = e.join(c ? ie.subpackages : d ? ie.remote : ie.assets, r);
      re.push({
        root: i,
        name: r,
        dest: p,
        scriptDest:
          c || K.supportDownloadScript || !d ? p : e.join(ie.src, "scripts", r),
        priority: o,
        scenes: n[r] || [],
        compressionType: s[H] || ("db://internal/resources" === i ? merge_all_json : q),
        optimizeHotUpdate: a[H],
        inlineSpriteFrames: l[H],
        isRemote: d,
      });
    });
    let a = n[r];

    if (!(!Z && !J) && t.startSceneAssetBundle) {
      re.push({
          root: null,
          priority: 9,
          dest: e.join(ie.assets, s),
          scriptDest: e.join(ie.assets, s),
          name: s,
          scenes: [t.startScene],
          compressionType: merge_all_json,
          optimizeHotUpdate: false,
          inlineSpriteFrames: false,
          isRemote: false,
        });

      a = a.filter((e) => e !== t.startScene);
    }

    a = a.filter((e) => !t.excludeScenes.includes(e));
    let l = i.supportSubpackage(H) && t.mainCompressionType === U;
    let u = !l && K.supportRemoteMain && i.supportRemote(H) && t.mainIsRemote;
    let c = e.join(l ? ie.subpackages : u ? ie.remote : ie.assets, r);
    let d = t.mainCompressionType || q;

    if (d === B && !i.supportZip(H)) {
      d = q;
    }

    re.push({
      root: null,
      priority: 7,
      dest: c,
      scriptDest:
        l || K.supportDownloadScript || !u ? c : e.join(ie.src, "scripts", r),
      name: r,
      scenes: a,
      compressionType: d,
      optimizeHotUpdate: t.optimizeHotUpdate,
      inlineSpriteFrames: t.inlineSpriteFrames,
      isRemote: u,
    });
  });

  z.task("compile", function (e) {
    Editor.Ipc.sendToMain("builder:state-changed", "compile", 0.1);
    var t = {
      project: L,
      platform: W,
      actualPlatform: H,
      debug: G,
      sourceMaps: V,
      bundles: re,
      compileFlags: I,
    };
    j._runTask(t, function (t) {
      if (t) {
        e(t);
      } else {
        e();
      }
    });
  });

  z.task("build-assets", function (e) {
    Editor.Ipc.sendToMain("builder:state-changed", "build-assets", 0.8);
    let i = N(e);
    if (t.buildScriptsOnly) {
      return i();
    }
    var r;
    var s;
    Editor.log("Start building assets");
    Editor.Ipc.sendToMain("builder:state-changed", "spawn-worker", 0.3);
    function o(e, t) {
      r = true;
      if ((s && !Y)) {
        var n = s;
        s = null;
        try {
          n.nativeWin.destroy();
        } catch (e) {}
      }

      if ("string" == typeof t) {
        t = t.replace(/^Error:\s*/, "");
        t = new Error(t);
      }

      i(t);
    }
    n.once("app:build-project-abort", o);
    h.normal("Start spawn build-worker");
    var a = false;
    Editor.App.spawnWorker(
      "app://editor/page/build/build-worker",
      function (e, l) {
        h.normal("Finish spawn build-worker");
        s = e;

        if (!a) {
          a = true;

          l.once("closed", function () {
            if (!r) {
              n.removeListener("app:build-project-abort", o);
              Editor.log("Finish building assets");
              i();
            }
          });
        }

        h.normal("Start init build-worker");
        Editor.Ipc.sendToMain("builder:state-changed", "init-worker", 0.32);

        s.send(
          "app:init-build-worker",
          H,
          G,
          function (e) {
            function n() {
              if (!(!s || Y)) {
                s.close();
                s = null;
              }
            }
            if (e) {
              i(e);
              r = true;
              n();
            } else {
              if (!r) {
                h.normal("Finish init build-worker");
                h.normal("Start build-assets in worker");

                Editor.Ipc.sendToMain(
                  "builder:state-changed",
                  "build-assets",
                  0.65
                );

                var o = new Array(11);

                re.forEach((e) => {
                  if (!o[e.priority - 1]) {
                    o[e.priority - 1] = [];
                  }

                  o[e.priority - 1].push(e);
                });

                o = o.filter((e) => e).reverse();
                var a = Object.create(null);
                b.eachSeries(
                  o,
                  (e, n) => {
                    b.eachSeries(
                      e,
                      (e, n) => {
                        var o = {
                          inlineSpriteFrames: e.inlineSpriteFrames,
                          optimizeHotUpdate: e.optimizeHotUpdate,
                        };
                        o.scenes = e.scenes;
                        o.compressionType = e.compressionType;
                        o.sharedUuid = a;
                        let l = F(t.actualPlatform, "buildConfig");

                        if (l &&
                          (l.hasOwnProperty("pack"), 1)) {
                          o.pack = l.pack;
                        }

                        s.send(
                          "app:build-assets",
                          e,
                          H,
                          G,
                          o,
                          function (t, s, o, a) {
                            if (!r) {
                              if (t) {
                                i(t);
                                r = true;
                              } else {
                                if (s) {
                                  var l = new w(s, o);
                                  e.buildResults = l;
                                  e.pacInfos = a;
                                }
                              }
                              n(t);
                            }
                          },
                          -1
                        );
                      },
                      (t) => {
                        if (!t) {
                          const t = Object.create(null);
                          e.forEach((e) => {
                            var i = e.pacInfos;

                            if (i) {
                              i.forEach((i) => {
                                const r = i.relativePath;

                                if (t[r]) {
                                  Editor.warn(
                                        `The AutoAtlas ${r} exists                                                 in two bundles with the same priority: ${e.name}, ${t[r].name}.                                                 This may result in inconsistent atlas data in each bundle.                                                 You can change the priority of one of those bundles to resolve it`
                                      );
                                } else {
                                  t[r] = e;
                                }
                              });
                            }

                            e.buildResults.getAssetUuids().forEach((t) => {
                              if (!a[t]) {
                                a[t] = e.name;
                              }
                            });
                          });
                        }
                        n(t);
                      }
                    );
                  },
                  (e) => {
                    if (!e) {
                      h.normal("Finish build-assets in worker");
                    }

                    n();
                  }
                );
              }
            }
          },
          -1
        );
      },
      Y,
      true
    );
  });

  z.task("build-configs", function (e) {
    if (t.buildScriptsOnly) {
      return e();
    }
    b.eachSeries(
      re,
      (e, i) => {
        P(
          {
            stringify: false,
            name: e.name,
            importBase: "import",
            nativeBase: "native",
            root: e.root,
            buildResults: e.buildResults,
            sceneList: e.scenes,
            debug: G,
            preview: false,
            isZip: "zip" === e.compressionType,
            encrypted: X && !J && t.encryptJs && !G,
          },
          (t, r) => {
            e.config = r;
            i(t);
          }
        );
      },
      (t) => {
        if (t) {
          error(t);
        } else {
          e();
        }
      }
    );
  });

  var se = null;
  var ne = null;
  function oe(e, i) {
    var r = [ie.template_shares, e];
    return z.src(r).pipe(D(t)).pipe(z.dest(ee)).on("end", i);
  }

  z.task("build-settings", function (e) {
    let { RESOURCES: i, START_SCENE: r } = cc.AssetManager.BuiltinBundleName;
    var s = Editor.Profile.load("project://project.json");

    var n = {
      platform: H,
      groupList: s.get("group-list"),
      collisionMatrix: s.get("collision-matrix"),
      hasResourcesBundle: !!re.find((e) => e.name === i),
      hasStartSceneBundle: !!re.find((e) => e.name === r),
      remoteBundles: re.filter((e) => e.isRemote).map((e) => e.name),
      subpackages: re
        .filter((e) => e.compressionType === U)
        .map((e) => e.name),
    };

    let o = {
      debug: G,
      stringify: false,
      customSettings: n,
      launchScene: t.scenes[0],
      orientation: X ? "" : Q,
    };

    if (X && !J) {
      o.server = t[H].REMOTE_SERVER_ROOT;
    }

    buildSettings(o, function (i, r, s) {
      if (i) {
        e(i);
      } else {
        t.settings = se = r;
        ne = s;
        e();
      }
    });
  });

  z.task("compress-configs", function (e) {
    if (G || t.buildScriptsOnly) {
      return e();
    }
    function i(e) {
      let t = {};
      let i = {};
      function r(e) {
        var r = (t[e] || 0) + 1;
        t[e] = r;

        if (!(e in i)) {
          i[e] = e;
        }
      }
      let paths22 = e.paths;
      for (let e in paths22) r(e);
      let n = e.scenes;
      for (let e in n) r(n[e]);
      let o = e.packs;
      for (let e in o) o[e].forEach(r);
      let a = e.versions;
      for (let e in a) {
        let t = a[e];
        for (let e = 0; e < t.length; e += 2) {
          r(t[e]);
        }
      }
      let l = e.redirect;
      for (let e = 0; e < l.length; e += 2) {
        r(l[e]);
      }
      e.uuids.sort((e, i) => t[i] - t[e]);
      e.uuids.forEach((e, t) => (i[e] = t));
      return i;
    }
    for (var r = 0; r < re.length; r++) {
      var s = re[r].config;
      var n = i(s);
      let e = s.paths;
      let path33 = (s.paths = {});
      for (let t in e) {
        var o = e[t];
        path33[n[t]] = o;
      }
      let l = s.scenes;
      for (let e in l) {
        let t = n[l[e]];
        l[e] = t;
      }
      let u = s.packs;
      for (let e in u) {
        let t = u[e];
        for (let e = 0; e < t.length; ++e) {
          let i = n[t[e]];
          t[e] = i;
        }
      }
      if (t.md5Cache) {
        let e = s.versions;
        for (let t in e) {
          let i = e[t];
          for (let e = 0; e < i.length; e += 2) {
            let t = n[i[e]];
            i[e] = t;
          }
        }
      }
      let c = s.redirect;
      for (let e = 0; e < c.length; e += 2) {
        let t = n[c[e]];
        c[e] = t;
      }
    }
    e();
  });

  z.task("build-web-desktop-template", function (e) {
    oe(ie.template_web_desktop, e);
  });

  z.task("build-web-mobile-template", function (e) {
    oe(ie.template_web_mobile, e);
  });

  z.task("build-fb-instant-games-template", function (e) {
    oe(ie.template_instant_games, e);
  });

  z.task("build-plugin-scripts", function (i) {
    let r = N(i);
    Editor.log("Start building plugin scripts");
    var s = Editor.assetdb;
    var n = [];
    let o = function (i) {
      for (var r in ne) {
        var o = ne[r];
        let c = s.uuidToFspath(o);
        var a = e.dirname(e.join(ie.src, r));
        console.log(`start gulpping ${c} to ${a}`);
        var l = z.src(c);
        if (!G) {
          var uglify = Editor.require("unpack://engine/gulp/util/utils").uglify;
          let e = { jsb: X && !J, runtime: J, debug: G, support_jit: false };
          let r = F(t, H);

          if (r) {
            Object.assign(e, r);
          }

          l = l.pipe(uglify("build", e));

          d.obj([l]).on("error", function (e) {
            i(e.message);
          });
        }

        l = l.pipe(z.dest(a)).on("end", () => {
          if (global.gc) {
            global.gc();
          }
          console.log("finish gulpping", c);
        });

        n.push(l);
      }

      if (n.length > 0) {
        c.merge(n).on("end", () => {
          Editor.log("Finish building plugin scripts");
          i();
        });
      } else {
        i();
      }
    };

    if (ne) {
      o(r);
    } else {
      (function (e, t) {
            Editor.Ipc.sendToMain("app:query-plugin-scripts", e, (e, i) => {
              if (e) {
                if (t) {
                  t(e, null);
                }

                return;
              }
              let r = {};

              i.forEach((e) => {
                let t = Editor.assetdb.fspathToUuid(e);
                let i = Editor.assetdb.uuidToUrl(t);
                i = i.slice(M.length);
                r[i] = t;
              });

              if (t) {
                t(null, r);
              }
            });
          })(W, (e, t) => {
        if (e) {
          return r(e);
        }
        ne = t;
        o(r);
      });
    }
  });

  z.task("copy-main-js", function () {
    return z
      .src([e.join(ie.tmplBase, "shares/main.js")])
      .pipe(D(t))
      .pipe(z.dest(ee));
  });

  z.task("copy-build-template", function (r) {
    Editor.Ipc.sendToMain(
      "builder:state-changed",
      "copy-build-templates",
      0.98
    );
    let s = e.basename(t.dest);
    let n = e.join(t.project, "build-templates");
    if (!i.existsSync(n)) {
      return r();
    }
    let a = e.join(n, s);
    let l = [e.join(a, "**/*")];

    [
      "game.json",
      "project.config.json",
      "project.swan.json",
      "manifest.json",
    ].forEach((t) => {
      l.push(`!${e.join(a, t)}`);
    });

    globby(l, (s, o) => {
      (o = o.map((t) => e.resolve(t))).forEach((r) => {
        let s = e.relative(n, r);
        let o = e.join(t.buildPath, s);
        i.ensureDirSync(e.dirname(o));
        i.copySync(r, o);
      });

      if (r) {
        r(s);
      }
    });
  });

  var ae = require(Editor.url("unpack://engine/gulp/tasks/engine"));

  var le = async function (e, i) {
    var r = X ? (J ? "buildRuntime" : "buildJsb") : "buildCocosJs";
    r += G ? "" : "Min";
    let s = ae.excludeAllDepends(t.excludedModules);
    console.log("Exclude modules: " + s);
    let n = { runtime: J, support_jit: false };

    let o = await (async function (e) {
      let t = await $("compileFlags", e);
      return "object" == typeof t ? t : null;
    })(t);

    if (o) {
      Object.assign(n, o);
    }

    Object.assign(n, I);

    if (t.separateEngineMode) {
      n.physics_builtin = false;
      n.physics_cannon = true;
    }

    ae[r](Editor.url("unpack://engine/index.js"), e, s, n, i, t.sourceMaps);
  };

  function ue(e) {
    let t = v.createHash("md5");
    for (let r = 0; r < e.length; r++) {
      let s;
      try {
        s = i.readFileSync(e[r]);
      } catch (e) {
        Editor.error(e);
        continue;
      }
      t.update(s);
    }
    let r = t.digest("hex");
    return (r = r.slice(0, C));
  }
  function ce(t) {
    let r = ue(t);
    let s = t;
    let n = [];
    let o = t[0];
    let a = Editor.Utils.UuidUtils.getUuidFromLibPath(o);
    let l = e.dirname(o);

    if (e.basenameNoExt(l) === a) {
      s = [l];
    }

    s.forEach((e) => {
      let t = e.replace(
        Editor.Utils.UuidUtils.Reg_UuidInLibPath,
        (e) => e + "." + r
      );
      try {
        i.renameSync(e, t);
      } catch (e) {
        u.log(`[31m[MD5 ASSETS] write file error: ${e.message}[0m`);
      }
      n.push(t);
    });

    return { hash: r, renamedPaths: n };
  }
  async function de(t) {
    const i = Editor.Utils.UuidUtils.getUuidFromLibPath;
    var r = await s(globby)(t, { nodir: true });
    let n = {};
    for (let t = 0; t < r.length; t++) {
      let s = r[t];
      let o = i(e.relative(ee, s));

      if (o) {
        if (!n[o]) {
          n[o] = [];
        }

        n[o].push(s);
      } else {
        Editor.warn(
              `Can not resolve uuid for path "${s}", skip the MD5 process on it.`
            );
      }
    }
    for (let e in n) {
      let t = n[e];
      t = t.sort();
      n[e] = ce(t).hash;
    }
    return n;
  }
  function pe(t, r) {
    let s = [t];
    let n = K.supportDownloadScript;

    if (n) {
      s.push(r);
    }

    let o = ue(s);
    try {
      let s = e.join(e.dirname(t), `config.${o}.json`);
      i.renameSync(t, s);
      if ((n)) {
        let t = e.join(e.dirname(r), `index.${o}.js`);
        i.renameSync(r, t);
      }
    } catch (e) {
      u.log(`[31m[MD5 ASSETS] write file error: ${e.message}[0m`);
    }
    return o;
  }
  function me(t) {
    if (K.supportDownloadScript && t.jsList && t.jsList.length > 0) {
      var r = ie.src;

      var s = t.jsList
        .map((t) => e.resolve(r, t))
        .map((t) => {
        t = (function (t) {
          let r = ue([t]);

          let s = e.join(
            e.dirname(t),
            e.basenameNoExt(t) + "." + r + e.extname(t)
          );

          try {
            i.renameSync(t, s);
          } catch (e) {
            u.log(`[31m[MD5 ASSETS] write file error: ${e.message}[0m`);
          }
          return s;
        })(t);

        return e.relative(r, t).replace(/\\/g, "/");
      });

      s.sort();
      t.jsList = s;
    }
  }

  z.task("build-cocos2d", async function () {
    Editor.Ipc.sendToAll("builder:state-changed", "cut-engine", 0);
    await S.build(t);
    let r = ee;

    if (X) {
      r = e.join(ee, "src");
    }

    let n = await (async function (e) {
      return await $("engineBuildPath", e);
    })(t);

    if (n) {
      r = n;
    }

    i.ensureDirSync(ie.jsCacheDir);
    if (t.separateEngineMode && "qgame" === H) {
      t.excludedModules = [...T].sort();
    } else {
      t.excludedModules = t.excludedModules ? t.excludedModules.sort() : [];
      let e = await s(Editor.assetdb.queryAssets.bind(Editor.assetdb))(
        null,
        "typescript"
      );
      const i = "TypeScript Polyfill";
      let r = t.excludedModules.indexOf(i);

      if (-1 === r && 0 === e.length) {
        t.excludedModules.push(i);
      } else {
        if (r > -1 && e.length > 0) {
          t.excludedModules.splice(r, 1);
        }
      }
    }
    let o = false;
    if (i.existsSync(ie.jsCacheExcludes)) {
      let e = i.readJSONSync(ie.jsCacheExcludes);

      if (e.excludes &&
        e.version) {
        o = Editor.versions.cocos2d === e.version &&
        e.excludes.toString() === t.excludedModules.toString() &&
        e.sourceMaps === t.sourceMaps &&
        e.separateEngineMode === t.separateEngineMode;
      }
    }
    function a(e) {
      let t = [ie.jsCache];

      if (V) {
        t.push(ie.jsCache + ".map");
      }

      let i = z.src(t, { allowEmpty: true });

      if (X) {
        i = i.pipe(l(J ? "cocos2d-runtime.js" : "cocos2d-jsb.js"));
      }

      (i = i.pipe(z.dest(r))).on("end", e);
    }
    if (o && i.existsSync(ie.jsCache)) {
      await s(a)();
      return;
    }
    await s(le)(ie.jsCache);
    await s(a)();

    i.writeFileSync(
      ie.jsCacheExcludes,
      JSON.stringify({
        excludes: t.excludedModules,
        version: Editor.versions.cocos2d,
        sourceMaps: t.sourceMaps,
        separateEngineMode: t.separateEngineMode,
      }),
      null,
      4
    );
  });

  z.task("copy-webDebugger", function () {
    var r = e.join(ee, e.basename(ie.webDebuggerSrc));
    return t.embedWebDebugger
      ? s(i.copy)(ie.webDebuggerSrc, r)
      : f(r.replace(/\\/g, "/"), { force: true });
  });

  z.task("revision-asset-jsList", async function () {
    let r = t.md5Cache;
    if (t.buildScriptsOnly) {
      se.jsList = Object.keys(ne);

      if (r) {
        me(se);
      }

      return;
    }
    const s = Editor.Utils.UuidUtils.compressUuid;
    if (r) {
      console.time("revision");
      for (let t = 0; t < re.length; t++) {
        let r = re[t];
        if ("zip" === r.compressionType) {
          let t = e.join(r.dest, "res.zip");
          if (i.existsSync(t)) {
            let s = ue([t]);

            i.renameSync(
              t,
              e.join(e.dirname(t), `${e.basenameNoExt(t)}.${s}.zip`)
            );

            r.config.zipVersion = s;
          }
          continue;
        }
        let n = [];
        let o = await de(e.join(r.dest, "import", "**"));
        for (let e in o) n.push(s(e, true), o[e]);
        let a = [];
        let l = await de(e.join(r.dest, "native", "**"));
        for (let e in l) a.push(s(e, true), l[e]);
        r.config.versions = { import: n, native: a };
        r.buildResults._md5Map = o;
        r.buildResults._nativeMd5Map = l;
      }
      me(se);
      console.timeEnd("revision");
    }
  });

  z.task("save-settings", function (e) {
    var t = getSettingFileCon(se, G);
    i.outputFile(ie.settings, t, e);
  });

  z.task("save-configs", function (r) {
    if (t.buildScriptsOnly) {
      return r();
    }
    for (var s = 0; s < re.length; s++) {
      var n = re[s];
      var o = JSON.stringify(n.config, null, G ? 4 : 0);
      i.outputFileSync(e.join(n.dest, "config.json"), o, "utf8");
    }
    r();
  });

  z.task("compress-bundles", async function () {
    if (!t.buildScriptsOnly) {
      for (let t = 0; t < re.length; ++t) {
        let r = re[t];
        if ("zip" !== r.compressionType) {
          continue;
        }
        let s = r.dest;

        let n = [e.join(s, "native"), e.join(s, "import")].filter((e) =>
          i.existsSync(e)
        );

        if (n.length > 0) {
          (await k.compressDirs(n, s, e.join(s, "res.zip")));
        }
      }
    }
  });

  z.task("revision-configs", async function () {
    if (t.md5Cache) {
      se.bundleVers = Object.create(null);
      for (let t = 0; t < re.length; t++) {
        let i = re[t];
        let r = globby.sync(e.join(i.dest, "config.*"), { absolute: true });

        if (0 !== r.length) {
          r = r[0];
          i.version = pe(r, e.join(i.scriptDest, "index.js"));
          se.bundleVers[i.name] = i.version;
        }
      }
    }
  });

  z.task("revision-other", async function () {
    if (!t.md5Cache) {
      return;
    }
    var i = ["src/*.js", "*"];
    var r = ee;
    var s = ["index.html"];
    let n = [];

    if (X) {
      s = s.concat([
          "main.js",
          "cocos-project-template.json",
          "project.json",
        ]);
    }

    var o = [
      "settings.js",
      "cocos2d-js-min.js",
      "cocos2d-js.js",
      "cocos2d-jsb.js",
      "cocos2d-jsb-min.js",
    ];
    let a = (function (e) {
      let t = F(e.actualPlatform, "md5");
      let i = null;

      if (t &&
        t.renameIgnore) {
        i = t.renameIgnore(e);

        if (!Array.isArray(i)) {
          Editor.warn("renameIgnore must return an array");
        }
      }

      return Array.isArray(i) ? i : null;
    })(t);

    if (a) {
      s = s.concat(a);
    }

    let l = (function (e) {
      let t = F(e.actualPlatform, "md5");
      let i = null;

      if (t &&
        t.searchIgnore) {
        i = t.searchIgnore(e);

        if (!Array.isArray(i)) {
          Editor.warn("searchIgnore must return an array");
        }
      }

      return Array.isArray(i) ? i : null;
    })(t);

    if (l) {
      o = o.concat(l);
    }

    let u = (function (e) {
      let t = F(e.actualPlatform, "md5");
      let i = null;

      if (t &&
        t.globalIgnore) {
        i = t.globalIgnore(e);

        if (!Array.isArray(i)) {
          Editor.warn("renameIgnore must return an array");
        }
      }

      return Array.isArray(i) ? i : null;
    })(t);

    if (u) {
      n = n.concat(u);
    }

    if ("fb-instant-games" === t.platform) {
      s = s.concat(["fbapp-config.json"]);
    }

    if (Editor.isWin32) {
      o = o.map((e) => e.replace(/\\/g, "/"));
    }

    await new Promise((t, a) => {
      let l = z
        .src(i, { cwd: ee, base: r })
        .pipe(
          p.revision({
            debug: true,
            hashLength: C,
            dontGlobal: n,
            dontRenameFile: s,
            dontSearchFile: o,
            annotator: function (e, t) {
              return [{ contents: e, path: t }];
            },
            replacer: function (t, i, r, s) {
              if (!(".map" === e.extname(t.path) && s.revPathOriginal + ".map" !== t.path)) {
                t.contents = t.contents.replace(i, "$1" + r + "$3$4");
              }
            },
          })
        )
        .pipe(m())
        .pipe(z.dest(ee));
      l.on("end", t);
      l.on("error", (e) => a(e));
    });
  });

  z.task("before-change-files", function (e) {
    let i = require(Editor.url("app://editor/share/build-utils"));
    Editor.Builder.doCustomProcess(
      "before-change-files",
      i.getCommonOptions(t),
      re,
      e
    );
  });

  z.task("script-build-finished", function (e) {
    let i = require(Editor.url("app://editor/share/build-utils"));
    Editor.Builder.doCustomProcess(
      "script-build-finished",
      i.getCommonOptions(t),
      re,
      e
    );
  });

  z.task("copy-runtime-scripts", function () {
    var t = e.join(ee, "src");
    return z.src(e.join(ie.tmplBase, "runtime/**/*.js")).pipe(z.dest(t));
  });

  z.task("before-finish-build", async function () {
    await (async function (e, t) {
      return await $("beforeFinish", e, t);
    })(t, se);
  });

  z.task("encrypt-src-js", function (r) {
    if (G || !t.encryptJs) {
      r();
      return;
    }
    for (
      var s = e.join(ee, "src"),
        n = e.resolve(s, `../${ie.backupDir}`),
        o = 0,
        a = re.length;
      o < a;
      o++
    ) {
      var l = re[o];
      i.copySync(
        e.join(l.scriptDest, `index${t.md5Cache ? "." + l.version : ""}.js`),
        e.join(n, `${l.name}.index${t.md5Cache ? "." + l.version : ""}.js`)
      );
    }
    i.copy(s, n, (e) => {
      if (e) {
        Editor.warn("Failed to backup js files for debugging.", e);
      }

      y.encryptJsFiles(t, [ie.assets, ie.remote], r);
    });
  });

  z.task("build-jsb-adapter", function () {
    return Editor.require("app://editor/share/build-jsb-adapter").build({
      rootPath: Editor.url("packages://jsb-adapter"),
      dstPath: e.join(ee, "jsb-adapter"),
      excludedModules: t.excludedModules,
    });
  });

  z.task(
    "build-common",
    z.series(
      "query-bundles",
      "compile",
      "build-assets",
      "build-configs",
      "build-plugin-scripts",
      "build-settings",
      "compress-bundles"
    )
  );

  z.task(
    "finish-build",
    z.series(
      "copy-build-template",
      "before-change-files",
      "revision-asset-jsList",
      "compress-configs",
      "save-configs",
      "revision-configs",
      "save-settings",
      "revision-other"
    )
  );

  z.task(
    x + "web-desktop",
    z.series(
      "build-cocos2d",
      z.parallel("build-common", "copy-webDebugger"),
      "build-web-desktop-template",
      "finish-build"
    )
  );

  z.task(
    x + "web-mobile",
    z.series(
      "build-cocos2d",
      z.parallel("build-common", "copy-webDebugger"),
      "build-web-mobile-template",
      "finish-build"
    )
  );

  z.task(
    x + "fb-instant-games",
    z.series(
      "build-cocos2d",
      z.parallel("build-common", "copy-webDebugger"),
      "build-fb-instant-games-template",
      "finish-build"
    )
  );

  z.task(
    x + "mini-game",
    z.series(
      "build-cocos2d",
      "build-common",
      "script-build-finished",
      "before-finish-build",
      "finish-build"
    )
  );

  z.task(
    "copy-native-files",
    z.series(
      "build-common",
      "script-build-finished",
      "copy-runtime-scripts",
      "copy-main-js",
      "before-finish-build",
      "finish-build",
      "encrypt-src-js"
    )
  );

  z.task("build-cocos-native-project", function (e) {
    y.build(t, e);
  });

  z.task(
    "build-native-project",
    z.series(
      "build-cocos-native-project",
      "build-cocos2d",
      "build-jsb-adapter",
      "copy-native-files"
    )
  );

  z.task("copy-win32-dll", () => {
    let t = [
        "msvcp100.dll",
        "msvcp110.dll",
        "msvcp120.dll",
        "msvcp120d.dll",
        "msvcp140.dll",
        "msvcp140d.dll",
        "msvcr100.dll",
        "msvcr110.dll",
        "msvcr120.dll",
        "msvcr120d.dll",
      ];

    let r = e.join(Editor.App.path, "cocos2d-x/simulator/win32");
    let s = e.join(ee, "frameworks/runtime-src/proj.win32", "Debug.win32");
    let n = e.join(ee, "frameworks/runtime-src/proj.win32", "Release.win32");
    i.ensureDirSync(s);
    i.ensureDirSync(n);
    t = t.map((t) => e.join(r, t));
    return z.src(t, { allowEmpty: true }).pipe(z.dest(s)).pipe(z.dest(n));
  });

  z.task(x + "android", z.parallel("build-native-project"));
  z.task(x + "ios", z.parallel("build-native-project"));
  z.task(x + "win32", z.series("build-native-project", "copy-win32-dll"));
  z.task(x + "mac", z.parallel("build-native-project"));
  z.task(x + "android-instant", z.parallel("build-native-project"));
  z.task(x + "runtime", z.series("build-cocos2d", "copy-native-files"));
  var fe = x + W;
  if (fe in z._registry._tasks) {
    let r = N(g);
    var be = [];
    let s = await (async function (e) {
      let t = await $("delPattern", e);
      return Array.isArray(t) ? t : null;
    })(t);

    if (s) {
      be = s;
    } else {
      if (X) {
        be.push(ie.assets + "/**/*", ie.remote + "/**/*", ie.src + "/**/*");
      } else {
        be.push(e.join(ee, "**/*"));
      }
    }

    if (
      (t.buildScriptsOnly)
    ) {
      (G ? Editor.log : Editor.warn)(
        Editor.T("BUILDER.build_script_only_tips")
      );
      let r = globby.sync([e.join(ie.assets, "*"), e.join(ie.remote, "*")], {
        absolute: true,
      });
      be.push("!" + ie.assets);
      be.push("!" + ie.remote);

      r.forEach((t) => {
        be.push("!" + t);
        be.push("!" + e.join(t, "config.*"));
        be.push("!" + e.join(t, "import"));
        be.push("!" + e.join(t, "import/**/*"));
        be.push("!" + e.join(t, "native"));
        be.push("!" + e.join(t, "native/**/*"));
        be.push("!" + e.join(t, "*.zip"));
      });

      be.push("!" + ie.subpackages);
      be.push("!" + ie.subpackages + "/**/*");
      be.push("!" + ie.src);
      be.push("!" + ie.src + "/settings.js");
      be.push("!" + ie.src + "/settings.*.js");

      (function (t) {
        let r = e.join(t.dest, "src");
        let s = globby.sync(r + "/settings.*", { absolute: true });
        if (0 === s.length) {
          return;
        }
        s = s[0];
        let n = e.extname(s);
        i.renameSync(s, e.join(r, `settings${n}`));
      })(t);
    }
    be = be.map((e) => e.replace(/\\/g, "/"));
    Editor.log("Delete " + be);
    try {
      f.sync(be, { force: true });

      z.once("error", function (e) {
        r(
          (function (e) {
            return e.error
              ? "boolean" == typeof e.error.showStack
                ? e.error.toString()
                : e.error.stack
                ? e.error
                : new Error(String(e.error))
              : new Error(String(e.message));
          })(e)
        );
      });

      z.task(fe)(function () {
        if (!X) {
          Editor.Ipc.sendToMain("app:update-build-preview-path", ee);
        }

        r(null, re);
      });
    } catch (e) {
      g(e);
    }
  } else {
    var ge = [];
    for (var he in z._registry._tasks) if (0 === he.indexOf(x)) {
      ge.push(he.substring(x.length));
    }
    g(
      new Error(
        r("Not support %s platform, available platform currently: %s", W, ge)
      )
    );
  }
};

exports.getTemplateFillPipe = D;
exports.buildSettings = buildSettings;
exports.buildConfig = P;
