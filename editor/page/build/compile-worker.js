(() => {
  "use strict";
  const { promisify: e } = require("util");
  require("electron").ipcRenderer.on(
    "app:compile-worker-start",
    function (r, t) {
      let i = !1;
      try {
        const e = Editor.Profile.load("global://features.json");
        e && (i = e.get("compile-worker-debug-log") || !1);
      } catch (e) {}
      const firePath = require("fire-path"),
        n = (require("async"), require("globby")),
        s = require("gulp"),
        a = require("del"),
        l = require("fire-fs");
      Editor.isDarwin && require("graceful-fs").gracefulify(require("fs"));
      var browserify = t.cacheDir ? null : require("browserify"),
        persistify = t.cacheDir ? require("persistify") : null;
      let d = !1;
      const p = require("vinyl-source-stream"),
        f = require("vinyl-buffer"),
        m = require("gulp-sourcemaps"),
        g = Editor.require("unpack://engine/gulp/util/utils").uglify,
        b = Editor.require("app://editor/page/refine-sourcemap"),
        h = l.readFileSync(Editor.url("unpack://static/_prelude.js"), "utf8");
      (window.onerror = function (e, r, t, i, o) {
        window.onerror = null;
        var n = o.stack || o;
        if (
          (Editor &&
            Editor.Ipc &&
            Editor.Ipc.sendToMain &&
            Editor.Ipc.sendToMain("metrics:track-exception", n),
          d)
        )
          return s.emit("error", o), !0;
        Editor &&
          Editor.Ipc &&
          Editor.Ipc.sendToMain &&
          Editor.Ipc.sendToMain("editor:renderer-console-error", n);
      }),
        Editor.require("app://editor/share/editor-utils"),
        Editor.require("app://editor/page/asset-db");
      var E = "library/imports",
        y = "Compile error:",
        v = "Error: ",
        w = "Cannot find module ";
      (t.dest = t.dest || "library/bundle.js"),
        (t.platform = t.platform || "editor"),
        (t.debug = !!t.debug),
        (t.sourceMaps = "sourceMaps" in t ? t.sourceMaps : t.debug);
      var q = { proj: firePath.resolve(t.project) };
      t.platform;
      if (firePath.contains(Editor.appPath, q.proj)) {
        return (
          r.reply(
            null,
            new Error(`${y} Invalid project path: ${t.project}`).stack
          ),
          void 0
        );
      }
      Editor.log("Compiling " + q.proj);
      var _ = {},
        j = {};
      function k(e) {
        return firePath.basenameNoExt(e);
      }
      s.task("do-clean", async function () {
        for (let r = 0; r < M.length; ++r) {
          let t = M[r];
          var e = firePath.join(t.scriptDest, "index.js");
          try {
            await a(e.replace(/\\/g, "/"), { force: !0 });
          } catch (r) {
            throw (
              (Editor.error(`Failed to delete ${e}, press [F7] to try again.`),
              r)
            );
          }
        }
      }),
        s.task("clean", s.parallel("do-clean"), function (e) {
          setTimeout(e, 100);
        });
      let x = {},
        $ = [],
        M = t.bundles;
      function C(e, r, n, a, l) {
        var E,
          v = q.proj,
          k = {
            debug: t.sourceMaps,
            basedir: v,
            builtins: [
              "assert",
              "buffer",
              "console",
              "constants",
              "crypto",
              "domain",
              "events",
              "http",
              "https",
              "os",
              "path",
              "punycode",
              "querystring",
              "stream",
              "_stream_duplex",
              "_stream_passthrough",
              "_stream_readable",
              "_stream_transform",
              "_stream_writable",
              "string_decoder",
              "sys",
              "timers",
              "tty",
              "url",
              "util",
              "vm",
              "zlib",
              "_process",
            ],
            extensions: [".ts"],
            ignoreMissing: !0,
            externalRequireName: "window.__require",
            prelude: h,
          };
        e.sort(),
          (function (e, r) {
            if (r._bresolve)
              (r.__bresolve = r._bresolve),
                (r._bresolve = function t(depOne, modulesInfo, a) {
                  r.__bresolve(depOne, modulesInfo, function (r, l, u) {
                    if (r) {
                      if (modulesInfo && modulesInfo.filename) {
                        var c = j[modulesInfo.filename] || j[modulesInfo.filename.toLowerCase()];
                        if (c){
                          modulesInfo.filename = c;
                          modulesInfo.basedir = firePath.dirname(c);
                          return t(depOne, modulesInfo, a);
                        }
                        i &&
                          Editor.warn(
                            `Failed to resolve script "${depOne}" in raw directory: `,
                            modulesInfo
                          );
                      }
                      return a(null, l, u);
                    }
                    var d = _[l];
                    return (
                      d ||
                        ((d = _[l.toLowerCase()]) &&
                          i &&
                          Editor.log(
                            `resolve "${depOne}" to "${d}" by ignoring case mistake`
                          )),
                      a(null, (l = !d && e ? "" : d || l), u)
                    );
                  });
                });
            else if (d) {
              let e = new Error("Failed to patch browserify");
              s.emit("error", e);
            }
          })(
            a,
            (E = t.cacheDir
              ? persistify(k, {
                  recreate: t.recreateCache,
                  cacheId: t.platform + "_" + !!t.debug + "_" + !!t.sourceMaps,
                  cacheDir: t.cacheDir,
                })
              : new browserify(k))
          );
        for (let r = 0; r < e.length; ++r) {
          var x = e[r];
          E.add(x), E.require(x, { expose: firePath.basenameNoExt(x) });
        }
        for (let r = 0; r < $.length; ++r) {
          let t = $[r];
          -1 === e.indexOf(t) && E.exclude(_[t.toLowerCase()]);
        }
        var M = E.bundle()
          .on("error", function (e) {
            Editor.error(e),
              d &&
                ((e = new Error(
                  (function (e) {
                    function r(e, r, t) {
                      if (e.startsWith(r)) {
                        if (!t) return e.slice(r.length);
                        if (e.endsWith(t)) return e.slice(r.length, -t.length);
                      }
                      return "";
                    }
                    var t,
                      i = (e.message || e.toString()).trim();
                    if (!i) return e;
                    if ((t = r(i, "ENOENT, open '", ".js'"))) {
                      let e = firePath.basenameNoExt(t);
                      return `${y} Cannot require '${e}', module not found, ${i}`;
                    }
                    if (
                      (t = r(
                        i,
                        "ENOENT: no such file or directory, open '",
                        ".js'"
                      ))
                    ) {
                      let e = firePath.basenameNoExt(t);
                      return `${y} Cannot require '${e}', module not found, ${i}`;
                    }
                    if (r(i, w)) {
                      let e = w.length + 1,
                        r = i.indexOf("'", e);
                      if (-1 === r) return i;
                      let t = i.slice(e, r);
                      if (firePath.basename(t) === t && firePath.extname(t))
                        return `${y} Cannot require '${t}', module not found, please remove file extension and retry. ( just "require('${firePath.basenameNoExt(
                          t
                        )}');"`;
                      i =
                        i.replace(w, "Cannot require ") + ". Module not found.";
                    }
                    return (
                      e.annotated && (i = i + "\n" + e.annotated), y + " " + i
                    );
                  })(e)
                )),
                s.emit("error", e));
          })
          .pipe(p(n));
        i &&
          E.pipeline.on("file", function (e, r, t) {
            Editor.log(r);
          }),
          (M = M.pipe(f())),
          t.sourceMaps && (M = M.pipe(m.init({ loadMaps: !0 })));
        var C = Editor.require("app://editor/share/build-platforms")[t.platform]
            .isNative,
          N = "runtime" === t.platform;
        let F = {
          jsb: C && !N,
          runtime: N,
          minigame: "mini-game" === t.platform,
          debug: t.debug,
        };
        t.compileFlags && Object.assign(F, t.compileFlags),
          (M = M.pipe(g("build", F))),
          t.sourceMaps && (M = M.pipe(b(_, v)).pipe(m.write("./"))),
          (M = M.pipe(s.dest(r))).on("end", l);
      }
      s.task("query-bundles", function (r) {
        (async function (r) {
          for (let t = 0; t < M.length; ++t) {
            let i = M[t];
            if (((i.scripts = []), !i.root)) continue;
            let o = i.root + "/**/*",
              n = null;
            try {
              n = await e(
                Editor.remote.assetdb.queryMetas.bind(Editor.remote.assetdb)
              )(o, null);
            } catch (e) {
              return r(e);
            }
            n = n.filter((e) => {
              let r = e.assetType();
              return ("javascript" === r || "typescript" === r) && !e.isPlugin;
            });
            for (let e = 0; e < n.length; ++e) {
              let r = n[e],
                t = Editor.assetdb.remote.uuidToFspath(r.uuid);
              i.scripts.push(t);
            }
          }
          r();
        })(r);
      }),
        s.task("get-scripts", function (e) {
          (function (e) {
            var r = firePath.join(E, "**/*.js"),
              t = q.proj,
              i = { cwd: t };
            function s(e) {
              return firePath.relative(i.cwd, e);
            }
            function a(e, r, t) {
              e[r] = t;
              let i = r.toLowerCase();
              i in e || (e[i] = t);
            }
            let l = M.find((e) => !e.root).scripts;
            n(r, i, (r, i) => {
              if (r) return e(r);
              for (var n = 0; n < i.length; n++) {
                var u = i[n],
                  c = k(u),
                  d = Editor.assetdb.remote.uuidToFspath(c);
                if (d) {
                  var p = firePath.resolve(t, u);
                  a(j, p, d), a(_, d, p);
                  var f = firePath.basenameNoExt(d),
                    m = x[f];
                  if (m) {
                    var g = s(d),
                      b = s(m),
                      h = new Error(
                        `${y} Filename conflict, the module "${f}" both defined in "${g}" and "${b}"`
                      );
                    return e(h);
                  }
                  (x[f] = d),
                    M.find((e) => e.scripts.find((e) => firePath.contains(e, d))) ||
                      l.push(d),
                    $.push(d);
                } else
                  Editor.warn(
                    "Can not get fspath of: " +
                      c +
                      " from assetdb, but script found in library."
                  );
              }
              e();
            });
          })(e);
        }),
        s.task("browserify-bundles", async (r) => {
          for (var t = 0; t < M.length; t++) {
            let n = M[t].scripts,
              s = M[t].scriptDest,
              a = !!M[t].root,
              l = "index.js";
            try {
              const t = firePath.join(s, l);
              i && Editor.log("Start Output bundle : " + t);
              await e(C)(n, s, l, a);
              i && Editor.log("End Output bundle : " + t);
            } catch (e) {
              return r(e);
            }
          }
          r();
        }),
        s.task(
          "compile",
          s.series(
            "clean",
            "query-bundles",
            "get-scripts",
            "browserify-bundles"
          )
        ),
        s.once("error", function (e) {
          e = (function (e) {
            return e.error
              ? "boolean" == typeof e.error.showStack
                ? e.error.toString()
                : e.error.stack
                ? e.error
                : new Error(String(e.error))
              : new Error(String(e.message));
          })(e);
          let t = Editor.Utils.toString(e);
          if ("string" == typeof e.stack) {
            if (!(e = e.stack).startsWith(t)) {
              let r = /^.*/.exec(t)[0];
              e.startsWith(r) && (e = (e = e.slice(r.length)).trimLeft()),
                (e = t + "\n" + e);
            }
            e.startsWith(v + y) && (e = e.slice(v.length));
          } else e = t;
          if (d) {
            d = !1;
            let t = null;
            r.reply(t, e);
          }
        }),
        (d = !0),
        s.task("compile")(function () {
          d = !1;
          r.reply(null, null), console.log("Compile Worker Finished");
        });
    }
  );
})();
