"use strict";
const e = require("./create");
module.exports = function (t, l, o, n) {
  return [
    { label: Editor.T("HIERARCHY.create"), enabled: !t, submenu: e(true, t) },
    { type: "separator" },
    {
      label: Editor.T("HIERARCHY.copy"),
      enabled: !t && l,
      click() {
        Editor.Ipc.sendToPanel("hierarchy", "copy");
      },
    },
    {
      label: Editor.T("HIERARCHY.paste"),
      enabled: !t && o,
      click() {
        let e = Editor.Selection.contexts("node");
        Editor.Ipc.sendToPanel(
          "scene",
          "scene:paste-nodes",
          e.length > 0 ? e[0] : ""
        );
      },
    },
    {
      label: Editor.T("HIERARCHY.duplicate"),
      enabled: !t && l,
      click() {
        let e = Editor.Selection.contexts("node");

        if (e.length > 0) {
          Editor.Ipc.sendToPanel("hierarchy", "duplicate", e);
        }
      },
    },
    { type: "separator" },
    {
      label: Editor.T("HIERARCHY.rename"),
      enabled: !t && l,
      click() {
        let e = Editor.Selection.contexts("node");

        if (e.length > 0) {
          Editor.Ipc.sendToPanel("hierarchy", "rename", e[0]);
        }
      },
    },
    {
      label: Editor.T("HIERARCHY.delete"),
      enabled: !t && l && !n,
      click() {
        let e = Editor.Selection.contexts("node");

        if (e.length > 0) {
          Editor.Ipc.sendToPanel("hierarchy", "delete", e);
        }
      },
    },
    { type: "separator" },
    {
      label: Editor.T("HIERARCHY.show_path"),
      enabled: l,
      click() {
        let e = Editor.Selection.contexts("node");

        if (e.length > 0) {
          Editor.Ipc.sendToPanel("hierarchy", "show-path", e[0]);
        }
      },
    },
  ];
};
