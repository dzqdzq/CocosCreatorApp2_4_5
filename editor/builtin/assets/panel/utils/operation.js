"use strict";
const e = require("fire-url");
const { promisify: t } = require("util");
const r = require("./cache");
const o = require("./event");

exports.loadAssets = function () {
  o.emit("start-loading");

  Editor.assetdb.deepQuery((e, t) => {
    try {
      console.time("assets-tree._build()");
      if (e) {
        console.error("load assets error ", e);
        return;
      }
      let o = r.genAssetsTree(t);
      this.fold(o.children[0].id, false);
      console.timeEnd("assets-tree._build()");
    } catch (e) {
      Editor.warn(e.message);
    }
    o.emit("finish-loading");
    o.emit("assets-tree-ready");
  });
};

exports.show = function (e, t) {
    let o = r.queryNode(e);
    return !!o && ((o.show = t), this.updateShowNodes(), true);
  };

exports.select = function (e, t) {
  let o = r.queryNode(e);

  if (o) {
    o.selected = t;
  }
};

exports.rename = function (e) {
    let t = r.queryCache();
    for (let r in t) {
      let o = t[r];
      o.rename = o.id === e && !o.readonly && !o.isMount;
    }
  };

exports.fold = function (e, t) {
  let o = r.queryCache()[e];
  if (!o) {
    console.log("can't find node ", e);
    return false;
  }
  o.fold = t;

  if (o.children) {
    o.children.forEach((e) => {
      (function e(r) {
        r.show = !t;

        if (t) {
          r.children.forEach((t) => {
                e(t);
              });
        } else {
          if (t === r.fold) {
            r.children.forEach((t) => {
              e(t);
            });
          }
        }
      })(e);
    });
  }

  this.updateShowNodes();
};

exports.recFoldNodes = function (e, t) {
  let o = r.queryNode(e);
  if (!o) {
    return false;
  }

  if (o.children) {
    o.children.forEach((e) => {
      this.fold(e.id, t);
      this.recFoldNodes(e.id, t);
    });
  }
};

exports.recParentNodes = function (e, t) {
    let o = r.queryNode(e);
    if (!o) {
      return;
    }
    let n = (e) => {
      let o = r.queryNode(e.parent);

      if (o) {
        if (o !== r.queryRoot()) {
          this.fold(o.id, t);
        }

        if (o.parent) {
          n(o);
        }
      }
    };
    n(o);
  };

exports.updateShowNodes = function () {
  let e = r.queryRoot();
  let t = [];

  let o = function (e) {
    if (e.show &&
      e.children) {
      e.children.forEach((e) => {
        if (e.show) {
          t.push(e);
          o(e);
        }
      });
    }
  };

  o(e);
  r.updateShowNodes(t);
};

exports.getRealUrl = function (t, o) {
  let n = r.queryCache();
  let i = (r.queryRoot(), n[t]);
  if (!i) {
    return null;
  }
  let s = (o || i.name) + i.extname;
  let d = n[i.parent];
  for (; d; ) {
    s = e.join(d.name + d.extname, s);
    d = n[d.parent];
  }
  return (s = "db://" + s);
};

exports.getPath = function (t) {
  let o = r.queryCache();
  let n = o[t];
  if (!n) {
    return null;
  }
  let i = "";
  let s = o[n.parent];
  for (; s; ) {
    i = e.join(s.name + s.extname, i);
    s = o[s.parent];
  }
  return (i = "db://" + i);
};

exports.getUniqueUrl = async function (r, o) {
  const n = Editor.remote.assetdb;
  let i = [];
  for (let e = 0; e < o.length; ++e) {
    let r = o[e];
    i = i.concat(await t(n.queryAssets.bind(n))(null, r));
  }
  if (0 === i.length) {
    return r;
  }
  let s = i.map((t) => e.basenameNoExt(t.url));
  let d = 0;
  let l = "";
  let u = e.basenameNoExt(r);
  let a = e.basenameNoExt(r);
  for (; s.includes(a); ) {
    d += 1;
    a = u + " - " + (l = n.padLeft(d, 3, "0"));
  }
  if (0 === d) {
    return r;
  }
  let c = e.dirname(r);
  return e.join(c, a) + e.extname(r);
};

exports.move = function (e, t, o) {
  let n = r.queryNode(e);
  n.name = o || n.name;
  let i = r.queryNode(t);
  if (!i) {
    return;
  }
  let s = r.queryNode(n.parent);
  let d = s.children.indexOf(n);

  if (d > -1) {
    s.children.splice(d, 1);
  }

  i.children.push(n);
  n.parent = t;
  n.level = i.level + 1;

  n.children.forEach((e) => {
    e.level = n.level + 1;
  });

  i.children.sort(r.sortChildrenNodes);
  this.fold(i.id, false);
};

exports.updateUuid = function (e, t) {
  let o = r.queryNode(e);
  let n = r.queryCache();
  o.id = t;
  delete n[e];
  n[t] = o;
};

exports.updateIcon = function (e) {
  let t = r.queryNode(e);
  if (!t) {
    return;
  }
  t.iconUrl = null;
  let o = r.queryNode(t.parent);

  if (o) {
    o.iconUrl = null;
  }
};

exports.hint = function (e) {
  let t = r.queryNode(e);
  if (!t || t.hint) {
    return false;
  }
  t.hint = true;

  setTimeout(() => {
    t.hint = false;
  }, 800);
};

exports.remove = function (e) {
  if (r.remove(e)) {
    this.updateShowNodes();
  }
};

exports.add = function (e) {
  r.add(e);
  this.updateShowNodes();
};

exports.autoSort = function () {
  r.sortAssetsTree();
  this.updateShowNodes();
};

let n = [];

exports.staging = function (e) {
  let t = r.queryNodes();
  n.length = 0;

  t.forEach((t) => {
    if (t.selected) {
      n.push(t.id);
    }

    t.selected = -1 !== e.indexOf(t.id);
  });
};

exports.restore = function () {
  let e = [];

  r.queryNodes().forEach((t) => {
    if (t.selected) {
      e.push(t.id);
    }

    t.selected = -1 !== n.indexOf(t.id);
  });

  n = [];
  return e;
};
