"use strict";
var r = require("util");
var e = require("async");
var t = require("source-map").SourceMapConsumer;
var s = require("fire-fs");
var n = require("fire-path");
const i = "InTryCatch";
const o = "CCComponent.js";
const a = "//# sourceMappingURL=data:application/json;charset=utf-8;base64,";
const l = " (eval at ";
const u = " ".repeat(4) + "at ";
const c = " (";
const f = ")";
const h = f.charCodeAt(0);
const d = "db://".length;
const m = true;
function p(r) {
  return Editor.isWin32 ? r.slice(8) : r.slice(7);
}
function v(r) {
  if ((r = r.replace(/\\/g, "/")).startsWith("file:///")) {
    r = p(r);
  }

  return r;
}
class g {
  constructor(r) {
    this.name = r;
    this.sourceMaps = {};
  }
  clear() {
    this.sourceMaps = {};
  }
  getLineOffset(r) {
    return 0;
  }
  loadSourceMapsJSON(r, e) {}
  loadSingle(r, e) {
    this.loadSourceMapsJSON(r, (s, n) => {
      if (s || !n) {
        return e();
      }
      try {
        this.sourceMaps[r] = { smc: new t(n), sources: {}, json: n };
      } catch (t) {
        Editor.error("Failed to load source map from %s\n%s", r, t);
        return e(null, this.sourceMaps);
      }
      e(null, n.sources);
    });
  }
  load(r, t) {
    console.time("load sourcemaps for " + this.name);

    e.map(r, this.loadSingle.bind(this), (r, e) => {
      var s = [];
      for (var n of e) if (n) {
        s = s.concat(n);
      }
      console.timeEnd("load sourcemaps for " + this.name);
      t(r, s);
    });
  }
}
class b {
  constructor(r) {
    this.filters = r;
  }
  clear() {
    for (var r of this.filters) r.clear();
  }
  load(r, t) {
    e.reduce(
      this.filters,
      [r],
      (r, e, t) => {
        e.load(r, t);
      },
      (r, e) => {
        this._cacheSourcesContent();
        this._normalizeGeneratedUrl();
        t();
      }
    );
  }
  flow(r, e, t) {
    for (var s, n, i, o = 0; o < this.filters.length && r; o++) {
      var a = this.filters[o];
      var l = a.sourceMaps[r];
      if (!l) {
        break;
      }

      r = (n = (s = l).smc.originalPositionFor({ line: e, column: t }))
        .source;

      e = (i = n.line) - a.getLineOffset(s, r);
      t = n.column;
    }
    return s && n && r
      ? {
          url: r,
          lineNum: e,
          injectedLineNum: i,
          columnNum: t,
          sources: s.sources,
        }
      : null;
  }
  transform(r, e, t) {
    var s = r.split("\n");
    var n = 1;

    if (e && t) {
      s.shift();
      s[0] = e;
    } else {
      n = this._adjustStack(s, e, t);
    }

    for (var i = n; i < s.length; i++) {
      var a = s[i];
      if (a.startsWith(u) && a.charCodeAt(a.length - 1) === h) {
        var d = "";
        var m = a.indexOf(l);
        if (-1 !== m) {
          var v = a.indexOf(c, m + l.length);
          if (-1 === v) {
            continue;
          }
          var g = a.indexOf(f, v + c.length);
          d = a.slice(v + c.length, g);
        } else {
          if (-1 === (m = a.lastIndexOf(c))) {
            continue;
          }
          d = a.slice(m + c.length, -1);
        }
        var b = d.lastIndexOf(":");
        if (-1 !== b) {
          var S = parseInt(d.substring(b + 1));
          if (!isNaN(S) && -1 !== (b = d.lastIndexOf(":", b - 1))) {
            var O = parseInt(d.substring(b + 1));
            if (!isNaN(O)) {
              var E = d.lastIndexOf("?", b - 1);
              b = -1 !== E ? E : b;
              var w = d.substring(0, b);
              if (w.endsWith(o) && this._shouldHideInternal(w, a)) {
                s.length = i;
                break;
              }

              if (w.startsWith("file:///")) {
                w = p(w);
              }

              if (
                (this.filters[0].sourceMaps[w])
              ) {
                var x = i === n;
                var M = this._transformLine(a, w, O, S, x, m);

                if (M) {
                  s[i] = M;
                }
              }
            }
          }
        }
      }
    }
    return s.join("\n");
  }
  _adjustStack(r, e, t) {
    var s;

    if (e) {
      s = 1;
    } else {
      if (-1 === (s = r.findIndex((r) => r.startsWith(u)))) {
        s = r.length;
      }
    }

    if (t) {
      if (e) {
        r.shift();
        r[0] = e;
      } else {
        r.splice(s, 1);
      }
    } else {
      if (e) {
        r[0] = e;
      }
    }

    return s;
  }
  _shouldHideInternal(r, e) {
    var t = r[r.length - o.length - 1];
    if ("/" === t || "\\" === t) {
      var s = e.indexOf(" ", u.length);
      var n = s - i.length;
      return e.lastIndexOf(i, s - 1) === n;
    }
    return false;
  }
  _transformLine(r, e, t, s, n, i) {
    var o = this.flow(e, t, s);
    if (o) {
      var a;
      e = o.url;
      s = o.columnNum;
      t = o.lineNum;
      if ((n)) {
        var l = o.sources[e];
        if (l) {
          var u = l[o.injectedLineNum];

          if (u) {
            a = `${r.substring(0, i)}: "${u}" (`;
          }
        }
      }
      a = a || r.substring(0, i + c.length);
      return s ? `${a}${e}:${t}:${s})` : `${a}${e}:${t})`;
    }
    return "";
  }
  _cacheSourcesContent() {
    console.time("cache sources content for sourcemaps");
    for (var r = 0; r < this.filters.length; r++) {
      var e = this.filters[r].sourceMaps;
      var t = this.filters[r + 1];
      for (var s in e) {
        var n = e[s];
        var i = n.json;
        var o = {};
        if (!i) {
          break;
        }
        for (var a = i.sourcesContent, l = 0; l < a.length; l++) {
          var u = i.sources[l];
          if (!(t && u in t.sourceMaps)) {
            var c = a[l];
            if (null == c) {
              continue;
            }
            var f = (c = c.trimRight()).split("\n");
            f.unshift("");

            f = f.map((r) =>
                (r = r.trim()).startsWith("//")
                  ? ""
                  : (59 === r.charCodeAt(r.length - 1) && (r = r.slice(0, -1)),
                    r)
              );

            o[u] = f;
          }
        }
        n.sources = o;
        i.sourcesContent = void 0;
        n.json = null;
      }
    }
    console.timeEnd("cache sources content for sourcemaps");
  }
  _normalizeGeneratedUrl() {
    if (this.filters.length > 0) {
      var r = this.filters[0].sourceMaps;
      for (var e in r) {
        var t = v(e);

        if (t !== e) {
          r[t] = r[e];
          delete r[e];
        }
      }
    }
  }
}
class S extends g {
  constructor() {
    super("Browserify");
  }
  getLineOffset(r, e) {
    if (m) {
      return 0;
    }
    return e in r.sources ? 0 : 4;
  }
  loadSourceMapsJSON(r, t) {
    s.readFile(r, "utf8", (r, s) => {
      if (r) {
        return t(r);
      }
      var n;
      try {
        n = (function (r) {
          var e = (function (r) {
            var e = r.lastIndexOf("\n");
            if (-1 === e) {
              return r;
            }
            var t = r.substring(e).trim();

            if (!t) {
              e = r.lastIndexOf("\n", e - 1);
              t = r.substring(e).trim();
            }

            return t;
          })(r);
          if (!e) {
            throw new Error("file is empty");
          }
          if (e.startsWith("//")) {
            if (e.startsWith(a)) {
              var t = e.substring(a.length);
              if (t) {
                var s = window.atob(t);
                if (s) {
                  return JSON.parse(s);
                }
                throw new Error("can not decode from base64");
              }
              throw new Error("sourcemaps is empty");
            }
            throw new Error("no source maps comment");
          }
          return null;
        })(s.toString());
      } catch (r) {
        return t(r);
      }
      if (!n) {
        return t();
      }

      if (m) {
        t(null, n);
      } else {
        e.forEachOf(
              n.sources,
              (r, e, t) => {
                if (r.startsWith("assets")) {
                  var s = "db://" + r.replace(/\\/g, "/");
                  var i = Editor.assetdb.remote.urlToUuid(s);
                  if (i) {
                    r = Editor.assetdb.remote._uuidToImportPathNoExt(i) + ".js";
                    n.sources[e] = r;
                  }
                }
                t();
              },
              () => {
                t(null, n);
              }
            );
      }
    });
  }
}
var O;

O = new b(
  m
    ? [new S()]
    : [
        new S(),
        new (class extends g {
          constructor() {
            super("Babel");
          }
          loadSourceMapsJSON(r, e) {
            var t = n.basenameNoExt(r);

            if (Editor.Utils.UuidUtils.isUuid(t)) {
              s.readFile(r + ".map", "utf8", (s, n) => {
                if (s) {
                  return e(s);
                }
                var i;
                try {
                  i = JSON.parse(n.toString());
                } catch (r) {
                  return e(r);
                }
                var o = Editor.assetdb.remote.uuidToUrl(t);

                if (o) {
                  o = o.slice(d);
                  i.sources[0] = o;
                } else {
                  i.sources[0] = r;
                }

                e(null, i);
              });
            } else {
              e();
            }
          }
        })(),
      ]
);

module.exports = {
    init: function () {
      var e = this;
      cc.error = Editor.error = function (t) {
        if (t instanceof Error) {
          t = e.transform(t.stack, "", false);
        } else {
          t = arguments.length > 1
            ? r.format.apply(r, arguments)
            : Editor.Utils.toString(t);
          let s = new Error("dummy");
          t = e.transform(s.stack, t, true);
        }
        console.error(t);
        Editor.Ipc.sendToMain("editor:renderer-console-error", t);
      };
    },
    reload: function (r, e) {
      O.clear();
      O.load(r, e);
    },
    transform: function (r, e, t) {
      return O.transform(r, e, t);
    },
    _UnitTest: { SourceMapsFilter: g, SourceMapsPipeline: b },
  };

module.exports.init();
