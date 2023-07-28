const e = {};
const r = require("browserify");
const t = require("babelify");
const a = require("@babel/core");
const i = require("vinyl-source-stream");
const o = require("vinyl-buffer");
const n = require("gulp-uglify");
const s = require("event-stream");
const u = (require("fs"), require("path"));
const c = require("gulp");
const l = Editor.require("packages://adapters/modules.json");
const p = [require("@babel/preset-env")];

const d = [
  [require("@babel/plugin-proposal-decorators"), { legacy: true }],
  [require("@babel/plugin-proposal-class-properties"), { loose: true }],
  [require("babel-plugin-add-module-exports")],
  [require("@babel/plugin-proposal-export-default-from")],
];

let f = {
  wechatgame: "wechat",
  "wechatgame-subcontext": "wechat",
  baidugame: "baidu",
  "baidugame-subcontext": "baidu",
  "bytedance-subcontext": "bytedance",
};
function b(e) {
  e = f[e] || e;
  return Editor.url(`packages://adapters/platforms/${e}`);
}

e.buildAdapter = function (
  { actualPlatform: e, debug: a, excludedModules: s, dest: f },
  g
) {
  return new Promise((h, m) => {
    let q = u.join(b(e), "index.js");
    let y = r(q);

    (function (e) {
        let r = [];
        if (e && e.length > 0) {
          let t = Editor.url("packages://adapters");
          e.forEach((e) => {
            let a = l[e];

            if (a) {
              a.forEach((e) => {
                r.push(u.join(t, e));
              });
            }
          });
        }
        return r;
      })(s).forEach((e) => {
        y.ignore(e);
      });

    if (
      (g)
    ) {
      let e = Editor.url("packages://adapters");

      if (!(g instanceof Array)) {
        g = [g];
      }

      g.forEach((r) => {
        y.ignore(u.join(e, r));
      });
    }
    let j = y
      .transform(t, { presets: p, plugins: d })
      .bundle()
      .pipe(i(a ? "adapter.js" : "adapter-min.js"))
      .pipe(o());

    if (!a) {
      j = j.pipe(n());
    }

    j.pipe(c.dest(f));

    j.on("end", () => {
      h();
    });

    j.once("error", (e) => {
      m(e);
    });
  });
};

e.copyRes = async function (e, r, t, i) {
    return new Promise(async function (i, o) {
      let { platform: n, actualPlatform: l, dest: f } = e;
      let g = b(l);
      let h = [u.join(g, "res/**/*")];

      if (r) {
        if (!(r instanceof Array)) {
          r = [r];
        }

        r.forEach((e) => {
          h.push(`!${u.join(g, "res", e)}`);
        });
      }

      let m = await new Promise((e, r) => {
        Editor.Ipc.sendToMain("app:query-plugin-scripts", n, (t, a) => {
          if (t) {
            return r(t);
          }
          let i = [];
          const o = Editor.assetdb;

          a.forEach((e) => {
            let r = o.fspathToUrl(e).slice("db://".length);
            r = r.replace(/\\/g, "/");
            i.push(r);
          });

          e(i);
        });
      });
      c.src(h)
        .pipe(
          s.through(function (r) {
            try {
              let i = u.basename(r.path);
              if ("object" == typeof t) {
                let a = t[i];

                if ("function" == typeof a) {
                  a(r, e);
                }
              }
              if ("ccRequire.js" === i) {
                let t = "// tail";
                let a = r.contents.toString();
                let i = "";

                if (m) {
                  m.forEach((e) => {
                    i += `'src/${e}' () { return require('src/${e}') },\n`;
                  });
                }

                e.bundles.forEach((r) => {
                  if ("subpackage" === r.compressionType &&
                  "alipay" !== e.actualPlatform) {
                    return;
                  }
                  let t = u.relative(f, r.scriptDest);
                  let a = u.join(t, "index.js");
                  a = a.replace(/\\/g, "/");
                  i += `'${a}' () { return require('${a}') },\n`;
                });

                i += t;
                a = a.replace(t, i);
                r.contents = new Buffer(a);
              }
              if (".js" === u.extname(i) && "ccRequire.js" !== i) {
                let e = a.transform(r.contents.toString(), {
                  ast: false,
                  highlightCode: false,
                  sourceMaps: false,
                  compact: false,
                  filename: r.path,
                  presets: p,
                  plugins: d,
                });
                r.contents = new Buffer(e.code);
              }
            } catch (e) {
              return this.emit("error", e);
            }
            this.emit("data", r);
          })
        )
        .once("error", (e) => {
          o(e);
        })
        .pipe(c.dest(f))
        .on("end", () => {
          i();
        });
    });
  };

module.exports = e;
