const e = require("fire-fs"),
  t = require("fire-url"),
  r = require("fire-path"),
  i = require("async"),
  s = require("./parse/depend");
let u = cc.js._getClassById,
  d = Editor.remote.importPath,
  n = new cc.deserialize.Details();
const o = [".atlas", ".txt", ".atlas.txt", ""];
async function l(t) {
  return new Promise((i, s) => {
    (function (t, i) {
      (t = r.stripExt(t)),
        (function r(s) {
          var u = o[s],
            d = t + u;
          e.exists(d, (e) => {
            if (e) return i(null, d);
            s + 1 < o.length
              ? r(s + 1)
              : i(new Error(`Can not find ${t + o[0]}`));
          });
        })(0);
    })(t, (e, t) => {
      if (e) s(e);
      else {
        let e = Editor.remote.assetdb.fspathToUuid(t);
        i(e);
      }
    });
  });
}
module.exports = {
  async _queryDependAsset(o, a, c) {
    let f = Editor.remote.assetdb.uuidToUrl(o);
    if (!f || -1 !== f.indexOf(s.INTERNAL)) return c();
    let p = a[o];
    if (p) return c();
    if (Editor.remote.assetdb.isSubAssetByUuid(o)) {
      let e = t.dirname(f);
      if (((o = Editor.remote.assetdb.urlToUuid(e)), (p = a[o]))) return c();
    }
    (a[o] = !0),
      Editor.assetdb.queryMetaInfoByUuid(o, async (t, f) => {
        if (t) return Editor.error(t), void 0;
        if (!Editor.assets[f.assetType]) return c();
        let y = JSON.parse(f.json);
        if (
          (y && y.rawTextureUuid && (a[y.rawTextureUuid] = !0),
          "spine" === f.assetType)
        ) {
          let e = await l(f.assetPath);
          e && (a[e] = !0);
        }
        let U = s.queryAllUuidTag(f.json);
        for (let e in U) {
          let t = U[e],
            r = Editor.remote.assetdb.uuidToUrl(t);
          !r ||
            r.includes(s.INTERNAL) ||
            Editor.remote.assetdb.isSubAssetByUuid(t) ||
            (a[t] = !0);
        }
        if (s.isScript(f.assetType))
          return (
            s.queryDependScriptByUuid(o, (e, t) => {
              if (e) return Editor.error(e), void 0;
              i.each(
                t,
                (e, t) => {
                  (p = a[e]) || (a[e] = !0), t();
                },
                c
              );
            }),
            void 0
          );
        let E = o.slice(0, 2) + r.sep + o + ".json",
          q = r.join(d, E),
          h = e.readFileSync(q);
        n.reset(),
          cc.deserialize(h, n, {
            classFinder: function (e) {
              if (Editor.Utils.UuidUtils.isUuid(e)) {
                let t = Editor.Utils.UuidUtils.decompressUuid(e);
                n.uuidList.includes(t) || n.uuidList.push(t);
              }
              let t = u(e);
              return t || null;
            },
          }),
          0 === n.uuidList.length
            ? c()
            : i.each(
                n.uuidList,
                (e, t) => {
                  this._queryDependAsset(e, a, t);
                },
                c
              );
      });
  },
  queryDependAsset(e, t) {
    let r = [];
    this._queryDependAsset(e, r, () => {
      t(null, Object.keys(r));
    });
  },
  "query-depend-asset"(e, t) {
    this.queryDependAsset(t, (t, r) => {
      if (t) return Editor.error(t), void 0;
      e.reply && e.reply(null, r);
    });
  },
};
