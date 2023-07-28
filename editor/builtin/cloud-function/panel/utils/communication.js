"use strict";
let e = {
  context: "popup-context-menu",
  create: "popup-create-menu",
  search: "popup-search-menu",
};
exports.popup = function (p, o) {
  Editor.Ipc.sendToMain(
    `cloud-function:${e[p]}`,
    o.x,
    o.y,
    o.assetType,
    o.allowAssign || false,
    o.id,
    o.copyEnable
  );
};
