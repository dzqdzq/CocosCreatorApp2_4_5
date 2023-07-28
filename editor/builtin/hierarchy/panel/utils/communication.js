"use strict";
let e = {
  node: "popup-node-menu",
  create: "popup-create-menu",
  search: "popup-search-menu",
};
exports.popup = function (o, c) {
  const n = require("./cache");
  const t = Editor.Selection.contexts("node");
  const p = n.queryRoots();
  Editor.Ipc.sendToMain(
    `hierarchy:${e[o]}`,
    c.x,
    c.y,
    n.recording,
    !!(t && t.length > 0),
    n.copyNodes && n.copyNodes.length > 0,
    n.editPrefab && t.includes(p[0])
  );
};
