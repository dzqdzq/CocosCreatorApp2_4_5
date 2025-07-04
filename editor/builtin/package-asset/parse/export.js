const e = require("fire-fs");
const t = require("fire-path");
const i = require("async");
const s = require("./depend");
const r = require("../utils");
let n = [];
let u = [];

let l = function (e) {
  this.info = e;
  this.type = e.type || "";
  this.icon = r.getIcon(e.uuid);
  this.selected = true;
  this.parent = null;
  if ("sprite-frame" === e.type) {
    let i = Editor.assetdb.remote.loadMetaByUuid(e.uuid);
    this.url = Editor.assetdb.remote.uuidToFspath(i.rawTextureUuid);
    this.name = t.basename(this.url);
  } else {
    this.url = e.path;
    this.name = t.basename(e.path);
  }
};

let h = function (e, t, i) {
  this.name = e;
  this.url = t;
  this.children = [];
  this.type = i || "folder";
  this.folded = true;
  this.selected = true;
  this.parent = null;
  this.icon = `unpack://static/icon/assets/${this.type}.png`;
};

function d(i, s, r, o, a) {
  let p = o[++i];
  s = t.join(s, p);
  if (e.statSync(s).isDirectory()) {
    let e = (function (e) {
      for (let t = 0; t < n.length; ++t) {
        let i = n[t];
        if (i.url === e) {
          return i;
        }
      }
      return null;
    })(s);

    if (!e) {
      (e = new h(p, s)).parent = r;
      r.children.push(e);
      n.push(e);
    }

    d(i, s, e, o, a);
  } else {
    if (
      !(function (e) {
        return -1 !== u.indexOf(e);
      })(a.uuid)
    ) {
      let e = new l(a);
      e.parent = r;
      r.children.push(e);
      u.push(a.uuid);
    }
  }
}

module.exports = {
  FileRoot: h,
  queryAssetTreeByUuidList(e, r) {
    n = [];
    void (u = []);

    i.each(
      r,
      (i, r) => {
        Editor.assetdb.queryInfoByUuid(i, (i, n) =>
          i
            ? r()
            : -1 !== n.url.indexOf(s.INTERNAL)
            ? r()
            : ((function (e, i) {
                let s = e.url.slice("db://assets/".length).split("/");
                if (1 === s.length) {
                  let t = new l(e);
                  t.parent = i;
                  i.children.push(t);
                  u.push(e.uuid);
                } else {
                  d(-1, t.join(Editor.Project.path, "assets"), i, s, e);
                }
              })(n, e),
              r(),
              void 0)
        );
      },
      () => {
        s.sortAssetTree(e);
      }
    );
  },
};
