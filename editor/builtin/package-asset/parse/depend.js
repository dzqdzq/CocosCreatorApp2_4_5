var e = require("fire-fs"),
  t = require("fire-url"),
  r = require("fire-path"),
  i = require("async"),
  detective = require("detective");
let u = Editor.remote.importPath;
module.exports = {
  INTERNAL: "db://internal",
  isScript: (e) => "javascript" === e || "typescript" === e,
  sortAssetTree(e, t) {
    if (!e.children) return t();
    e.children.sort((e, t) => e.name + e.type > t.name + t.type),
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
    if (n[t]) return l();
    n[t] = !0;
    let a = t.slice(0, 2) + r.sep + t + ".js",
      p = r.join(u, a),
      c = e.readFileSync(p, "utf-8"),
      o = detective(c);
    if (0 === o.length) return l();
    i.each(
      o,
      (e, i) => {
        let s,
          u = e.includes("/");
        if (u) {
          let i = r.dirname(Editor.remote.assetdb.uuidToFspath(t)),
            u = r.resolve(i, e);
          s = r.join(r.dirname(u), r.basenameNoExt(u));
        } else s = e;
        let l = s,
          a = "";
        for (let e = 0; e < d.length; ++e) {
          let t = d[e];
          if (
            this.isScript(t.type) &&
            (u
              ? ((l = s + r.extname(t.path)), (a = t.path))
              : (a = r.basenameNoExt(t.path)),
            l === a)
          )
            return this._queryDependScriptByUuid(t.uuid, n, d, i), void 0;
        }
        i();
      },
      l
    );
  },
  queryAllUuidTag(e) {
    let t = e.match(/(?<=__uuid__": ")(.*)(?=")/g) || [],
      r = e.match(/(?<=uuid": ")(.*)(?=")/g) || [];
    return t.concat(r);
  },
  queryDependsOfRawAssetByUrl(e, r) {
    let i = t.dirname(e),
      s = t.join(i, "*");
    Editor.assetdb.queryAssets(s, "texture", (e, t) => r(null, t));
  },
};
