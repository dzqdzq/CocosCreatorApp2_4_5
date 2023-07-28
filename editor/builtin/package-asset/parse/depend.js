var e = require("fire-fs");
var t = require("fire-url");
var r = require("fire-path");
var i = require("async");
var detective = require("detective");
let u = Editor.remote.importPath;

module.exports = {
  INTERNAL: "db://internal",
  isScript: (e) => "javascript" === e || "typescript" === e,
  sortAssetTree(e, t) {
    if (!e.children) {
      return t();
    }
    e.children.sort((e, t) => e.name + e.type > t.name + t.type);
    i.each(e.children, this.sortAssetTree.bind(this), t);
  },
  queryDependScriptByUuid(e, t) {
    let r = [];
    Editor.assetdb.queryAssets(null, null, (i, s) => {
      this._queryDependScriptByUuid(e, r, s, () => {
        t(null, Object.keys(r));
      });
    });
  },
  _queryDependScriptByUuid(t, n, d, l) {
    if (n[t]) {
      return l();
    }
    n[t] = true;
    let a = t.slice(0, 2) + r.sep + t + ".js";
    let p = r.join(u, a);
    let c = e.readFileSync(p, "utf-8");
    let o = detective(c);
    if (0 === o.length) {
      return l();
    }
    i.each(
      o,
      (e, i) => {
        let s;
        let u = e.includes("/");
        if (u) {
          let i = r.dirname(Editor.remote.assetdb.uuidToFspath(t));
          let u = r.resolve(i, e);
          s = r.join(r.dirname(u), r.basenameNoExt(u));
        } else {
          s = e;
        }
        let l = s;
        let a = "";
        for (let e = 0; e < d.length; ++e) {
          let t = d[e];
          if (this.isScript(t.type) &&
          (u
            ? ((l = s + r.extname(t.path)), (a = t.path))
            : (a = r.basenameNoExt(t.path)),
          l === a)) {
            this._queryDependScriptByUuid(t.uuid, n, d, i);
            return;
          }
        }
        i();
      },
      l
    );
  },
  queryAllUuidTag(e) {
    let t = e.match(/(?<=__uuid__": ")(.*)(?=")/g) || [];
    let r = e.match(/(?<=uuid": ")(.*)(?=")/g) || [];
    return t.concat(r);
  },
  queryDependsOfRawAssetByUrl(e, r) {
    let i = t.dirname(e);
    let s = t.join(i, "*");
    Editor.assetdb.queryAssets(s, "texture", (e, t) => r(null, t));
  },
};
