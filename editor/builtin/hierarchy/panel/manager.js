"use strict";
const e = require("./utils/cache");
const i = require("./utils/operation");
let t = e.queryCache();
let n = [];
let d = true;

let o = function (o) {
  let l = {};
  let r = [];
  let c = [];
  function f(d, o, u) {
    l[d.id] = { node: d, parent: u };

    if (t[d.id]) {
      (function (i, d, o) {
        let l = t[i.id];
        let r = t[d];
        if (d !== l.parent) {
          c = e.remove(i.id);
          return;
        }
        if (r && r.children[o] !== i.id) {
          c = e.remove(i.id);
          let t = n.indexOf(i.id);

          if (-1 !== t) {
            n.splice(t, 1);
          }

          return;
        }
        if (null === d && n[o] !== i.id) {
          c = e.remove(i.id);
          let t = n.indexOf(i.id);

          if (-1 !== t) {
            n.splice(t, 1);
          }

          return;
        }
        let f = e.queryNode(i.id);

        if (f.name !== i.name) {
          f.name = i.name;
        }

        if (f.isActive !== i.isActive) {
          f.isActive = i.isActive;
        }

        if (f.prefabState !== i.prefabState) {
          f.prefabState = i.prefabState;
        }

        if (f.locked !== i.locked) {
          f.locked = i.locked;
        }
      })(d, u, o);
    }

    if (
      (!t[d.id])
    ) {
      (function (e, i) {
        for (let t = 0; t < e.length; ++t) {
          let n = e[t];

          if (n && n.id === i.id) {
            i.fold = n.oldNode.fold;
            e.splice(t, 1);
          }
        }
      })(c, d);

      e.add(d, u || null, o);
      let t = e.queryNode(u);

      if (t) {
        i.fold(u, t.fold);
      }

      if (null === u) {
        n.splice(o, 0, d.id);
      }

      r.push(d.id);
    }
    let s = 0;

    if (d.children) {
      d.children.forEach((e) => {
        if (!e.hidden) {
          f(e, s++, d.id);
        }
      });
    }
  }
  let u = 0;

  o.forEach((e) => {
    if (!e.hidden) {
      f(e, u++, null);
    }
  });

  if (
    (r.length > 0)
  ) {
    if (d) {
      d = false;
      return;
    }
    let t = e.queryNode(r[0]);

    if (t.parent) {
      i.fold(t.parent, false);
    }
  }
  let s = [];
  Object.keys(t).forEach((i) => {
    if (-1 === s.indexOf(i) && !l[i]) {
      (c = e.remove(i)).forEach((e) => {
        s.push(e.id);
      });
      let t = n.indexOf(i);

      if (-1 !== t) {
        n.splice(t, 1);
      }
    }
  });
};

let l = null;

let r = function () {
  Editor.Ipc.sendToPanel(
    "scene",
    "scene:query-hierarchy",
    (e, i, t) => {
      if (e) {
        Editor.warn(e);
      }

      if (t) {
        o(t);
      }

      l = setTimeout(() => {
          r();
        }, 300);
    },
    -1
  );
};

exports.startup = function () {
  e.initNodeState();
  d = true;
  r();
};

exports.stop = function () {
  d = true;
  e.initNodeState();
  clearTimeout(l);
  o([]);
};

exports.reset = function () {};

exports.deleteNode = function (e) {
  Editor.Selection.unselect("node", e, true);
  Editor.Ipc.sendToPanel("scene", "scene:delete-nodes", e);
};
