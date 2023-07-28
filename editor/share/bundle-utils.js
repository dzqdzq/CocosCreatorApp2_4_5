const { promisify: e } = require("util");
const r = require("fire-path");
const s = require("fs");
const t = require("jszip");
const n = require("del");

module.exports = {
  _getAssetDB: () =>
    Editor.assetdb.queryMetas ? Editor.assetdb : Editor.remote.assetdb,
  async queryBundleFolders() {
    let s = this._getAssetDB();
    let t = e(s.queryMetas.bind(s));
    let n = [];

    (await t("db://**/*", "folder")).forEach((e) => {
      let t = s.uuidToUrl(e.uuid);
      if (e.isBundle || "db://assets/resources" === t) {
        let s = Object.assign({}, e);
        s.name = e.bundleName || r.basenameNoExt(t);
        s.url = t;

        if ("db://assets/resources" === t) {
          s.priority = 8;
        }

        n.push(s);
      }
    });

    return n;
  },
  async queryBundlesWithScenes() {
    let s = {};
    let t = this._getAssetDB();
    let n = e(t.queryMetas).bind(t);
    let i = await this.queryBundleFolders();
    let a = await n("db://**/*", "scene");
    let l = [];

    (a = a.map((e) => {
      let r = Object.assign({}, e);
      r.url = t.uuidToUrl(r.uuid);
      return r;
    })).forEach((e) => {
      let t = i.find((s) => r.contains(s.url, e.url));
      if (t) {
        let r = t.name;
        (s[r] = s[r] || []).push(e);
      } else {
        l.push(e);
      }
    });

    s.main = l;
    return s;
  },
  verifyBundleFolders(e) {
    for (let s = 0; s < e.length - 1; ++s) {
      for (let t = s + 1; t < e.length; ++t) {
        let n = e[s];
        let i = e[t];
        if (r.contains(n.url, i.url)) {
          throw new Error(
            `Cannot put asset bundle "${i.name}" in asset bundle "${n.name}"`
          );
        }
        if (r.contains(i.url, n.url)) {
          throw new Error(
            `Cannot put asset bundle "${n.name}" in asset bundle "${i.name}"`
          );
        }
        if (n.name === i.name) {
          throw new Error(
            `asset bundle "${n.url}" and asset bundle "${i.url}" have same name!`
          );
        }
      }
    }
  },
  _getFilesInDirectory(e, t) {
    s.readdirSync(t).forEach((n) => {
      let i = r.join(t, n);

      if (s.statSync(i).isDirectory()) {
        this._getFilesInDirectory(e, i);
      } else {
        e.push(i);
      }
    });
  },
  async compressDirs(e, i, a) {
    await new Promise((l) => {
      let u = new t();
      let o = [];
      let d = [];

      e.forEach((e) => {
        this._getFilesInDirectory(o, e);
        d.push(e, r.join(e, "**/*"));
      });

      o.forEach((e) => {
        let t = r.relative(i, e);
        let n = r.join("res", t);
        n = n.replace(/\\/g, "/");
        u.file(n, s.readFileSync(e));
      });

      u
        .generateAsync({
          type: "nodebuffer",
          compression: "DEFLATE",
          compressionOptions: { level: 9 },
        })
        .then((e) => {
        s.writeFileSync(a, e);
        d = d.map((e) => e.replace(/\\/g, "/"));
        n(d, { force: true }).then(l);
      });
    });
  },
};
