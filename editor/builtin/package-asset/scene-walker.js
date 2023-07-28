const e = require("fire-fs");
const t = require("fire-url");
const r = require("fire-path");
const i = require("async");
const s = require("./parse/depend");
let u = cc.js._getClassById;
let d = Editor.remote.importPath;
let n = new cc.deserialize.Details();
const o = [".atlas", ".txt", ".atlas.txt", ""];
async function l(t) {
  return new Promise((i, s) => {
    (function (t, i) {
      t = r.stripExt(t);

      (function r(s) {
        var u = o[s];
        var d = t + u;
        e.exists(d, (e) => {
          if (e) {
            return i(null, d);
          }

          if (s + 1 < o.length) {
            r(s + 1);
          } else {
            i(new Error(`Can not find ${t + o[0]}`));
          }
        });
      })(0);
    })(t, (e, t) => {
      if (e) {
        s(e);
      } else {
        let e = Editor.remote.assetdb.fspathToUuid(t);
        i(e);
      }
    });
  });
}

module.exports = {
  async _queryDependAsset(o, a, c) {
    let f = Editor.remote.assetdb.uuidToUrl(o);
    if (!f || -1 !== f.indexOf(s.INTERNAL)) {
      return c();
    }
    let p = a[o];
    if (p) {
      return c();
    }
    if (Editor.remote.assetdb.isSubAssetByUuid(o)) {
      let e = t.dirname(f);
      o = Editor.remote.assetdb.urlToUuid(e);
      if ((p = a[o])) {
        return c();
      }
    }
    a[o] = true;

    Editor.assetdb.queryMetaInfoByUuid(o, async (t, f) => {
      if (t) {
        Editor.error(t);
        return;
      }
      if (!Editor.assets[f.assetType]) {
        return c();
      }
      let y = JSON.parse(f.json);

      if (y && y.rawTextureUuid) {
        a[y.rawTextureUuid] = true;
      }

      if (
        ("spine" === f.assetType)
      ) {
        let e = await l(f.assetPath);

        if (e) {
          a[e] = true;
        }
      }
      let U = s.queryAllUuidTag(f.json);
      for (let e in U) {
        let t = U[e];
        let r = Editor.remote.assetdb.uuidToUrl(t);

        if (!(!r ||
          r.includes(s.INTERNAL) || Editor.remote.assetdb.isSubAssetByUuid(t))) {
          a[t] = true;
        }
      }
      if (s.isScript(f.assetType)) {
        s.queryDependScriptByUuid(o, (e, t) => {
          if (e) {
            Editor.error(e);
            return;
          }
          i.each(
            t,
            (e, t) => {
              if (!(p = a[e])) {
                a[e] = true;
              }

              t();
            },
            c
          );
        });

        return;
      }
      let E = o.slice(0, 2) + r.sep + o + ".json";
      let q = r.join(d, E);
      let h = e.readFileSync(q);
      n.reset();

      cc.deserialize(h, n, {
        classFinder: function (e) {
          if (Editor.Utils.UuidUtils.isUuid(e)) {
            let t = Editor.Utils.UuidUtils.decompressUuid(e);

            if (!n.uuidList.includes(t)) {
              n.uuidList.push(t);
            }
          }
          let t = u(e);
          return t || null;
        },
      });

      if (0 === n.uuidList.length) {
        c();
      } else {
        i.each(
              n.uuidList,
              (e, t) => {
                this._queryDependAsset(e, a, t);
              },
              c
            );
      }
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
      if (t) {
        Editor.error(t);
        return;
      }

      if (e.reply) {
        e.reply(null, r);
      }
    });
  },
};
