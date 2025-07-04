"use strict";
const { ipcMain: e } = require("electron");
const t = require("../../core/gulp-build");
const i = require("../../share/bundle-utils");
const r = require("path");
var n;
var app;
var o;
var aasdasCall;
var c;
var d = false;
function u() {
  var e = Editor.require("app://asset-db/lib/meta").get(
      Editor.assetdb,
      Editor.currentSceneUuid
    );

  var t = Editor.stashedScene.sceneJson;
  if (e) {
    var i = JSON.parse(t);
    var r = Editor.serialize.findRootObject(i, "cc.SceneAsset");

    if (r) {
      r.asyncLoadAssets = e.asyncLoadAssets;
    } else {
      Editor.warn("Can not find cc.SceneAsset in stashed scene");
    }

    var n = Editor.serialize.findRootObject(i, "cc.Scene");

    if (n) {
      n.autoReleaseAssets = e.autoReleaseAssets;
    } else {
      Editor.warn("Can not find cc.Scene in stashed scene");
    }

    return JSON.stringify(i);
  }
  return t;
}
let l = {
  userMiddlewares: [],
  _previewPort: 7456,
  _listenByPort(e, t) {
    if (o) {
      o.close();

      (function e(t, i, r) {
        function n() {
          t.removeListener("error", s);
          r(null, i);
        }
        function s(s) {
          t.removeListener("listening", n);
          if ("EADDRINUSE" !== s.code && "EACCES" !== s.code) {
            return r(s);
          }

          Editor.warn(
            `The current '${i}' preview port is already occupied, the port is automatically incremented`
          );

          e(t, ++i, r);
        }
        t.once("error", s);
        t.once("listening", n);
        t.listen(i);
      })(o, e, (e, i) => {
        if (e) {
          Editor.warn(e);

          if (t) {
            t(e);
          }

          return;
        }
        this._previewPort = i;
        Editor.success(`preview server running at http://localhost:${i}`);
        Editor.Ipc.sendToAll("preview-server:preview-port-changed", i);

        if (t) {
          t();
        }
      });
    } else {
      if (t) {
        t();
      }
    }
  },
  start: function (t, i) {
    var r = require("fire-fs");
    var d = require("fire-path");
    var l = require("os");
    var p = require("del");
    var express = require("express");
    var g = require("http");
    var v = require("mobile-detect");
    var h = require("async");
    const m = require("compression");
    var j = this;
    this._validateStashedScene = t;
    var E = d.join(l.tmpdir(), "fireball-game-builds");
    p.sync(d.join(E, "**/*").replace(/\\/g, "/"), { force: true });
    app = express();
    app.use(m());
    let w = d.join(Editor.Project.path, "preview-templates");

    if (!r.existsSync(w)) {
      w = Editor.url("unpack://static/preview-templates");
    }

    app.set("views", w);
    app.set("view engine", "jade");
    const b = require("ejs");
    function S(e, t) {
      var i = e.params[1];
      if (Editor.stashedScene &&
      Editor.currentSceneUuid &&
      d.basenameNoExt(i) === Editor.currentSceneUuid) {
        t.send(u());
        return;
      }
      i = d.join(Editor.importPath, i);
      t.sendFile(i);
    }
    app.engine("html", b.renderFile);
    app.engine("ejs", b.renderFile);
    app.locals.basedir = app.get("views");

    app.use(function (e, t, i) {
      var r = j.userMiddlewares;

      if (Array.isArray(r) && r.length > 0) {
        h.eachSeries(
              r,
              (i, r) => {
                if (!i) {
                  Editor.warn(
                    "Web Preview: Invalid element in userMiddlewares, please check your editor packages."
                  );

                  return r(null);
                }
                i(e, t, r);
              },
              i
            );
      } else {
        i();
      }
    });

    app.use("/build", function (e, t, i) {
      if (aasdasCall) {
        aasdasCall(e, t, i);
      } else {
        t.send("Please build your game project first!");
      }
    });

    app.use("/preview-android-instant", function (e, t, i) {
      if (c) {
        c(e, t, i);
      } else {
        t.send("Please build your android instant project first!");
      }
    });

    app.get("/", function (e, t) {
      var i = e.headers["user-agent"];
      var n = new v(i);

      var s = r.existsSync(
        d.join(Editor.Project.path, "library", "bundle.project.js")
      );

      var o = -1 !== i.indexOf("MicroMessenger");

      let a = Editor.require(
          "app://editor/share/quick-compile/check-auto-build-engine"
        )()
          ? ".cache/dev/__quick_compile__.js"
          : "cocos2d-js-for-preview.js";

      let c = true;
      let u = false;

      let l = Editor.Profile.load("project://project.json").get(
        "excluded-modules"
      );

      if (l) {
        c = !l.includes("3D Physics/cannon.js");
        u = !l.includes("3D Physics/Builtin");
      }

      let p = {
        title: "CocosCreator | " + Editor.Project.name,
        cocos2d: a,
        hasProjectScript: s,
        tip_sceneIsEmpty: Editor.T("PREVIEW.scene_is_empty"),
        enableDebugger: !!n.mobile() || o,
        enableCannonPhysics: c,
        enableBuiltinPhysics: u,
      };
      try {
        Object.assign(p, r.readJsonSync(d.join(w, "configs/options.json")));
      } catch (e) {}
      t.render(
        r.existsSync(d.join(w, "index.html"))
          ? "index.html"
          : r.existsSync(d.join(w, "index.ejs"))
          ? "index.ejs"
          : "index",
        p
      );
    });

    app.get("/compile", function (e, t) {
      Editor.Compiler.compileScripts(false, (e, i) => {
        if (!i) {
          if (e) {
            t.send("Compiling script successful!");
            Editor.Compiler.reload();
          } else {
            t.send("Compile failed!");
          }
        }
      });
    });

    app.get("/update-db", function (e, t) {
      Editor.assetdb.submitChanges();
      t.send("Changes submitted");
    });

    app.get(["/app/engine/*", "/engine/*"], function (e, t) {
      var i = d.join(Editor.url("unpack://engine"), e.params[0]);
      t.sendFile(i);
    });

    app.get("/engine-dev/*", function (e, t) {
      var i = d.join(Editor.url("unpack://engine-dev"), e.params[0]);
      t.sendFile(i);
    });

    app.get("/app/editor/static/*", function (e, t) {
      var i = Editor.url("unpack://static/" + e.params[0]);
      t.sendFile(i);
    });

    app.get("/app/*", function (e, t) {
      var i = Editor.url("app://" + e.params[0]);
      t.sendFile(i);
    });

    app.get("/project/*", function (e, t) {
      var i = d.join(Editor.Project.path, e.params[0]);
      t.sendFile(i);
    });

    app.get("/preview-scripts/*", function (e, t) {
      let i = Editor.ProjectCompiler.DEST_PATH;
      var r = d.join(i, e.params[0]);
      t.sendFile(r);
    });

    app.get("/plugins/*", function (e, t) {
      var i = e.params[0];
      i = Editor.assetdb._fspath("db://" + i);
      t.sendFile(i);
    });

    app.get("/assets/*/import/*", S);
    app.get("/assets/*/native/*", S);

    app.get("/assets/*/config.json", function (e, t) {
      j.query(`${e.params[0]}/config.json`, function (e, i) {
        if (e) {
          return t.status(404).send({ error: e.message });
        }
        t.send(i);
      });
    });

    app.get("/assets/*/index.js", function (e, t) {
      t.send("");
    });

    app.get("/settings.js", function (e, t) {
      j.query("settings.js", function (e, r) {
        if (e) {
          return i(e);
        }
        t.send(r);
      });
    });

    app.get("/preview-scene.json", function (e, t) {
      j.getPreviewScene(
        function (e) {
          return i(e);
        },
        function (e) {
          t.send(e);
        },
        function (e) {
          t.sendFile(e);
        }
      );
    });

    app.get("/*", function (e, t, i) {
      return express.static(w)(e, t, i);
    });

    app.use(function (e, t, i, r) {
      console.error(e.stack);
      r(e);
    });

    app.use(function (e, t, i, r) {
      if (t.xhr) {
        i.status(e.status || 500).send({ error: e.message });
      } else {
        r(e);
      }
    });

    app.use(function (e, t) {
      t.status(404).send({ error: "404 Error." });
    });

    o = g.createServer(app);
    let y = Editor.Profile.load("project://project.json");
    this._listenByPort((y && y.get("preview-port")) || this._previewPort, i);

    (function (e) {
      var t = 0;
      (n = require("socket.io")(e)).on("connection", function (e) {
        e.emit("connected");
        t += 1;
        Editor.Ipc.sendToMainWin("preview-server:connects-changed", t);

        e.on("disconnect", function () {
          t -= 1;
          Editor.Ipc.sendToMainWin("preview-server:connects-changed", t);
        });
      });
    })(o);

    e.removeAllListeners("preview-server:use-new-preview-port");

    e.on("preview-server:use-new-preview-port", (e, t) => {
      if (this._previewPort !== t) {
        this._listenByPort(t);
      }
    });
  },
  query: async function (e, n, s) {
    if (this._validateStashedScene) {
      switch ((void 0 === s && ((s = n), (n = "web-desktop")), e)) {
        case "settings.js":
          this._validateStashedScene(async () => {
            let e = Editor.Profile.load("project://project.json");
            var r = await i.queryBundleFolders();
            let o = {
              designWidth: Editor.stashedScene.designWidth,
              designHeight: Editor.stashedScene.designHeight,
              groupList: e.get("group-list"),
              collisionMatrix: e.get("collision-matrix"),
              platform: n,
              scripts: Editor.ProjectCompiler.scripts,
              hasResourcesBundle: !!r.find((e) => "resources" === e.name),
            };
            t.buildSettings(
              {
                customSettings: o,
                launchScene: Editor.sceneList[0],
                debug: true,
                preview: true,
              },
              s
            );
          });
          break;
        case "stashed-scene.json":
          this._validateStashedScene(() => {
            if (s) {
              s(null, u());
            }
          });
          break;
        case "main/config.json":
        case "internal/config.json":
        case "resources/config.json":
        default:
          var o = r.dirname(e);
          var a = await i.queryBundlesWithScenes();
          var c = await i.queryBundleFolders();
          c.push({ name: cc.AssetManager.BuiltinBundleName.MAIN, url: "" });
          var d = c.find((e) => e.name === o);
          if (!d) {
            return s(new Error("Bundle does not exist!"));
          }
          t.buildConfig(
            {
              name: o,
              importBase: "web-desktop" !== n ? "" : "import",
              nativeBase: "web-desktop" !== n ? "" : "native",
              root: d.url,
              sceneList: a[o] ? a[o].map((e) => e.uuid) : [],
              debug: true,
              preview: true,
            },
            s
          );
      }
    }
  },
  getPreviewScene(e, t, i) {
    let r = Editor._projectProfile.get("start-scene");
    if ("current" !== r &&
    r !== Editor.currentSceneUuid &&
    Editor.assetdb.existsByUuid(r)) {
      i(Editor.assetdb._uuidToImportPathNoExt(r) + ".json");
    } else {
      this.query("stashed-scene.json", (i, r) => {
        if (i) {
          return e(i);
        }
        t(r);
      });
    }
  },
  stop: function () {
    if (o) {
      o.close(function () {
        Editor.info("shutdown preview server");
        o = null;
      });
    }
  },
  browserReload: function () {
    if (!d) {
      d = setTimeout(function () {
        n.emit("browser:reload");
        clearTimeout(d);
        d = false;
      }, 50);
    }
  },
  setPreviewBuildPath: function (e) {
    var t = require("express");
    aasdasCall = t.static(e);
  },
  setPreviewAndroidInstantPath: function (e) {
    var t = require("express");
    Editor.log("express path is ", e);
    c = t.static(e);
  },
  _validateStashedScene: null,
};

Object.defineProperty(l, "previewPort", {
  get() {
    return this._previewPort;
  },
  set(e) {
    this._previewPort = e;
    this._listenByPort(e);
  },
});

module.exports = l;
