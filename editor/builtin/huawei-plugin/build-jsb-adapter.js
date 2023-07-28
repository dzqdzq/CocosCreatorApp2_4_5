const e = require("path");
const r = (require("fs"), require("gulp"));
const i = (require("gulp-sourcemaps"), require("babelify"));
const t = require("browserify");
const s = require("vinyl-source-stream");
const u = require("gulp-uglify");
const p = require("vinyl-buffer");
require("async");
const n = {
  build: async function (n) {
    let { rootPath: a, dstPath: o, isDebug: l } = n;
    if (!a) {
      throw new Error("Please specify the jsbAdapter path");
    }
    console.time("build jsb-adapter");

    await new Promise((n) => {
      (function (n, a, o, l) {
        let d = e.basename(a);
        a = e.dirname(a);
        let b = t(n);

        if (o) {
          o.forEach(function (e) {
            b.exclude(e);
          });
        }

        let c = require("@babel/preset-env");
        return true === l
          ? b
              .transform(i, { presets: [c] })
              .bundle()
              .pipe(s(d))
              .pipe(p())
              .pipe(r.dest(a))
          : b
              .transform(i, { presets: [c] })
              .bundle()
              .pipe(s(d))
              .pipe(p())
              .pipe(u())
              .pipe(r.dest(a));
      })(a, o, void 0, l).on("end", n);
    });

    console.timeEnd("build jsb-adapter");
  },
};
module.exports = n;
