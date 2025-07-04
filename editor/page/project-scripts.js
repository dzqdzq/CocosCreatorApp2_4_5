const e = require("fire-path");
const t = require("globby");
const r = require("async");
const i = require("fire-url");
const o = require("lodash");
const n = Editor.remote.ProjectCompiler.DEST_PATH;
const l = e.join(Editor.remote.Project.path, "node_modules");
const a = Editor.remote.ProjectCompiler.INDEX_FILE_PATH;
let s = Object.create(null);
let d = [];

let u = Editor.Profile.load("global://features.json").get(
  "show-circular-import-warning"
) || false;

let c = require("module");
let p = 0;
let m = [];
function f(t) {
  let r = e.basenameNoExt(t);
  delete require.cache[t];
  delete s[r];
}

cc.require = function (t, r) {
  let i;
  r = r || require;
  p++;
  try {
    i = r(t);
  } catch (e) {
    Editor.failed(`load script [${t}] failed : ${e.stack}`);
  }
  let o = m[p - 1];
  if (o && u) {
    let t = m.indexOf(o);
    if (t !== p - 1) {
      let r = [];
      for (let i = t; i < m.length; i++) {
        r.push("  " + e.relative(n, m[i]));
      }
      Editor.warn("Circular import modules => \n" + r.join("\n"));
    }
  }
  p--;
  return i;
};

c._resolveFilenameVendor = c._resolveFilename;

c._resolveFilename = function (t, r, i) {
  if (p > 0) {
    let i = e.basename(t);

    if (i.endsWith(".js")) {
      i = i.slice(0, -3);
    }

    let o = s[i];
    if (!(function (e) {
      return -1 !== e.replace(/\\/g, "/").indexOf("/node_modules/");
    })(r.filename) &&
    o) {
      m[p - 1] = o.path;
      return o.path;
    }
  }

  if (!r.paths.includes(l)) {
    r.paths.push(l);
  }

  return c._resolveFilenameVendor(t, r, i);
};

let h = [];

module.exports = {
  getPluginScriptUuidByPath: (e) => h[e],
  load: function (e) {
    r.series([this.loadPlugins.bind(this), this.loadCommon.bind(this)], e);
  },
  loadScript: function (e, t) {
    var r = document.createElement("script");

    r.onload = function () {
      r.remove();
      t();
    };

    r.onerror = function () {
      r.remove();
      Editor.error("Failed to load %s", e);
      t(new Error("Failed to load " + e));
    };

    r.setAttribute("type", "text/javascript");
    r.setAttribute("charset", "utf-8");
    let o = Editor.remote.assetdb.fspathToUuid(
      e.replace("disable-commonjs://", "")
    );
    e = i.addRandomQuery(e);
    h[e] = o;
    r.setAttribute("src", e);
    document.head.appendChild(r);
  },
  loadPlugins: function (t) {
    console.time("query plugin scripts");

    Editor.Ipc.sendToMain(
      "app:query-plugin-scripts",
      "editor",
      (i, o) => {
        console.timeEnd("query plugin scripts");
        if (i) {
          return t(i);
        }
        d = o.map((t) => e.stripSep(t));
        h.length = 0;

        r.eachSeries(
          o,
          (e, t) => {
            this.loadScript("disable-commonjs://" + e, t);
          },
          t
        );
      },
      6e5
    );
  },
  loadCommon: function (r) {
    for (let e in s) {
      f(s[e].path);
    }
    s = {};
    let i = [e.join(n, "/**/*.js"), "!" + e.join(n, "__node_modules/**")];
    t(i, (t, i) => {
      (i = o(i)
        .map((t) => e.stripSep(t))
        .filter((e) => -1 === d.indexOf(e))
        .sortBy()
        .value()).forEach((t) => {
        (function (t, r) {
          r = r || e.basenameNoExt(t);
          let i = s[r];

          if (!i) {
            i = s[r] = { name: r, path: t, children: [] };
          }

          return i;
        })(t);
      });

      (function (e) {
        m.length = 0;
        p++;
        try {
          require(e);
        } catch (t) {
          Editor.failed(`load script [${e}] failed : ${t.stack}`);
        }
        p--;
      })(a);

      if (r) {
        r();
      }
    });
  },
};
