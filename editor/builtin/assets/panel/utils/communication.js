"use strict";
let e = {
  context: "popup-context-menu",
  create: "popup-create-menu",
  search: "popup-search-menu",
  sort: "popup-sort-menu",
};
exports.popup = function (p, t) {
  Editor.Ipc.sendToMain(`assets:${e[p]}`, t.x, t.y, t);
};
