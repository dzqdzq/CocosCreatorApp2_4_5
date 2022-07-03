"use strict";
let e = {};
module.exports = e;
const n = require("electron"),
  a = require("fire-path"),
  fireFs = require("fire-fs"),
  i = require("async"),
  r = require("semver"),
  o = require("lodash"),
  l = require("../profile"),
  d = require("./console"),
  s = require("./main-menu"),
  c = require("./ipc"),
  f = require("../app"),
  u = require("./i18n"),
  p = require("../share/ipc-listener");
let m = "en",
  h = {},
  g = {},
  y = {},
  $ = {},
  k = {},
  P = [];
function j(e, n) {
  return -1 === n.indexOf(":") ? `${e}:${n}` : n;
}
(e.load = function (P, v) {
  if (g[P] || y[P]) return v && v(), void 0;
  y[P] = "load";
  let _,
    b = a.join(P, "package.json");
  try {
    _ = JSON.parse(fireFs.readFileSync(b));
  } catch (e) {
    return (
      delete y[P],
      v && v(new Error(`Failed to load 'package.json': ${e.message}`)),
      void 0
    );
  }
  if (!_.name)
    return (
      delete y[P],
      d.warn(`Invalid package name: The plug-in name is not defined \n  ${P}.`),
      v &&
        v(
          new Error(
            "Failed to load 'package.json': The plug-in name is not defined."
          )
        ),
      void 0
    );
  _.name !== _.name.toLowerCase() &&
    ((_.name = _.name.toLowerCase()),
    d.warn(
      `Invalid package name: ${_.name}: do not contains uppercase characters.`
    ));
  for (let e in _.hosts) {
    let n = h[e];
    if (!n)
      return (
        delete y[P], v && v(new Error(`Host '${e}' does not exist.`)), void 0
      );
    let a = _.hosts[e];
    if (!r.satisfies(n, a, { includePrerelease: !0 }))
      return (
        delete y[P], v && v(new Error(`Host '${e}' require ver ${a}`)), void 0
      );
  }
  i.series(
    [
      (n) => {
        let a = _.packages;
        if (
          (_.pkgDependencies &&
            (d.warn(
              `Package ${_.name} parse warning: "pkgDependencies" is deprecated, use "packages" instead.`
            ),
            (a = _.pkgDependencies)),
          !a)
        )
          return n(), void 0;
        i.eachSeries(
          Object.keys(a),
          (n, a) => {
            let t = e.find(n);
            if (!t) return a(new Error(`Cannot find dependent package ${n}`));
            e.load(t, a);
          },
          n
        );
      },
      (i) => {
        (_._path = P),
          (_._destPath = P),
          _["entry-dir"] && (_._destPath = a.join(_._path, _["entry-dir"]));
        let r = a.join(_._destPath, "i18n", `${m}.js`);
        if (fireFs.existsSync(r))
          try {
            u.extend({ [_.name]: require(r) });
          } catch (e) {
            return i(new Error(`Failed to load ${r}: ${e.stack}`)), void 0;
          }
        let c = null;
        if (_.main) {
          let e = a.join(_._destPath, _.main);
          try {
            c = require(e);
          } catch (e) {
            return i(new Error(`Failed to load ${_.main}: ${e.stack}`)), void 0;
          }
        }
        if (c) {
          let e = new p();
          for (let n in c.messages) {
            let a = c.messages[n];
            "function" == typeof a && e.on(j(_.name, n), a.bind(c));
          }
          _._ipc = e;
        }
        let f = _["main-menu"];
        if ((f = Editor.openEduMode ? null : f) && "object" == typeof f)
          for (let e in f) {
            let t = u.formatPath(e),
              i = a.dirname(t);
            if ("." === i) {
              d.failed(`Failed to add menu ${t}`);
              continue;
            }
            let r = f[e],
              o = Object.assign({ label: a.basename(t) }, r);
            if (r.icon) {
              let e = n.nativeImage.createFromPath(a.join(_._destPath, r.icon));
              o.icon = e;
            }
            s.add(i, o);
          }
        let h = _,
          v = !1;
        _.panels &&
          (d._temporaryConnent(),
          d.warn(
            `\n           Package ${_.name} parse warning: "panels" is deprecated, use "panel" instead.\n           For multiple panel, use "panel.x", "panel.y" as your register field.\n           NOTE: Don't forget to change your "Editor.Ipc.sendToPanel" message, since your panelID has changed.\n        `
          ),
          d._restoreConnect(),
          (h = _.panels),
          (v = !0));
        for (let e in h) {
          if (0 !== e.indexOf("panel")) continue;
          let n = h[e];
          for (let e in n.profiles) {
            d._temporaryConnent(),
              d.warn(
                `The profile of the panel (${_.name}) needs to be moved to the package root`
              ),
              d._restoreConnect(),
              _.profiles || (_.profiles = {}),
              _.profiles[e] || (_.profiles[e] = {});
            let a = n.profiles[e],
              t = _.profiles[e];
            Object.keys(a).forEach((e) => {
              t[e] = a[e];
            });
          }
        }
        if (_.profiles)
          try {
            for (let e in _.profiles) {
              l.load(`${e}://${_.name}.json`).mergeData(_.profiles[e]);
            }
          } catch (e) {
            d.failed(`Initial Package Profile [${_._destPath}] failed！` + e);
          }
        for (let e in h) {
          let n;
          if (v) n = `${_.name}.${e}`;
          else {
            if (0 !== e.indexOf("panel")) continue;
            n = e.replace(/^panel/, _.name);
          }
          if (k[n]) {
            d.failed(
              `Failed to load panel "${e}" from "${_.name}", the panelID ${n} already exists`
            );
            continue;
          }
          let i = h[e];
          if (
            (o.defaults(i, {
              path: _._destPath,
              type: "dockable",
              title: n,
              popable: !0,
              "shadow-dom": !0,
              frame: !0,
              resizable: !0,
              devTools: !0,
              profileTypes: Object.keys(_.profiles || {}),
              engineSupport: !1,
            }),
            !i.main)
          ) {
            d.failed(
              `Failed to load panel "${e}" from "${_.name}", "main" field not found.`
            );
            continue;
          }
          let r = i.main;
          fireFs.existsSync(a.join(_._destPath, r)) ||
          ((r = r.replace(/\.js$/, ".ccc")),
          fireFs.existsSync(a.join(_._destPath, r)))
            ? (k[n] = i)
            : d.failed(
                `Failed to load panel "${e}" from "${_.name}", main file "${i.main}" not found.`
              );
        }
        if (((g[P] = _), ($[_.name] = P), c && c.load))
          try {
            c.load(), (y[P] = "ready");
          } catch (n) {
            return (
              e.unload(P, () => {
                i(new Error(`Failed to execute load() function: ${n.stack}`));
              }),
              void 0
            );
          }
        i();
      },
      (e) => {
        if (f.loadPackage) return f.loadPackage(_, e), void 0;
        e();
      },
      (e) => {
        d.success(`${_.name} loaded`),
          c.sendToWins("editor:package-loaded", _.name),
          e();
      },
    ],
    (e) => {
      e ? delete y[P] : (y[P] = "ready"), v && v(e);
    }
  );
}),
  (e.unload = function (e, n) {
    let t = g[e];
    if (!t || "ready" !== y[e]) return n && n(), void 0;
    const r = y[e];
    (y[e] = "unload"),
      i.series(
        [
          (e) => {
            if (f.unloadPackage) return f.unloadPackage(t, e), void 0;
            e();
          },
          (n) => {
            u.unset([t.name]);
            let i = t,
              r = !1;
            t.panels && ((i = t.panels), (r = !0));
            for (let e in i) {
              let n;
              if (r) n = `${t.name}.${e}`;
              else {
                if (0 !== e.indexOf("panel")) continue;
                n = e.replace(/^panel/, t.name);
              }
              delete k[n];
            }
            let o = t["main-menu"];
            if ((o = Editor.openEduMode ? null : o) && "object" == typeof o)
              for (let e in o) {
                let n = u.formatPath(e);
                s.remove(n);
              }
            if ((t._ipc && t._ipc.clear(), t.main)) {
              let e = require.cache,
                n = a.join(t._destPath, t.main),
                i = e[n];
              if (!i) {
                t._destPath = fireFs.realpathSync(t._destPath);
                i = e[(n = a.join(t._destPath, t.main))];
              }
              if (i) {
                let a = i.exports;
                if (a && a.unload)
                  try {
                    a.unload();
                  } catch (e) {
                    d.failed(
                      `Failed to unload "${t.main}" from "${t.name}": ${e.stack}.`
                    );
                  }
                (function e(n, a) {
                  if (!n) return;
                  let t = [];
                  a.forEach((e) => {
                    let a = e.filename;
                    0 === a.indexOf(n) &&
                      require.cache[a] &&
                      (e.children.forEach((e) => {
                        t.push(e);
                      }),
                      delete require.cache[a]);
                  });
                  t.length > 0 && e(n, t);
                })(t._destPath, i.children),
                  delete e[n];
              } else
                d.failed(`Failed to uncache module ${t.main}: Cannot find it.`);
            }
            delete g[e],
              delete $[t.name],
              d.success(`${t.name} unloaded`),
              c.sendToWins("editor:package-unloaded", t.name),
              n();
          },
        ],
        (a) => {
          a ? (y[e] = r) : delete y[e], n && n(a);
        }
      );
  }),
  (e.reload = function (n, a) {
    const t = y[n];
    (t && "ready" !== t) ||
      i.series(
        [
          (e) => {
            if (!g[n]) return e(), void 0;
            e();
          },
          (a) => {
            e.unload(n, a);
          },
          (a) => {
            e.load(n, a);
          },
        ],
        (e) => {
          a && a(e);
        }
      );
  }),
  (e.panelInfo = function (e) {
    return k[e];
  }),
  (e.packageInfo = function (e) {
    for (let n in g) if (a.contains(n, e)) return g[n];
    return null;
  }),
  (e.packagePath = function (e) {
    return $[e];
  }),
  (e.addPath = function (e) {
    Array.isArray(e) || (e = [e]), (P = o.union(P, e));
  }),
  (e.removePath = function (e) {
    let n = P.indexOf(e);
    -1 !== n && P.splice(n, 1);
  }),
  (e.resetPath = function () {
    P = [];
  }),
  (e.find = function (e) {
    for (let n = 0; n < P.length; ++n) {
      let i = P[n];
      if (fireFs.isDirSync(i)) {
        if (-1 !== fireFs.readdirSync(i).indexOf(e)) return a.join(i, e);
      }
    }
    return null;
  }),
  Object.defineProperty(e, "paths", { enumerable: !0, get: () => P.slice() }),
  Object.defineProperty(e, "lang", {
    enumerable: !0,
    set(e) {
      m = e;
    },
    get: () => m,
  }),
  Object.defineProperty(e, "versions", {
    enumerable: !0,
    set(e) {
      h = e;
    },
    get: () => h,
  });
const v = n.ipcMain;
function _(e) {
  let n = {};
  try {
    e._ipc ? delete (n = JSON.parse(JSON.stringify(e)))._ipc : (n = e);
  } catch (e) {
    Editor.erro(e);
  }
  return n;
}
v.on("editor:package-query-infos", (e) => {
  let n = [];
  for (let e in g) n.push({ path: e, enabled: !0, info: _(g[e]) });
  e.reply(null, n);
}),
  v.on("editor:package-query-info", (e, n) => {
    let a = $[n];
    (a = a || ""), e.reply(null, { path: a, enabled: !0, info: _(g[a]) });
  }),
  v.on("editor:package-reload", (n, a) => {
    let t = $[a];
    if (!t) return d.error(`Failed to reload package ${a}, not found`), void 0;
    e.reload(t);
  });
