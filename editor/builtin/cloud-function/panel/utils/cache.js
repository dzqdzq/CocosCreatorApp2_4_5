"use strict";
const e = require("fs-extra");
const t = require("path");
const n = require("./utils");
window.Cache = module.exports;
const r = require("./event");
let s = {};
let o = { id: "root", children: [], show: true };
let i = [];
let c = [];
exports.lineHeight = 19;

exports.queryCache = function () {
    return s;
  };

exports.queryRoot = function () {
    return o;
  };

exports.queryNodes = function () {
    return i;
  };

exports.queryShowNodes = function () {
    return c;
  };

exports.updateShowNodes = function (e) {
  c.length = [];

  e.forEach((e) => {
    c.push(e);
  });
};

exports.queryNode = function (e) {
    let t = s[e];
    return t || null;
  };

let l = function (e) {
  const t = `${Editor.Project.path}/local/cloud-funtion-state.json`;
  var r = n.readJson(t);
  return !r.nodeFoldStates || r.nodeFoldStates.indexOf(e) >= 0;
};
function d(n, r) {
  (function n(s) {
    if (!e.existsSync(s)) {
      return;
    }
    const o = "node_modules" === t.basename(s);
    const i = t.basename(s).startsWith(".");

    if (!(o || i)) {
      r(s);

      if (e.statSync(s).isDirectory()) {
        e.readdirSync(s).forEach((e) => n(t.join(s, e)));
      }
    }
  })(n);
}

exports.genAssetsTree = function () {
  s = {};
  i.splice(0);
  c.splice(0);

  const n = (function () {
    const t = `${Editor.Project.path}/settings/serverless.json`;
    var n = "{}";

    if (e.existsSync(t)) {
      n = e.readFileSync(t);
    }

    var r = JSON.parse(n);
    return r && r.env_id && "0" !== r.env_id ? r.env_id : "undefinedenv";
  })();

  const r = t.join(Editor.Project.path, "./serverless/cloud-function");
  d(r, (o) => {
    if (r !== o) {
      if (!(!e.lstatSync(o).isDirectory() && [".js", ".ts", ".json", ".php"].indexOf(t.extname(o)) <= -1)) {
        if (o.match(new RegExp(`[/|\\\\]+${n}([/|\\\\]+|$)`))) {
          s[o] = a(o, r);
        }
      }
    }
  });
  const u = t.dirname(r);

  d(u, (n) => {
    if (u !== n) {
      if (!(!e.lstatSync(n).isDirectory() && [".js", ".ts", ".json"].indexOf(t.extname(n)) <= -1)) {
        if (n.indexOf("mgobe-server") > -1) {
          s[n] = a(n, u);
        }
      }
    }
  });

  o.children.length = 0;
  for (let e in s) {
    let c = s[e];
    c.fold = l(e);

    if (t.basename(e) === n) {
      c.name = "cloud-function";
    }

    if (!c.hidden) {
      if (c.parent === r || c.parent === u) {
        o.children.push(c);
        c.assetType = "mount";
        c.level = 0;
        c.show = true;
      } else {
        c.level = s[c.parent].level + 1;
        s[c.parent].children.push(c);
        i.push(c);
      }
    }
  }
  i.sort(Cache.sortChildrenNodes);
  this.sortAssetsTree();
  return o;
};

exports.sortAssetsTree = function () {
  (function e(t) {
    if (t) {
      t.sort(exports.sortChildrenNodes);

      t.forEach((t) => {
        e(t.children);
      });
    }
  })(o.children);
};

exports.sortChildrenNodes = (e, t) => {
  let n = "folder" === e.assetType;
  let r = "folder" === t.assetType;
  return n || r
    ? n && r
      ? e.name.localeCompare(t.name, "en", { numeric: true })
      : n
      ? -1
      : 1
    : (0, e.name.localeCompare(t.name, "en", { numeric: true }));
};

let a = function (e, n) {
  const r = t.extname(e);
  const s = t.dirname(e);

  const o = (() => {
    switch (r) {
      case "":
        return "folder";
      case ".js":
        return "javascript";
      case ".ts":
        return "typescript";
      case ".json":
        return "json";
      case ".php":
        return "text";
    }
  })();

  return {
    id: e,
    name: t.basename(e),
    extname: r,
    assetType: o,
    isSubAsset: false,
    readonly: false,
    hidden: false,
    parent: s,
    children: [],
    selected: false,
    fold: true,
    show: false,
    rename: false,
    level: 0,
    hint: false,
    iconUrl: null,
    isMount: n === s,
  };
};
exports.createNode = a;

exports.add = function (e, t = false) {
  e = a(e);
  s[e.id] = e;
  let n = s[e.parent];
  if (n) {
    e.level = n.level + 1;
    let t = (function (e, t, n) {
      for (
        var r = 0, s = e.length - 1, o = s >>> 1;
        r <= s;
        o = (r + s) >>> 1
      ) {
        var i = n(e[o], t);
        if (i > 0) {
          s = o - 1;
        } else {
          if (!(i < 0)) {
            return o;
          }
          r = o + 1;
        }
      }
      return ~r;
    })(n.children, e, this.sortChildrenNodes);

    if (t < 0) {
      t = ~t;
    }

    n.children.splice(t, 0, e);
  } else {
    o.children.push(e);
  }
  e.show = t;
  i.push(e);
  r.emit("node-added", e);
  return e;
};

exports.remove = function (e) {
  let t = this.queryNode(e);
  let n = t.parent ? s[t.parent] : o;
  if (n) {
    let e = n.children.indexOf(t);

    if (e > -1) {
      n.children.splice(e, 1);
    }
  }
  delete s[e];
  let c = i.indexOf(t);

  if (c > -1) {
    i.splice(c, 1);
  }

  r.emit("node-removed", t);
  return true;
};
