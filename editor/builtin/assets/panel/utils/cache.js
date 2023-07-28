"use strict";
window.Cache = module.exports;
const e = require("./event");
let t = {};
let n = { id: "root", children: [], show: true };
let r = [];
let o = [];
exports.lineHeight = 19;

exports.queryCache = function () {
    return t;
  };

exports.queryRoot = function () {
    return n;
  };

exports.queryNodes = function () {
    return r;
  };

exports.queryShowNodes = function () {
    return o;
  };

exports.updateShowNodes = function (e) {
  o.length = [];

  e.forEach((e) => {
    o.push(e);
  });
};

exports.copyUuids = [];

exports.queryNode = function (e) {
    let n = t[e];
    return n || null;
  };

exports.genAssetsTree = function (e) {
  e.forEach((e) => {
    t[e.uuid] = d(e);
  });

  n.children.length = 0;
  for (let e in t) {
    let o = t[e];

    if (!o.hidden) {
      if (o.parent) {
        o.level = t[o.parent].level + 1;
        t[o.parent].children.push(o);
        r.push(o);
      } else {
        n.children.push(o);
        o.level = 0;
      }
    }
  }
  r.sort(Cache.sortChildrenNodes);
  this.sortAssetsTree();
  return n;
};

let s = "name";
const i = Editor.Profile.load("project://project.json");

exports.sortAssetsTree = function (e) {
  e = e || n.children;
  s = i.get("assets-sort-type");

  (function e(t) {
    if (t) {
      t.sort(exports.sortChildrenNodes);

      t.forEach((t) => {
        e(t.children);
      });
    }
  })(e);
};

const l = new Intl.Collator("en", { numeric: true, sensitivity: "base" });

exports.sortChildrenNodes = (e, t) => {
  let n = "folder" === e.assetType;
  let r = "folder" === t.assetType;
  return n && !r
    ? -1
    : !n && r
    ? 1
    : "ext" === s && e.extname !== t.extname
    ? l.compare(e.extname, t.extname)
    : l.compare(e.name, t.name);
};

let d = function (e) {
  return {
    id: e.uuid,
    name: e.name,
    extname: e.extname,
    assetType: e.type,
    isSubAsset: e.isSubAsset,
    readonly: e.readonly,
    hidden: e.hidden,
    parent: e.parentUuid || null,
    children: [],
    selected: false,
    fold: true,
    show: !e.parentUuid,
    rename: false,
    level: 0,
    hint: false,
    iconUrl: null,
    isMount: "mount" === e.type,
  };
};

exports.add = function (o) {
  o = d(o);
  t[o.id] = o;
  let s = t[o.parent];
  if (s) {
    o.level = s.level + 1;
    let e = (function (e, t, n) {
      for (
        var r = 0, o = e.length - 1, s = o >>> 1;
        r <= o;
        s = (r + o) >>> 1
      ) {
        var i = n(e[s], t);
        if (i > 0) {
          o = s - 1;
        } else {
          if (!(i < 0)) {
            return s;
          }
          r = s + 1;
        }
      }
      return ~r;
    })(s.children, o, this.sortChildrenNodes);

    if (e < 0) {
      e = ~e;
    }

    s.children.splice(e, 0, o);
  } else {
    n.children.push(o);
  }
  r.push(o);
  e.emit("node-added", o);
};

exports.remove = function (o) {
  let s = this.queryNode(o);
  let i = s.parent ? t[s.parent] : n;
  if (i) {
    let e = i.children.indexOf(s);

    if (e > -1) {
      i.children.splice(e, 1);
    }
  }
  delete t[o];
  let l = r.indexOf(s);

  if (l > -1) {
    r.splice(l, 1);
  }

  e.emit("node-removed", s);
  return true;
};
