(() => {
  "use strict";
  0;
  const e = require("electron").ipcRenderer;
  var t;
  var r;
  var i;
  var n;
  var o;
  var a;
  const s = "none";
  const l = "default";
  const d = "merge_all_json";

  window.onerror = function (e, t, r, i, n) {
    window.onerror = null;
    var o = n.stack || n;

    if (Editor &&
      Editor.Ipc &&
      Editor.Ipc.sendToMain) {
      Editor.Ipc.sendToMain("app:build-project-abort", o);
      Editor.Ipc.sendToMain("metrics:track-exception", o);
    }
  };

  window.addEventListener("unhandledrejection", function e(t) {
    window.removeEventListener("unhandledrejection", e);
    window.onerror(void 0, void 0, void 0, void 0, t.reason);
  });

  e.on("app:init-build-worker", function (e, s, l) {
    t = require("path");
    r = require("fire-fs");
    require("gulp");
    require("event-stream");
    i = require("async");
    n = require("lodash");
    o = require("../../share/build-platforms");
    Editor.isBuilder = true;
    window.CC_TEST = false;
    window.CC_EDITOR = true;
    window.CC_PREVIEW = false;
    window.CC_DEV = false;
    window.CC_DEBUG = true;
    window.CC_BUILD = false;
    window.CC_JSB = false;
    Editor.require("app://editor/share/editor-utils");
    Editor.require("unpack://engine-dev");
    Editor.require("app://editor/share/engine-extends/init");
    Editor.require("app://editor/share/engine-extends/serialize");
    Editor.require("app://editor/page/asset-db");
    Editor.require("app://editor/share/register-builtin-assets");
    const d = require(Editor.url("app://editor/page/project-scripts"));
    a = Editor.remote.importPath.replace(/\\/g, "/");
    var c = Editor.remote.Builder.actualPlatform2Platform(s);
    var u = !o[c].exportSimpleProject;
    i.waterfall(
      [
        function (e) {
          cc.assetManager.init({ importBase: a, nativeBase: a });
          cc.assetManager.cacheAsset = false;
          cc.assetManager.force = true;
          cc.assetManager.downloader.maxRetryCount = 0;
          cc.assetManager.downloader.limited = false;
          cc.assetManager.downloader.appendTimeStamp = true;
          var t = document.createElement("canvas");
          document.body.appendChild(t);
          t.id = "engine-canvas";

          cc.game.run(
            {
              width: 800,
              height: 600,
              id: "engine-canvas",
              debugMode: cc.debug.DebugMode.INFO,
            },
            e
          );
        },
        Editor.Utils.asyncif(u, d.load.bind(d)),
      ],
      (t) => {
        e.reply(t || null);
      }
    );
  });

  e.on(
    "app:build-assets",
    function (e, { dest: c, root: u, scenes: p }, m, f, w) {
      var E;
      var g;
      var h = 4;
      var b = Editor.remote.Builder.actualPlatform2Platform(m);
      var q = o[b];
      var v = w.hasOwnProperty("pack") ? w.pack : q.pack;
      var k = t.join(c, "import");
      var y = require("./file-writer");
      var x = require("./asset-crawler");
      var C = require("./build-asset");
      var U = require("./group-manager");
      var P = require("./group-strategies");
      var T = require("./texture-packer");
      var j = require("./building-assetdb");
      var S = new y(k, f);
      var _ = new j(Editor.assetdb);
      var A = new T();
      if (w.compressionType === l) {
        if (q.isNative) {
          if (w.optimizeHotUpdate) {
            w.inlineSpriteFrames = false;
          } else {
            if (w.inlineSpriteFrames) {
              Editor.info(
                'Enable "%s" in native platform will increase the package size used in hot update.',
                Editor.T("BUILDER.merge_asset.inline_SpriteFrames")
              );
            }
          }
          v = v && (w.optimizeHotUpdate || w.inlineSpriteFrames);
        }
      } else {
        if (w.compressionType === s) {
          v = false;
        } else {
          if (w.compressionType === d) {
            w.mergeAllJson = true;
            w.inlineSpriteFrames = false;
          } else {
            w.inlineSpriteFrames = false;
          }
        }
      }

      if (v) {
        g = w.compressionType === d
          ? new P.MergeAllJson()
          : q.isNative
          ? w.optimizeHotUpdate
            ? new P.ForHotUpdate()
            : new P.GroupStrategyBase()
          : new P.SizeMinimized();

        console.log("group strategy:", cc.js.getClassName(g));

        E = new U(
            S,
            f,
            g,
            _,
            n.pick(w, "inlineSpriteFrames", "mergeAllJson")
          );
      }

      var M;
      var B;
      var F;
      var I;
      var R = new C(S, a, _, m, w.sharedUuid);
      var z = new x(R, h, A);
      var D = [
        (e) => {
          console.time("queryResources");
          e(null);
        },
        function (e) {
          if (u) {
            Editor.assetdb.queryAssets(`${u}/**/*`, null, function (t, i) {
                  if ("db://internal/resources" === u) {
                    const e = Editor.url("unpack://engine/modules.json");
                    let t = [];
                    try {
                      let i = r.readJsonSync(e);
                      const n =
                        Editor.Profile.load("project://project.json").get(
                          "excluded-modules"
                        ) || [];

                      if (n.length > 0) {
                        i.forEach((e) => {
                          let r = e["internal/resources"];

                          if (n.includes(e.name) && r) {
                            t = t.concat(r);
                          }
                        });
                      }
                    } catch (e) {
                      Editor.warn(e);
                    }
                    console.log("excluded assets：" + JSON.stringify(t));
                    if (
                      (t.length > 0)
                    ) {
                      const e = require("fire-url");
                      i = i.filter((r) => {
                        let i = e.basenameNoExt(r.url);
                        return !t.includes(i);
                      });
                    }
                  }
                  e(t, i);
                });
          } else {
            e(null, []);
          }
        },
        (e, t) => {
          console.timeEnd("queryResources");
          console.time("startAssetCrawler");
          t(null, e);
        },
        function (e, t) {
          var r = e
              .filter(
                (e) =>
                  "folder" !== e.type &&
                  "javascript" !== e.type &&
                  "typescript" !== e.type
              )
              .map((e) => e.uuid);

          var i = p;
          M = n.uniq(i.concat(r));
          z.start(M, t);
        },
        (e, t) => {
          console.timeEnd("startAssetCrawler");
          t(null, e);
        },
        function (e, t) {
          B = e;
          t(null);
        },
      ];
      1;

      D = [].concat(
          function (e) {
            Editor.assetdb.queryAssets("db://**/*.pac", "auto-atlas", e);
          },
          function (e, t) {
            A.init({ root: u, files: e, writer: S, actualPlatform: m })
              .then(t)
              .catch(t);
          },
          D,
          function (e) {
            console.time("pack textures");

            A.pack(B)
              .then((t) => {
              let {
                  unpackedTextures: r,
                  packedSpriteFrames: i,
                  packedTextures: o,
                } = t;

              let a = r.map((e) => e.textureUuid);
              let s = n.pullAll(A.textureUuids, a);
              I = t.pacInfos;
              for (let e in i) B[e] = { dependUuids: [i[e]] };
              for (let e in o) {
                let t = o[e];
                B[e] = { nativePath: t[0], nativePaths: t };
                _.addGeneratedAsset(e, t[0], "texture", false);
              }
              let l = [];
              let d = A.texture2pac;
              if (s.length > 0) {
                for (let e in B) {
                  let t = B[e];
                  if ("object" != typeof t) {
                    continue;
                  }
                  let r = t.dependUuids;
                  if (r) {
                    for (let t = 0, i = r.length; t < i; t++) {
                      let i = r[t];
                      if (-1 !== s.indexOf(i) && -1 === l.indexOf(i)) {
                        l.push(i);
                        let t = Editor.assetdb.remote.uuidToUrl(i);
                        let r = d[i].relativePath;
                        let n = Editor.assetdb.remote.uuidToUrl(e);
                        Editor.warn(
                          Editor.T(
                            "BUILDER.error.keep_raw_texture_of_atlas",
                            { texturePath: t, pacPath: r, assetPath: n }
                          )
                        );
                      }
                    }
                  }
                }
              }
              n.pullAll(M, A.textureUuids);
              if (r.length > 0 || l.length > 0) {
                let t = r
                  .map((e) => {
                  let t = Editor.assetdb.remote.uuidToUrl(
                    e.textureUuid
                  );

                  Editor.warn(
                    `${t} has not been packed into AutoAtlas.`
                  );

                  return e.uuid;
                })
                  .concat(l);

                new x(R, h).start(t, (t, r) => {
                  if (t) {
                    return e(t);
                  }
                  Object.assign(B, r);
                  e();
                });

                M = n.uniq(M.concat(t));
              } else {
                e();
              }
              console.timeEnd("pack textures");
            })
              .catch((t) => e(t));
          }
        );

      if (v) {
        D.push(
          function (e) {
            console.time("init packs");
            E.initPacks(M, B, e);
          },
          function (e) {
            console.timeEnd("init packs");
            console.time("build packs");
            E.buildPacks(e);
          },
          function (e, t) {
            console.timeEnd("build packs");
            F = e.packedAssets;
            t();
          }
        );
      }

      D.push(function (e) {
        S.flush(e);
      });

      i.waterfall(D, function (t) {
        if (t) {
          if (!((t = t && t.stack) instanceof Error)) {
            t = new Error(t);
          }

          e.reply(t);
        } else {
          console.log("finished build-worker");

          M.forEach((e) => {
            var t = B[e];

            if ("object" != typeof t) {
              B[e] = { isRoot: true };
            } else {
              t.isRoot = true;
            }
          });

          if (I &&
            I.length > 0) {
            I = I.map((e) => (delete e.spriteFrames, e));
          }

          e.reply(null, B, F, I);
        }
      });
    }
  );
})();
