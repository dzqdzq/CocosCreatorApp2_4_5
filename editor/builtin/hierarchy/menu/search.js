"use strict";
require("./create");
module.exports = function (e, r) {
  return [
    {
      label: Editor.T("HIERARCHY.node"),
      click() {
        Editor.Ipc.sendToPanel("hierarchy", "change-filter", "");
      },
    },
    {
      label: Editor.T("HIERARCHY.component"),
      click() {
        Editor.Ipc.sendToPanel("hierarchy", "change-filter", "t:");
      },
    },
    {
      label: Editor.T("HIERARCHY.uuid_used_by"),
      click() {
        Editor.Ipc.sendToPanel("hierarchy", "change-filter", "used:");
      },
    },
  ];
};
