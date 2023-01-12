const e = require("fire-path"),
  t = require("fire-url"),
  i = require("fire-fs"),
  { format: r, promisify: s } = require("util"),
  n = require("electron").ipcMain,
  o = require("globby"),
  a = require("gulp").Gulp,
  l = require("gulp-rename"),
  u = require("gulp-util"),
  c = require("event-stream"),
  d = require("stream-combiner2"),
  p = require("gulp-rev-all"),
  m = require("gulp-rev-delete-original"),
  f = require("del"),
  b = require("async"),
  g = require("lodash"),
  h = require("winston"),
  v = require("crypto"),
  j = require("./compiler"),
  y = require("./native-utils"),
  E = require("../share/build-platforms"),
  w = require("./build-results"),
  S = Editor.require("app://editor/share/3d-physics-build-utils"),
  k = Editor.require("app://editor/share/bundle-utils"),
  x = "build-platform_",
  M = "db://",
  A = "window._CCSettings",
  C = 5,
  T = ["SubContext", "Canvas Renderer"],
  q = "default",
  _ = "merge_all_json",
  U = "subpackage",
  B = "zip";
function D(t) {
  return c.through(function (i) {
    if (".html" === e.extname(i.path)) {
      h.normal("Generating html from " + i.path);
      var r = t.webOrientation;
      "auto" === r && (r = "");
      const n = Editor.url("app://node_modules/vConsole/dist/vconsole.min.js"),
        o = `<script src="${e.basename(n)}"><\/script>`;
      var s = {
        file: i,
        project: t.projectName || e.basename(t.project),
        previewWidth: t.previewWidth,
        previewHeight: t.previewHeight,
        orientation: r,
        webDebugger: t.embedWebDebugger ? o : "",
      };
      i.contents = new Buffer(u.template(i.contents, s));
    } else if ("main.js" === e.basename(i.path)) {
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
    this.emit("data", i);
  });
}
function O(e, t) {
  var i = JSON.stringify(e, null, t ? 4 : 0).replace(
    /"([A-Za-z_$][0-9A-Za-z_$]*)":/gm,
    "$1:"
  );
  return (i = t ? `${A} = ${i};\n` : `${A}=${i};`);
}
async function $(e, t, ...i) {
  let r = F(t.actualPlatform, e);
  if (r)
    try {
      return await r(t, ...i);
    } catch (e) {
      Editor.error(e);
    }
}
function F(e, t) {
  let i = Editor.Builder.simpleBuildTargets[e];
  return (i && i[t]) || null;
}
function P(e, i) {
  var r = e.root,
    s = e.buildResults,
    n = {},
    o = e.sceneList,
    a = e.debug,
    l = !e.preview,
    u = Editor.assetdb,
    c = Editor.assets,
    d = Editor.Utils.UuidUtils.compressUuid;
  function p(e, i) {
    if (!e) return console.error("can not get url to build: " + i), null;
    if (!e.startsWith(M))
      return console.error("unknown url to build: " + e), null;
    var r = u.isSubAssetByUuid(i),
      s = e;
    r && (s = t.dirname(e));
    var n = t.extname(s);
    return (
      n && (s = s.slice(0, -n.length)), { uuid: i, relative: s, isSubAsset: r }
    );
  }
  console.time("queryAssets"),
    (function (e, t) {
      if (e) {
        for (
          var i = e.getAssetUuids(), s = [], n = 0, o = i.length;
          n < o;
          n++
        ) {
          var a = i[n],
            l = u.uuidToUrl(a),
            d = u.assetInfoByUuid(a);
          if (d) {
            var m = d.type;
            if (m) {
              var f = p(l, a);
              if (!f) continue;
              var b = c[m];
              (f.ctor = b || cc.Asset),
                (f.url = l),
                (f.redirect = e._buildAssets[a].redirect),
                s.push(f);
            } else console.error("Can not get asset type of " + a);
          } else s.push({ uuid: a, url: "", relative: "", ctor: cc.Asset });
        }
        t(null, s);
      } else {
        if (!r) return t(null, []);
        console.time("queryMetas"),
          u.queryMetas(r + "/**/*", "", function (e, i) {
            console.timeEnd("queryMetas");
            for (var r = [], s = 0, n = i.length; s < n; s++) {
              var o = i[s],
                a = o.assetType();
              if ("folder" !== a && "javascript" !== a && "typescript" !== a) {
                var l = o.uuid,
                  d = u.uuidToUrl(l),
                  m = p(d, l);
                if (m) {
                  var f = c[a];
                  (m.ctor = f || cc.Asset), (m.url = d), r.push(m);
                }
              }
            }
            t(e, r);
          });
      }
    })(s, function (t, u) {
      if ((console.timeEnd("queryAssets"), t)) return i(t);
      var c = [],
        p = [],
        m = [];
      u.forEach((e) => {
        var t = e.uuid;
        if (
          (e.ctor === cc.SceneAsset && -1 === o.indexOf(t) && o.push(t),
          l && (t = d(t, !0)),
          c.push(t),
          e.redirect)
        ) {
          p.push(t);
          var i = m.indexOf(e.redirect);
          -1 === i && ((i = m.length), m.push(e.redirect)), p.push(i);
        }
      }),
        console.time("writeAssets"),
        (function (e) {
          var t,
            i = (n.paths = {});
          a || (t = n.types = []);
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
            if (p.ctor === cc.SceneAsset) continue;
            if (!p.url.startsWith(r + "/")) continue;
            if (p.isSubAsset && cc.js.isChildClassOf(p.ctor, cc.SpriteFrame)) {
              var m,
                f = p.relative;
              if (f in o) m = o[f];
              else {
                let t = f + ".";
                (m = e.some(function (e) {
                  var i = e.relative;
                  return (
                    (i === f || i.startsWith(t)) &&
                    !e.isSubAsset &&
                    e.ctor === cc.SpriteAtlas
                  );
                })),
                  (o[f] = m);
              }
              if (m) continue;
            }
            var b = cc.js._getClassId(p.ctor, !1);
            if (!a) {
              var h = s[b];
              void 0 === h && (t.push(b), (h = t.length - 1), (s[b] = h)),
                (b = h);
            }
            var v = [p.relative.slice(r.length + 1), b];
            p.isSubAsset && v.push(1);
            let n = p.uuid;
            l && (n = d(n, !0)), (i[n] = v);
          }
        })(u),
        console.timeEnd("writeAssets"),
        (n.uuids = c),
        (function (e) {
          (n.scenes = {}),
            e.forEach((e) => {
              var t = Editor.assetdb.uuidToUrl(e);
              t
                ? (l && (e = d(e, !0)),
                  -1 === n.uuids.indexOf(e) && n.uuids.push(e),
                  (n.scenes[t] = e))
                : Editor.warn(
                    `Can not get url of scene ${e}, it maybe deleted.`
                  );
            });
        })(o),
        (n.redirect = p),
        (n.deps = m),
        (n.packs = s
          ? (function (e) {
              if (l && e) {
                var t = {};
                for (var i in e) {
                  var r = e[i];
                  t[i] = r.map((e) => d(e, !0));
                }
                e = t;
              }
              return e;
            })(s._packedAssets)
          : {}),
        (n.name = e.name),
        (n.importBase = e.importBase),
        (n.nativeBase = e.nativeBase),
        (n.debug = a),
        (n.isZip = e.isZip),
        (n.encrypted = e.encrypted),
        (!("stringify" in e) || e.stringify) &&
          (n = JSON.stringify(n, null, a ? 4 : 0)),
        i(null, n);
    });
}
function R(e, t) {
  var i = e.customSettings,
    r = e.debug,
    s = Object.create(null);
  let n = (function (e) {
      return F(e, "extends") || e;
    })(i.platform),
    o = E[n].isNative;
  var a = Editor.assetdb;
  e.launchScene && (i.launchScene = Editor.assetdb.uuidToUrl(e.launchScene)),
    (i.orientation = e.orientation),
    (i.server = e.server),
    r && (i.debug = !0),
    a.queryMetas("db://**/*", "javascript", function (n, l) {
      var u;
      u = o
        ? (e) => e.isPlugin && e.loadPluginInNative
        : (e) => e.isPlugin && e.loadPluginInWeb;
      var c = l.filter(u).map((e) => e.uuid);
      (function (e, t) {
        for (var i = [], r = 0; r < t.length; r++) {
          var n = t[r],
            o = a.uuidToUrl(n);
          (o = o.slice(M.length)), (s[o] = n), i.push(o);
        }
        i.sort(), (e.jsList = i);
      })(i, c),
        (!("stringify" in e) || e.stringify) && (i = O(i, r)),
        t(null, i, s);
    });
}
(exports.startWithArgs = async function (t, g) {
  let A, I;
  T.forEach((e) => {
    t.excludedModules.includes(e) || t.excludedModules.push(e);
  });
  try {
    (A = S.getPhysicsModule(t.excludedModules)),
      (I = A && S.getPhysicsBuildFlags(A));
  } catch (e) {
    return g(e);
  }
  await (async function (e) {
    return await $("buildStart", e);
  })(t);
  var z = new a();
  function N(e) {
    let t = !0;
    return function (...i) {
      let r = i[0];
      t ? ((t = !1), e && e(...i)) : r && Editor.error(r);
    };
  }
  var L = t.project,
    W = t.platform,
    H = t.actualPlatform;
  let J = "runtime" === W,
    Z = "mini-game" === W;
  var G = !!t.debug,
    V = t.sourceMaps,
    Q = t.webOrientation;
  "auto" === Q && (Q = "");
  var Y = t.debugBuildWorker,
    K = E[W],
    X = K.isNative,
    ee = t.dest;
  if (
    (i.existsSync(ee) || (t.buildScriptsOnly = !1),
    Editor.log("Building " + L),
    Editor.log("Destination " + ee),
    e.normalize(ee) === e.normalize(L))
  )
    return g(new Error("Can not export project at project folder."));
  if (e.contains(Editor.App.path, ee))
    return g(new Error("Can not export project to fireball app folder."));
  var te,
    ie = {
      tmplBase: e.resolve(Editor.url("unpack://static"), "build-templates"),
      jsCacheDir: Editor.url("unpack://engine/bin/.cache/" + H),
      backupDir: "js backups (useful for debugging)",
    };
  (te = G
    ? X
      ? J
        ? "cocos2d-runtime.js"
        : "cocos2d-jsb.js"
      : "cocos2d-js.js"
    : X
    ? J
      ? "cocos2d-runtime-min.js"
      : "cocos2d-jsb-min.js"
    : "cocos2d-js-min.js"),
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
    let i = require(Editor.url("app://editor/share/build-utils")),
      { MAIN: r, START_SCENE: s } = cc.AssetManager.BuiltinBundleName,
      n = await k.queryBundlesWithScenes(),
      o = await k.queryBundleFolders();
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
        } = t,
        c = s[H] === U,
        d = !c && u[H],
        p = e.join(c ? ie.subpackages : d ? ie.remote : ie.assets, r);
      re.push({
        root: i,
        name: r,
        dest: p,
        scriptDest:
          c || K.supportDownloadScript || !d ? p : e.join(ie.src, "scripts", r),
        priority: o,
        scenes: n[r] || [],
        compressionType: s[H] || ("db://internal/resources" === i ? _ : q),
        optimizeHotUpdate: a[H],
        inlineSpriteFrames: l[H],
        isRemote: d,
      });
    });
    let a = n[r];
    !(!Z && !J) &&
      t.startSceneAssetBundle &&
      (re.push({
        root: null,
        priority: 9,
        dest: e.join(ie.assets, s),
        scriptDest: e.join(ie.assets, s),
        name: s,
        scenes: [t.startScene],
        compressionType: _,
        optimizeHotUpdate: !1,
        inlineSpriteFrames: !1,
        isRemote: !1,
      }),
      (a = a.filter((e) => e !== t.startScene))),
      (a = a.filter((e) => !t.excludeScenes.includes(e)));
    let l = i.supportSubpackage(H) && t.mainCompressionType === U,
      u = !l && K.supportRemoteMain && i.supportRemote(H) && t.mainIsRemote,
      c = e.join(l ? ie.subpackages : u ? ie.remote : ie.assets, r),
      d = t.mainCompressionType || q;
    d === B && !i.supportZip(H) && (d = q),
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
  }),
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
        t ? e(t) : e();
      });
    }),
    z.task("build-assets", function (e) {
      Editor.Ipc.sendToMain("builder:state-changed", "build-assets", 0.8);
      let i = N(e);
      if (t.buildScriptsOnly) return i();
      var r, s;
      Editor.log("Start building assets"),
        Editor.Ipc.sendToMain("builder:state-changed", "spawn-worker", 0.3);
      function o(e, t) {
        if (((r = !0), s && !Y)) {
          var n = s;
          s = null;
          try {
            n.nativeWin.destroy();
          } catch (e) {}
        }
        "string" == typeof t &&
          ((t = t.replace(/^Error:\s*/, "")), (t = new Error(t))),
          i(t);
      }
      n.once("app:build-project-abort", o),
        h.normal("Start spawn build-worker");
      var a = !1;
      Editor.App.spawnWorker(
        "app://editor/page/build/build-worker",
        function (e, l) {
          h.normal("Finish spawn build-worker"),
            (s = e),
            a ||
              ((a = !0),
              l.once("closed", function () {
                r ||
                  (n.removeListener("app:build-project-abort", o),
                  Editor.log("Finish building assets"),
                  i());
              })),
            h.normal("Start init build-worker"),
            Editor.Ipc.sendToMain("builder:state-changed", "init-worker", 0.32),
            s.send(
              "app:init-build-worker",
              H,
              G,
              function (e) {
                function n() {
                  !s || Y || (s.close(), (s = null));
                }
                if (e) i(e), (r = !0), n();
                else if (!r) {
                  h.normal("Finish init build-worker"),
                    h.normal("Start build-assets in worker"),
                    Editor.Ipc.sendToMain(
                      "builder:state-changed",
                      "build-assets",
                      0.65
                    );
                  var o = new Array(11);
                  re.forEach((e) => {
                    o[e.priority - 1] || (o[e.priority - 1] = []),
                      o[e.priority - 1].push(e);
                  }),
                    (o = o.filter((e) => e).reverse());
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
                          (o.scenes = e.scenes),
                            (o.compressionType = e.compressionType),
                            (o.sharedUuid = a);
                          let l = F(t.actualPlatform, "buildConfig");
                          l &&
                            (l.hasOwnProperty("pack"), 1) &&
                            (o.pack = l.pack),
                            s.send(
                              "app:build-assets",
                              e,
                              H,
                              G,
                              o,
                              function (t, s, o, a) {
                                if (!r) {
                                  if (t) i(t), (r = !0);
                                  else if (s) {
                                    var l = new w(s, o);
                                    (e.buildResults = l), (e.pacInfos = a);
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
                              i &&
                                i.forEach((i) => {
                                  const r = i.relativePath;
                                  t[r]
                                    ? Editor.warn(
                                        `The AutoAtlas ${r} exists                                                 in two bundles with the same priority: ${e.name}, ${t[r].name}.                                                 This may result in inconsistent atlas data in each bundle.                                                 You can change the priority of one of those bundles to resolve it`
                                      )
                                    : (t[r] = e);
                                }),
                                e.buildResults.getAssetUuids().forEach((t) => {
                                  a[t] || (a[t] = e.name);
                                });
                            });
                          }
                          n(t);
                        }
                      );
                    },
                    (e) => {
                      e || h.normal("Finish build-assets in worker"), n();
                    }
                  );
                }
              },
              -1
            );
        },
        Y,
        !0
      );
    }),
    z.task("build-configs", function (e) {
      if (t.buildScriptsOnly) return e();
      b.eachSeries(
        re,
        (e, i) => {
          P(
            {
              stringify: !1,
              name: e.name,
              importBase: "import",
              nativeBase: "native",
              root: e.root,
              buildResults: e.buildResults,
              sceneList: e.scenes,
              debug: G,
              preview: !1,
              isZip: "zip" === e.compressionType,
              encrypted: X && !J && t.encryptJs && !G,
            },
            (t, r) => {
              (e.config = r), i(t);
            }
          );
        },
        (t) => {
          t ? error(t) : e();
        }
      );
    });
  var se = null,
    ne = null;
  function oe(e, i) {
    var r = [ie.template_shares, e];
    return z.src(r).pipe(D(t)).pipe(z.dest(ee)).on("end", i);
  }
  z.task("build-settings", function (e) {
    let { RESOURCES: i, START_SCENE: r } = cc.AssetManager.BuiltinBundleName;
    var s = Editor.Profile.load("project://project.json"),
      n = {
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
      stringify: !1,
      customSettings: n,
      launchScene: t.scenes[0],
      orientation: X ? "" : Q,
    };
    X && !J && (o.server = t[H].REMOTE_SERVER_ROOT),
      R(o, function (i, r, s) {
        i ? e(i) : ((t.settings = se = r), (ne = s), e());
      });
  }),
    z.task("compress-configs", function (e) {
      if (G || t.buildScriptsOnly) return e();
      function i(e) {
        let t = {},
          i = {};
        function r(e) {
          var r = (t[e] || 0) + 1;
          (t[e] = r), e in i || (i[e] = e);
        }
        let s = e.paths;
        for (let e in s) r(e);
        let n = e.scenes;
        for (let e in n) r(n[e]);
        let o = e.packs;
        for (let e in o) o[e].forEach(r);
        let a = e.versions;
        for (let e in a) {
          let t = a[e];
          for (let e = 0; e < t.length; e += 2) r(t[e]);
        }
        let l = e.redirect;
        for (let e = 0; e < l.length; e += 2) r(l[e]);
        return (
          e.uuids.sort((e, i) => t[i] - t[e]),
          e.uuids.forEach((e, t) => (i[e] = t)),
          i
        );
      }
      for (var r = 0; r < re.length; r++) {
        var s = re[r].config,
          n = i(s);
        let e = s.paths,
          a = (s.paths = {});
        for (let t in e) {
          var o = e[t];
          a[n[t]] = o;
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
    }),
    z.task("build-web-desktop-template", function (e) {
      oe(ie.template_web_desktop, e);
    }),
    z.task("build-web-mobile-template", function (e) {
      oe(ie.template_web_mobile, e);
    }),
    z.task("build-fb-instant-games-template", function (e) {
      oe(ie.template_instant_games, e);
    }),
    z.task("build-plugin-scripts", function (i) {
      let r = N(i);
      Editor.log("Start building plugin scripts");
      var s = Editor.assetdb,
        n = [];
      let o = function (i) {
        for (var r in ne) {
          var o = ne[r];
          let c = s.uuidToFspath(o);
          var a = e.dirname(e.join(ie.src, r));
          console.log(`start gulpping ${c} to ${a}`);
          var l = z.src(c);
          if (!G) {
            var u = Editor.require("unpack://engine/gulp/util/utils").uglify;
            let e = { jsb: X && !J, runtime: J, debug: G, support_jit: !1 },
              r = F(t, H);
            r && Object.assign(e, r),
              (l = l.pipe(u("build", e))),
              d.obj([l]).on("error", function (e) {
                i(e.message);
              });
          }
          (l = l.pipe(z.dest(a)).on("end", () => {
            console.log("finish gulpping", c);
          })),
            n.push(l);
        }
        n.length > 0
          ? c.merge(n).on("end", () => {
              Editor.log("Finish building plugin scripts"), i();
            })
          : i();
      };
      ne
        ? o(r)
        : (function (e, t) {
            Editor.Ipc.sendToMain("app:query-plugin-scripts", e, (e, i) => {
              if (e) return t && t(e, null), void 0;
              let r = {};
              i.forEach((e) => {
                let t = Editor.assetdb.fspathToUuid(e),
                  i = Editor.assetdb.uuidToUrl(t);
                (i = i.slice(M.length)), (r[i] = t);
              }),
                t && t(null, r);
            });
          })(W, (e, t) => {
            if (e) return r(e);
            (ne = t), o(r);
          });
    }),
    z.task("copy-main-js", function () {
      return z
        .src([e.join(ie.tmplBase, "shares/main.js")])
        .pipe(D(t))
        .pipe(z.dest(ee));
    }),
    z.task("copy-build-template", function (r) {
      Editor.Ipc.sendToMain(
        "builder:state-changed",
        "copy-build-templates",
        0.98
      );
      let s = e.basename(t.dest),
        n = e.join(t.project, "build-templates");
      if (!i.existsSync(n)) return r();
      let a = e.join(n, s),
        l = [e.join(a, "**/*")];
      [
        "game.json",
        "project.config.json",
        "project.swan.json",
        "manifest.json",
      ].forEach((t) => {
        l.push(`!${e.join(a, t)}`);
      }),
        o(l, (s, o) => {
          (o = o.map((t) => e.resolve(t))).forEach((r) => {
            let s = e.relative(n, r),
              o = e.join(t.buildPath, s);
            i.ensureDirSync(e.dirname(o)), i.copySync(r, o);
          }),
            r && r(s);
        });
    });
  var ae = require(Editor.url("unpack://engine/gulp/tasks/engine")),
    le = async function (e, i) {
      var r = X ? (J ? "buildRuntime" : "buildJsb") : "buildCocosJs";
      r += G ? "" : "Min";
      let s = ae.excludeAllDepends(t.excludedModules);
      console.log("Exclude modules: " + s);
      let n = { runtime: J, support_jit: !1 },
        o = await (async function (e) {
          let t = await $("compileFlags", e);
          return "object" == typeof t ? t : null;
        })(t);
      o && Object.assign(n, o),
        Object.assign(n, I),
        t.separateEngineMode &&
          ((n.physics_builtin = !1), (n.physics_cannon = !0)),
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
    let r = ue(t),
      s = t,
      n = [],
      o = t[0],
      a = Editor.Utils.UuidUtils.getUuidFromLibPath(o),
      l = e.dirname(o);
    return (
      e.basenameNoExt(l) === a && (s = [l]),
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
      }),
      { hash: r, renamedPaths: n }
    );
  }
  async function de(t) {
    const i = Editor.Utils.UuidUtils.getUuidFromLibPath;
    var r = await s(o)(t, { nodir: !0 });
    let n = {};
    for (let t = 0; t < r.length; t++) {
      let s = r[t],
        o = i(e.relative(ee, s));
      o
        ? (n[o] || (n[o] = []), n[o].push(s))
        : Editor.warn(
            `Can not resolve uuid for path "${s}", skip the MD5 process on it.`
          );
    }
    for (let e in n) {
      let t = n[e];
      (t = t.sort()), (n[e] = ce(t).hash);
    }
    return n;
  }
  function pe(t, r) {
    let s = [t],
      n = K.supportDownloadScript;
    n && s.push(r);
    let o = ue(s);
    try {
      let s = e.join(e.dirname(t), `config.${o}.json`);
      if ((i.renameSync(t, s), n)) {
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
      var r = ie.src,
        s = t.jsList
          .map((t) => e.resolve(r, t))
          .map((t) => {
            return (
              (t = (function (t) {
                let r = ue([t]),
                  s = e.join(
                    e.dirname(t),
                    e.basenameNoExt(t) + "." + r + e.extname(t)
                  );
                try {
                  i.renameSync(t, s);
                } catch (e) {
                  u.log(`[31m[MD5 ASSETS] write file error: ${e.message}[0m`);
                }
                return s;
              })(t)),
              e.relative(r, t).replace(/\\/g, "/")
            );
          });
      s.sort(), (t.jsList = s);
    }
  }
  z.task("build-cocos2d", async function () {
    Editor.Ipc.sendToAll("builder:state-changed", "cut-engine", 0),
      await S.build(t);
    let r = ee;
    X && (r = e.join(ee, "src"));
    let n = await (async function (e) {
      return await $("engineBuildPath", e);
    })(t);
    if (
      (n && (r = n),
      i.ensureDirSync(ie.jsCacheDir),
      t.separateEngineMode && "qgame" === H)
    )
      t.excludedModules = [...T].sort();
    else {
      t.excludedModules = t.excludedModules ? t.excludedModules.sort() : [];
      let e = await s(Editor.assetdb.queryAssets.bind(Editor.assetdb))(
        null,
        "typescript"
      );
      const i = "TypeScript Polyfill";
      let r = t.excludedModules.indexOf(i);
      -1 === r && 0 === e.length
        ? t.excludedModules.push(i)
        : r > -1 && e.length > 0 && t.excludedModules.splice(r, 1);
    }
    let o = !1;
    if (i.existsSync(ie.jsCacheExcludes)) {
      let e = i.readJSONSync(ie.jsCacheExcludes);
      e.excludes &&
        e.version &&
        (o =
          Editor.versions.cocos2d === e.version &&
          e.excludes.toString() === t.excludedModules.toString() &&
          e.sourceMaps === t.sourceMaps &&
          e.separateEngineMode === t.separateEngineMode);
    }
    function a(e) {
      let t = [ie.jsCache];
      V && t.push(ie.jsCache + ".map");
      let i = z.src(t, { allowEmpty: !0 });
      X && (i = i.pipe(l(J ? "cocos2d-runtime.js" : "cocos2d-jsb.js"))),
        (i = i.pipe(z.dest(r))).on("end", e);
    }
    if (o && i.existsSync(ie.jsCache)) return await s(a)(), void 0;
    await s(le)(ie.jsCache),
      await s(a)(),
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
  }),
    z.task("copy-webDebugger", function () {
      var r = e.join(ee, e.basename(ie.webDebuggerSrc));
      return t.embedWebDebugger
        ? s(i.copy)(ie.webDebuggerSrc, r)
        : f(r.replace(/\\/g, "/"), { force: !0 });
    }),
    z.task("revision-asset-jsList", async function () {
      let r = t.md5Cache;
      if (t.buildScriptsOnly)
        return (se.jsList = Object.keys(ne)), r && me(se), void 0;
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
              ),
                (r.config.zipVersion = s);
            }
            continue;
          }
          let n = [],
            o = await de(e.join(r.dest, "import", "**"));
          for (let e in o) n.push(s(e, !0), o[e]);
          let a = [],
            l = await de(e.join(r.dest, "native", "**"));
          for (let e in l) a.push(s(e, !0), l[e]);
          (r.config.versions = { import: n, native: a }),
            (r.buildResults._md5Map = o),
            (r.buildResults._nativeMd5Map = l);
        }
        me(se), console.timeEnd("revision");
      }
    }),
    z.task("save-settings", function (e) {
      var t = O(se, G);
      i.outputFile(ie.settings, t, e);
    }),
    z.task("save-configs", function (r) {
      if (t.buildScriptsOnly) return r();
      for (var s = 0; s < re.length; s++) {
        var n = re[s],
          o = JSON.stringify(n.config, null, G ? 4 : 0);
        i.outputFileSync(e.join(n.dest, "config.json"), o, "utf8");
      }
      r();
    }),
    z.task("compress-bundles", async function () {
      if (!t.buildScriptsOnly)
        for (let t = 0; t < re.length; ++t) {
          let r = re[t];
          if ("zip" !== r.compressionType) continue;
          let s = r.dest,
            n = [e.join(s, "native"), e.join(s, "import")].filter((e) =>
              i.existsSync(e)
            );
          n.length > 0 && (await k.compressDirs(n, s, e.join(s, "res.zip")));
        }
    }),
    z.task("revision-configs", async function () {
      if (t.md5Cache) {
        se.bundleVers = Object.create(null);
        for (let t = 0; t < re.length; t++) {
          let i = re[t],
            r = o.sync(e.join(i.dest, "config.*"), { absolute: !0 });
          0 !== r.length &&
            ((r = r[0]),
            (i.version = pe(r, e.join(i.scriptDest, "index.js"))),
            (se.bundleVers[i.name] = i.version));
        }
      }
    }),
    z.task("revision-other", async function () {
      if (!t.md5Cache) return;
      var i = ["src/*.js", "*"],
        r = ee,
        s = ["index.html"];
      let n = [];
      X &&
        (s = s.concat([
          "main.js",
          "cocos-project-template.json",
          "project.json",
        ]));
      var o = [
        "settings.js",
        "cocos2d-js-min.js",
        "cocos2d-js.js",
        "cocos2d-jsb.js",
        "cocos2d-jsb-min.js",
      ];
      let a = (function (e) {
        let t = F(e.actualPlatform, "md5"),
          i = null;
        t &&
          t.renameIgnore &&
          ((i = t.renameIgnore(e)),
          Array.isArray(i) || Editor.warn("renameIgnore must return an array"));
        return Array.isArray(i) ? i : null;
      })(t);
      a && (s = s.concat(a));
      let l = (function (e) {
        let t = F(e.actualPlatform, "md5"),
          i = null;
        t &&
          t.searchIgnore &&
          ((i = t.searchIgnore(e)),
          Array.isArray(i) || Editor.warn("searchIgnore must return an array"));
        return Array.isArray(i) ? i : null;
      })(t);
      l && (o = o.concat(l));
      let u = (function (e) {
        let t = F(e.actualPlatform, "md5"),
          i = null;
        t &&
          t.globalIgnore &&
          ((i = t.globalIgnore(e)),
          Array.isArray(i) || Editor.warn("renameIgnore must return an array"));
        return Array.isArray(i) ? i : null;
      })(t);
      u && (n = n.concat(u)),
        "fb-instant-games" === t.platform &&
          (s = s.concat(["fbapp-config.json"])),
        Editor.isWin32 && (o = o.map((e) => e.replace(/\\/g, "/"))),
        await new Promise((t, a) => {
          let l = z
            .src(i, { cwd: ee, base: r })
            .pipe(
              p.revision({
                debug: !0,
                hashLength: C,
                dontGlobal: n,
                dontRenameFile: s,
                dontSearchFile: o,
                annotator: function (e, t) {
                  return [{ contents: e, path: t }];
                },
                replacer: function (t, i, r, s) {
                  (".map" === e.extname(t.path) &&
                    s.revPathOriginal + ".map" !== t.path) ||
                    (t.contents = t.contents.replace(i, "$1" + r + "$3$4"));
                },
              })
            )
            .pipe(m())
            .pipe(z.dest(ee));
          l.on("end", t), l.on("error", (e) => a(e));
        });
    }),
    z.task("before-change-files", function (e) {
      let i = require(Editor.url("app://editor/share/build-utils"));
      Editor.Builder.doCustomProcess(
        "before-change-files",
        i.getCommonOptions(t),
        re,
        e
      );
    }),
    z.task("script-build-finished", function (e) {
      let i = require(Editor.url("app://editor/share/build-utils"));
      Editor.Builder.doCustomProcess(
        "script-build-finished",
        i.getCommonOptions(t),
        re,
        e
      );
    }),
    z.task("copy-runtime-scripts", function () {
      var t = e.join(ee, "src");
      return z.src(e.join(ie.tmplBase, "runtime/**/*.js")).pipe(z.dest(t));
    }),
    z.task("before-finish-build", async function () {
      await (async function (e, t) {
        return await $("beforeFinish", e, t);
      })(t, se);
    }),
    z.task("encrypt-src-js", function (r) {
      if (G || !t.encryptJs) return r(), void 0;
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
        e && Editor.warn("Failed to backup js files for debugging.", e),
          y.encryptJsFiles(t, [ie.assets, ie.remote], r);
      });
    }),
    z.task("build-jsb-adapter", function () {
      return Editor.require("app://editor/share/build-jsb-adapter").build({
        rootPath: Editor.url("packages://jsb-adapter"),
        dstPath: e.join(ee, "jsb-adapter"),
        excludedModules: t.excludedModules,
      });
    }),
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
    ),
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
    ),
    z.task(
      x + "web-desktop",
      z.series(
        "build-cocos2d",
        z.parallel("build-common", "copy-webDebugger"),
        "build-web-desktop-template",
        "finish-build"
      )
    ),
    z.task(
      x + "web-mobile",
      z.series(
        "build-cocos2d",
        z.parallel("build-common", "copy-webDebugger"),
        "build-web-mobile-template",
        "finish-build"
      )
    ),
    z.task(
      x + "fb-instant-games",
      z.series(
        "build-cocos2d",
        z.parallel("build-common", "copy-webDebugger"),
        "build-fb-instant-games-template",
        "finish-build"
      )
    ),
    z.task(
      x + "mini-game",
      z.series(
        "build-cocos2d",
        "build-common",
        "script-build-finished",
        "before-finish-build",
        "finish-build"
      )
    ),
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
    ),
    z.task("build-cocos-native-project", function (e) {
      y.build(t, e);
    }),
    z.task(
      "build-native-project",
      z.series(
        "build-cocos-native-project",
        "build-cocos2d",
        "build-jsb-adapter",
        "copy-native-files"
      )
    ),
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
        ],
        r = e.join(Editor.App.path, "cocos2d-x/simulator/win32"),
        s = e.join(ee, "frameworks/runtime-src/proj.win32", "Debug.win32"),
        n = e.join(ee, "frameworks/runtime-src/proj.win32", "Release.win32");
      return (
        i.ensureDirSync(s),
        i.ensureDirSync(n),
        (t = t.map((t) => e.join(r, t))),
        z.src(t, { allowEmpty: !0 }).pipe(z.dest(s)).pipe(z.dest(n))
      );
    }),
    z.task(x + "android", z.parallel("build-native-project")),
    z.task(x + "ios", z.parallel("build-native-project")),
    z.task(x + "win32", z.series("build-native-project", "copy-win32-dll")),
    z.task(x + "mac", z.parallel("build-native-project")),
    z.task(x + "android-instant", z.parallel("build-native-project")),
    z.task(x + "runtime", z.series("build-cocos2d", "copy-native-files"));
  var fe = x + W;
  if (fe in z._registry._tasks) {
    let r = N(g);
    var be = [];
    let s = await (async function (e) {
      let t = await $("delPattern", e);
      return Array.isArray(t) ? t : null;
    })(t);
    if (
      (s
        ? (be = s)
        : X
        ? be.push(ie.assets + "/**/*", ie.remote + "/**/*", ie.src + "/**/*")
        : be.push(e.join(ee, "**/*")),
      t.buildScriptsOnly)
    ) {
      (G ? Editor.log : Editor.warn)(
        Editor.T("BUILDER.build_script_only_tips")
      );
      let r = o.sync([e.join(ie.assets, "*"), e.join(ie.remote, "*")], {
        absolute: !0,
      });
      be.push("!" + ie.assets),
        be.push("!" + ie.remote),
        r.forEach((t) => {
          be.push("!" + t),
            be.push("!" + e.join(t, "config.*")),
            be.push("!" + e.join(t, "import")),
            be.push("!" + e.join(t, "import/**/*")),
            be.push("!" + e.join(t, "native")),
            be.push("!" + e.join(t, "native/**/*")),
            be.push("!" + e.join(t, "*.zip"));
        }),
        be.push("!" + ie.subpackages),
        be.push("!" + ie.subpackages + "/**/*"),
        be.push("!" + ie.src),
        be.push("!" + ie.src + "/settings.js"),
        be.push("!" + ie.src + "/settings.*.js"),
        (function (t) {
          let r = e.join(t.dest, "src"),
            s = o.sync(r + "/settings.*", { absolute: !0 });
          if (0 === s.length) return;
          s = s[0];
          let n = e.extname(s);
          i.renameSync(s, e.join(r, `settings${n}`));
        })(t);
    }
    (be = be.map((e) => e.replace(/\\/g, "/"))), Editor.log("Delete " + be);
    try {
      f.sync(be, { force: !0 }),
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
        }),
        z.task(fe)(function () {
          X || Editor.Ipc.sendToMain("app:update-build-preview-path", ee),
            r(null, re);
        });
    } catch (e) {
      g(e);
    }
  } else {
    var ge = [];
    for (var he in z._registry._tasks)
      0 === he.indexOf(x) && ge.push(he.substring(x.length));
    g(
      new Error(
        r("Not support %s platform, available platform currently: %s", W, ge)
      )
    );
  }
}),
  (exports.getTemplateFillPipe = D),
  (exports.buildSettings = R),
  (exports.buildConfig = P);
