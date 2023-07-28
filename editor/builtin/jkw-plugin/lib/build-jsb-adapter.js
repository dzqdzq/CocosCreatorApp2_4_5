const e = require("path");
const r = require("gulp");
const i = require("babelify");
const t = require("browserify");
const n = require("vinyl-source-stream");
const s = require("gulp-uglify");
const u = require("vinyl-buffer");
const o = {
  build: async function (o) {
    let { rootPath: a, dstPath: p, excludedModules: l, isDebug: d } = o;
    if (!a) {
      throw new Error("Please specify the jsbAdapter path");
    }
    console.time("build jsb-adapter");

    await new Promise((o) => {
      let f = [];
      if (l && l.length > 0) {
        let r = require(Editor.url("packages://jsb-adapter/modules.json"));
        l.forEach(function (i) {
          r.some(function (r) {
            if (r.name === i && r.entries) {
              r.entries.forEach(function (r) {
                f.push(e.join(a, r));
              });

              return true;
            }
          });
        });
      }
      (function (o, a, p, l) {
        let d = e.basename(a);
        a = e.dirname(a);
        let f = t();

        o.forEach(function (e) {
          f.add(e);
        });

        if (p) {
          p.forEach(function (e) {
            f.exclude(e);
          });
        }

        let c = require("@babel/preset-env");
        return l
          ? f
              .transform(i, { presets: [c] })
              .bundle()
              .pipe(n(d))
              .pipe(u())
              .pipe(r.dest(a))
          : f
              .transform(i, { presets: [c] })
              .bundle()
              .pipe(n(d))
              .pipe(u())
              .pipe(s())
              .pipe(r.dest(a));
      })([a], p, f, d).on("end", o);
    });

    console.timeEnd("build jsb-adapter");
  },
};
module.exports = o;
