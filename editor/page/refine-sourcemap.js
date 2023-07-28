const e = require("fire-fs");
const n = require("fire-path");
const o = require("source-map");
const r = o.SourceMapConsumer;
const t = o.SourceMapGenerator;
const i = require("event-stream");
function u(o, i, u) {
  if (o.sourceMap) {
    let s = o.sourceMap;

    let a = (function (o, t, i) {
      let u = {};
      for (let s = 0; s < o.sources.length; ++s) {
        let a = o.sources[s];
        let l = n.resolve(i, a);
        l = t[l] || t[l.toLowerCase()] || l;
        let c = "";
        try {
          c = e.readFileSync(l + ".map", "utf8");
        } catch (r) {
          let u = n.basenameNoExt(l);
          if (Editor.Utils.UuidUtils.isUuid(u)) {
            let r = Editor.assetdb.remote.uuidToFspath(u);
            if (r && (l = t[r] || t[r.toLowerCase()])) {
              try {
                c = e.readFileSync(l + ".map", "utf8");
              } catch (e) {}
              a = o.sources[s] = n.relative(i, r);
            }
          }
          if (!c) {
            continue;
          }
        }
        let g = new r(c);
        u[a] = g;
      }
      return u;
    })(s, i, u);

    o.sourceMap = (function (e, n) {
      var o = new r(n);
      var i = new t();
      var u = { line: 0, column: 0, bias: r.LEAST_UPPER_BOUND };

      var s = {
        original: null,
        generated: { line: 0, column: 0 },
        source: "",
        name: "",
      };

      o.eachMapping(function (n) {
        if (null == n.originalLine) {
          return;
        }
        let o = n.source;
        let r = e[o];
        if (!r) {
          return;
        }
        u.line = n.originalLine;
        u.column = n.originalColumn;
        let t = r.originalPositionFor(u);

        if (null != t.source) {
          s.original = t;
          s.generated.line = n.generatedLine;
          s.generated.column = n.generatedColumn;
          s.source = o;
          s.name = n.name;
          i.addMapping(s);
        }
      });
      var a = JSON.parse(i.toString());
      a.sourcesContent = [];
      a.sourceRoot = n.sourceRoot;
      for (let n = 0; n < a.sources.length; ++n) {
        let o = a.sources[n];
        let r = e[o];

        if (r) {
          a.sourcesContent[n] = r.sourcesContent[0];
        }
      }
      return a;
    })(a, s);
  } else {
    Editor.error("gulp-sourcemaps not initialized");
  }
}

module.exports = function (e, n) {
  return i.through(function (o) {
    u(o, e, n);
    this.emit("data", o);
  });
};

module.exports.offsetLines = function (e, n) {
  var o = new r(e);
  var i = new t({ file: e.file, sourceRoot: e.sourceRoot });
  o.eachMapping(function (o) {
    if (!o.source) {
      o.source = e.sources[0];
    }

    if ("number" == typeof o.originalLine &&
      0 < o.originalLine &&
      "number" == typeof o.originalColumn &&
      0 <= o.originalColumn &&
      o.source) {
      i.addMapping({
        source: o.source,
        name: o.name,
        original: { line: o.originalLine, column: o.originalColumn },
        generated: { line: o.generatedLine + n, column: o.generatedColumn },
      });
    }
  });
  var u = JSON.parse(i.toString());

  if (void 0 !== e.sourcesContent) {
    u.sourcesContent = e.sourcesContent;
  }

  u.sources = e.sources;
  return u;
};
