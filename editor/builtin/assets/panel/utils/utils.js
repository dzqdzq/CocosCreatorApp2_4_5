"use strict";
const { promisify: e } = require("util");
const t = require("fire-fs");
const r = (require("fire-path"), require("node-uuid"), require("./event"));
const i = require("./operation");
const a = require("./cache");
let n = async function (e) {
  return await new Promise((r) => {
    t.exists(e, r);
  });
};

module.exports = {
  isSubDir: function (e, t) {
    return 0 === e.indexOf(t) && e !== t;
  },
  copy: async function (r, i) {
    if (!(await n(r))) {
      new Error(`File does not exist - ${r}`);
      return;
    }
    for (; await n(i); ) {
      i = i.replace(/( - (\d+))?(\.[^\.]+)?$/, (e, t, r, i) => {
        let a = r ? parseInt(r) : 0;
        let n = ++a + "";
        for (; n.length < 3; ) {
          n = "0" + n;
        }
        return ` - ${n}${i || ""}`;
      });
    }
    await e(t.copy)(r, i);
    return i;
  },
  isDir: async function (r) {
    return await e(t.isDir)(r);
  },
  uuid2path: async function (t) {
    let r = await e(Editor.assetdb.queryUrlByUuid)(t);
    if (!r) {
      return null;
    }
    let i = Editor.url(r);
    return decodeURI(i);
  },
  exists: n,
  copyMeta: async function (r, i) {
    r += ".meta";
    i += ".meta";
    let a = await e(t.readFile)(r, "utf-8");
    let n = await e(t.readFile)(i, "utf-8");
    if (!a || !n) {
      return;
    }
    let s = JSON.parse(a);
    let o = JSON.parse(n);

    let u = function (e, t) {
      Object.keys(e).forEach((r) => {
        let i = e[r];
        let a = t[r];

        if ("object" == typeof i) {
          if (!a) {
            a = Array.isArray(i) ? (t[r] = []) : (t[r] = {});
          }

          u(i, a);
        } else {
          t[r] = i;
        }
      });
    };

    u(s, o);
  },
  isReadOnly: async function (t) {
    let r = await e(Editor.assetdb.queryInfoByUuid)(t);
    if (!r) {
      return true;
    }
    let i = await e(Editor.assetdb.queryUrlByUuid)(t);
    if (!i) {
      return true;
    }
    let a = await e(Editor.assetdb.queryAssets)(i, r.type);
    return !(!a || !a[0] || !a[0].readonly);
  },
  onDragStart: function (e) {
    e.stopPropagation();
    let t = Editor.Selection.contexts("asset");
    if (!t || t.length <= 0) {
      e.preventDefault();
      return;
    }
    i.staging(t);
    let r = [];

    t.forEach((e) => {
      r.push(a.queryNode(e));
    });

    Editor.UI.DragDrop.start(e.dataTransfer, {
      buildImage: true,
      effect: "copyMove",
      type: "asset",
      items: r.map((e) => ({
        id: e.id,
        name: e.name,
        assetType: e.assetType,
        isSubAsset: e.isSubAsset,
        subAssetTypes: e.children.map((e) => e.assetType),
      })),
    });
  },
  onDragOver: function (e) {
    if ("tab" !== Editor.UI.DragDrop.type(e.dataTransfer)) {
      e.stopPropagation();
    }

    e.preventDefault();
  },
  onDragEnd: function (e) {
    e.stopPropagation();
    i.restore();
    Editor.UI.DragDrop.end();
  },
  emptyFilter: function () {
    r.emit("filter-changed", "");
    r.emit("empty-filter");
  },
};
