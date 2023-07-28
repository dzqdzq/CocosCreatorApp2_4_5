const e = require("path");
const i = require("fs");
const n = require("gulp");
const t = (require("gulp-sourcemaps"), require("babelify"));
const r = require("browserify");
const s = require("vinyl-source-stream");
const o = (require("gulp-uglify"), require("vinyl-buffer"));
const a = (require("async"), require("aliasify"));
const u = /[Ww]eb[Vv]iew/;
function l(n, t) {
  if (!i.existsSync(t)) {
    return true;
  }
  let r = i.statSync(t);
  return (function n(t, r) {
    return i.readdirSync(t).some((s) => {
      let o = e.join(t, s);
      let a = i.statSync(o);
      return a.isDirectory() ? n(o, r) : a.mtime.getTime() > r || void 0;
    });
  })(e.dirname(n), r.mtime.getTime());
}
function d(i, l, d) {
  let b = e.basename(l);

  let c = (function (e) {
    return !!e && e.some((e) => /.*jsb-webview(\.js)?/.test(e));
  })(d);

  l = e.dirname(l);
  let j = r(i);

  if (d) {
    d.forEach(function (e) {
      j.exclude(e);
    });
  }

  j = j.transform(t, { presets: [require("@babel/preset-env")] });

  if (c) {
    j = j.transform(a, {
        replacements: { ".*jsb-webview(.js)?": false },
        verbose: false,
      });
  }

  return j
    .bundle()
    .pipe(s(b))
    .pipe(o())
    .on("data", function (e) {
      if (c) {
        let i = e.contents.toString();
        if (u.test(i)) {
          throw new Error("WebView field still exists in jsb-adapter");
        }
      }
    })
    .pipe(n.dest(l));
}
function b(e, i) {
  return n.src(e).pipe(n.dest(i));
}
const c = {
  prebuild: async function (i) {
    let { rootPath: n, dstPath: t } = i;
    if (!n) {
      throw new Error("Please specify the jsbAdapter path");
    }
    console.time("build jsb-adapter");

    await new Promise((i) => {
      let r = e.join(n, "./builtin/index.js");
      let s = e.join(t, "./jsb-builtin.js");

      if (l(r, s)) {
        d(r, s).on("end", i);
      } else {
        i();
      }
    });

    await new Promise((i) => {
      let r = e.join(n, "./engine/index.js");
      let s = e.join(t, "./jsb-engine.js");

      if (l(r, s)) {
        d(r, s).on("end", i);
      } else {
        i();
      }
    });

    console.timeEnd("build jsb-adapter");
  },
  build: async function (i) {
    let { rootPath: n, dstPath: t, excludedModules: r } = i;
    if (!n) {
      throw new Error("Please specify the jsbAdapter path");
    }
    console.time("build jsb-adapter");

    await new Promise((i) => {
      b(e.join(n, "./bin/jsb-builtin.js"), t).on("end", i);
    });

    await new Promise((i) => {
      if (r && r.length > 0) {
        let s = [];
        let o = require(Editor.url("packages://jsb-adapter/modules.json"));

        r.forEach(function (i) {
          o.some(function (t) {
            if (t.name === i && t.entries) {
              t.entries.forEach(function (i) {
                s.push(e.join(n, i));
              });

              return true;
            }
          });
        });

        d(
          e.join(n, "./engine/index.js"),
          e.join(t, "./jsb-engine.js"),
          s
        ).on("end", i);
      } else {
        b(e.join(n, "./bin/jsb-engine.js"), t).on("end", i);
      }
    });

    console.timeEnd("build jsb-adapter");
  },
};
module.exports = c;
