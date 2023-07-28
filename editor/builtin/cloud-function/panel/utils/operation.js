"use strict";
const e = require("fire-url");
const t = require("./cache");
const o = require("./event");
const r = require("./utils");

exports.loadAssets = function (e = true) {
  if (e) {
    o.emit("start-loading");
  }

  requestAnimationFrame((r, n) => {
    try {
      t.genAssetsTree().children.forEach((e) => this.fold(e.id, false));
    } catch (e) {
      Editor.warn(e.message);
    }

    if (e) {
      o.emit("finish-loading");
    }
  });
};

exports.show = function (e, o) {
    let r = t.queryNode(e);
    return !!r && ((r.show = o), this.updateShowNodes(), true);
  };

exports.select = function (e, o) {
  let r = t.queryNode(e);

  if (r) {
    r.selected = o;
  }
};

exports.rename = function (e) {
    let o = t.queryCache();
    for (let t in o) {
      let r = o[t];
      r.rename = r.id === e && !r.readonly && !r.isMount;
    }
  };

exports.fold = function (e, o) {
  let r = t.queryCache()[e];
  if (!r) {
    console.log("can't find node ", e);
    return false;
  }
  r.fold = o;

  if (r.children) {
    r.children.forEach((e) =>
      (function e(t) {
        t.show = !o;

        if (o) {
          t.children.forEach((t) => e(t));
        } else {
          if (o === t.fold) {
            t.children.forEach((t) => e(t));
          }
        }
      })(e)
    );
  }

  n(e, o);
  this.updateShowNodes();
};

let n = function (e, t) {
  const o = `${Editor.Project.path}/local/cloud-funtion-state.json`;
  var n = r.readJson(o);

  if (!n.nodeFoldStates) {
    n.nodeFoldStates = [];
  }

  var d = n.nodeFoldStates.indexOf(e);

  if (t) {
    if (-1 === d) {
      n.nodeFoldStates.push(e);
    }
  } else {
    if (d >= 0) {
      n.nodeFoldStates.splice(d, 1);
    }
  }

  r.saveJson(o, n);
};

exports.recFoldNodes = function (e, o) {
  let r = t.queryNode(e);
  if (!r) {
    return false;
  }

  if (r.children) {
    r.children.forEach((e) => {
      this.fold(e.id, o);
      this.recFoldNodes(e.id, o);
    });
  }
};

exports.recParentNodes = function (e, o) {
    let r = t.queryNode(e);
    if (!r) {
      return;
    }
    let n = (e) => {
      let r = t.queryNode(e.parent);

      if (r) {
        if (r !== t.queryRoot()) {
          this.fold(r.id, o);
        }

        if (r.parent) {
          n(r);
        }
      }
    };
    n(r);
  };

exports.updateShowNodes = function () {
  let e = t.queryRoot();
  let o = [];

  let r = function (e) {
    if (e.show &&
      e.children) {
      e.children.forEach((e) => {
        if (e.show) {
          o.push(e);
          r(e);
        }
      });
    }
  };

  r(e);
  t.updateShowNodes(o);
};

exports.getRealUrl = function (o, r) {
  let n = t.queryCache();
  let d = (t.queryRoot(), n[o]);
  if (!d) {
    return null;
  }
  let i = (r || d.name) + d.extname;
  let s = n[d.parent];
  for (; s; ) {
    i = e.join(s.name + s.extname, i);
    s = n[s.parent];
  }
  return i;
};

exports.getPath = function (o) {
  let r = t.queryCache();
  let n = r[o];
  if (!n) {
    return null;
  }
  let d = "";
  let i = r[n.parent];
  for (; i; ) {
    d = e.join(i.name + i.extname, d);
    i = r[i.parent];
  }
  return (d = "db://" + d);
};

exports.move = function (e, o, r) {
  let n = t.queryNode(e);
  n.name = r || n.name;
  let d = t.queryNode(o);
  if (!d) {
    return;
  }
  let i = t.queryNode(n.parent);
  let s = i.children.indexOf(n);

  if (s > -1) {
    i.children.splice(s, 1);
  }

  d.children.push(n);
  n.parent = o;
  n.level = d.level + 1;

  n.children.forEach((e) => {
    e.level = n.level + 1;
  });

  d.children.sort(t.sortChildrenNodes);
  this.fold(d.id, false);
};

exports.updateUuid = function (e, o) {
  let r = t.queryNode(e);
  let n = t.queryCache();
  r.id = o;
  delete n[e];
  n[o] = r;
};

exports.updateIcon = function (e) {
  let o = t.queryNode(e);
  if (!o) {
    return;
  }
  o.iconUrl = null;
  let r = t.queryNode(o.parent);

  if (r) {
    r.iconUrl = null;
  }
};

exports.hint = function (e) {
  let o = t.queryNode(e);
  if (!o || o.hint) {
    return false;
  }
  o.hint = true;

  setTimeout(() => {
    o.hint = false;
  }, 800);
};

exports.remove = function (e) {
  if (t.remove(e)) {
    this.updateShowNodes();
  }
};

exports.add = function (e, o = false) {
  var r = t.add(e, o);
  this.updateShowNodes();
  return r;
};

exports.autoSort = function () {
  t.sortAssetsTree();
  this.updateShowNodes();
};

let d = [];

exports.staging = function (e) {
  let o = t.queryNodes();
  d.length = 0;

  o.forEach((t) => {
    if (t.selected) {
      d.push(t.id);
    }

    t.selected = -1 !== e.indexOf(t.id);
  });
};

exports.restore = function () {
  let e = [];

  t.queryNodes().forEach((t) => {
    if (t.selected) {
      e.push(t.id);
    }

    t.selected = -1 !== d.indexOf(t.id);
  });

  d = [];
  return e;
};
