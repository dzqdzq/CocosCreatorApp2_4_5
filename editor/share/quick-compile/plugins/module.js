const e = require("fire-fs");
const n = require("fire-path");
const r = require("convert-source-map");
const i = require("../../../page/refine-sourcemap");
const { formatPath: o, isNodeModulePath: t } = require("../utils");

const u = "undefined" != typeof Editor
  ? Editor.url(
      "unpack://editor/share/quick-compile/plugins/__quick_compile__.js"
    )
  : n.join(__dirname, "__quick_compile__.js");

const _ = e.readFileSync(u, "utf8");

module.exports = function (t) {
  t.bundle = void 0 === t.bundle || t.bundle;
  t.prefix = t.prefix || "";
  t.sourceMapPrefix = t.sourceMapPrefix || "";

  t.modularName = t.modularName
      ? `__quick_compile_${t.modularName}__`
      : "__quick_compile__";

  let u = function (e, r, i) {
    let u;

    u = t.transformPath
      ? t.transformPath(e, r, i)
      : n.join(t.prefix || "", n.relative(i.out, r));

    return o(u);
  };

  let c = t.excludes || [];

  if (!Array.isArray(c)) {
    c = [c];
  }

  let s = t.requireInNodeEnv || "require";
  let l = t.modularName;
  return {
    excludes: c,
    nodeModule: true,
    transform(e, o) {
      let { src: _, dst: c, source: d } = e;

      let a = `\n                (function() {\n                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';\n                    var __module = nodeEnv ? module : {exports:{}};\n                    var __filename = '${u(
        _,
        c,
        o
      )}';\n                    var __require = nodeEnv ? function (request) {\n                        return ${s}(request);\n                    } : function (request) {\n                        return ${l}.require(request, __filename);\n                    };\n                    function __define (exports, require, module) {\n                        if (!nodeEnv) {${l}.registerModule(__filename, module);}`;

      let m = `\n                    }\n                    if (nodeEnv) {\n                        __define(__module.exports, __require, __module);\n                    }\n                    else {\n                        ${l}.registerModuleFunc(__filename, function () {\n                            __define(__module.exports, __require, __module);\n                        });\n                    }\n                })();`;
      let f = true;

      if (".json" === n.extname(_)) {
        d = "module.exports = " + d;
        f = false;
      } else {
        if (t.exludesForSourceMap &&
              t.exludesForSourceMap.includes(_)) {
          f = false;
        }
      }

      if (
        (f)
      ) {
        let n = r.fromSource(d);

        if (n) {
          n = n.toObject();
          n = i.offsetLines(n, a.match(/\n/g).length);

          if (t.onSourceMap) {
            t.onSourceMap(e, n);
          }

          mapComment = r.fromObject(n).toComment();

          d = a +
          d.replace(/\n\/\/# sourceMappingURL.*/, "") +
          m +
          "\n" +
          mapComment;
        } else {
          f = false;
        }
      }

      if (!f) {
        d = a + d + m;
      }

      e.source = d;
    },
    async compileFinished(r) {
      let i = r.getSortedScripts();
      let c = this.excludes.map((e) => o(e)).concat(r.excludes);

      let s = (i = i.filter((e) => -1 === c.indexOf(e.src))).map((e) => {
        let n = {};
        for (let r in e.deps) if (c.includes(e.deps[r])) {
          n[r] = -1;
        } else {
          n[r] = i.findIndex(function (n) {
                return n.src === e.deps[r];
              });
        }
        return { mtime: r._mtimes[e.src], deps: n, path: u(e.src, e.dst, r) };
      });

      let l = "";
      if (t.bundle) {
        console.time("Generate QUICK_COMPILE_BUNDLE");
        l = o(n.join(t.prefix, "__qc_bundle__.js"));
        let u = n.join(r.out, "__qc_bundle__.js");
        let _ = "";

        i.forEach((e, n) => {
          _ += e.source + "\n//------QC-SOURCE-SPLIT------\n";
        });

        e.writeFileSync(u, _);
        console.timeEnd("Generate QUICK_COMPILE_BUNDLE");
      }
      let d = r.entries.map((e) => u(e, r.getDstPath(e), r));

      let a = (function (e, n, r, i) {
        let o = _.replace(/{prefix}/g, i.prefix);
        return `\n(function () {\nvar scripts = ${e};\nvar entries = ${n};\nvar bundleScript = '${r}';\n\n${(o =
          o.replace(/__quick_compile__/g, i.modularName))}\n})();\n    `;
      })(JSON.stringify(s), JSON.stringify(d), l, t);

      e.writeFileSync(n.join(r.out, "__quick_compile__.js"), a);
    },
  };
};
