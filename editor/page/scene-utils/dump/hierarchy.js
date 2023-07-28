"use strict";
const e = 0;
const r = 1;
const c = 2;
const t = 3;
let n = function (a) {
  let i = (function (n) {
      return n._prefab
        ? n._prefab.root
          ? n._prefab.root._prefab.asset
            ? n._prefab.root._prefab.sync
              ? c
              : r
            : t
          : r
        : e;
    })(a);

  let o = null;

  if (a._children && a._children.length > 0) {
    o = a._children.map(n);
  }

  return {
    name: a.name,
    id: a.uuid,
    children: o,
    prefabState: i,
    locked: !!(a._objFlags & cc.Object.Flags.LockedInEditor),
    isActive: a._activeInHierarchy,
    hidden: !!(a._objFlags & cc.Object.Flags.HideInHierarchy),
  };
};

module.exports = {
  node: (e, r) => (
    (e = e || cc.director.getScene()), ((r ? [e] : e._children) || []).map(n)
  ),
};
