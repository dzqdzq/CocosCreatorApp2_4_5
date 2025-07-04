"use strict";
exports.getPrefabMenuTemplate = function (e) {
  return [
    {
      label: Editor.T("node-library.menu.delete"),
      enabled: e.modify,
      click() {
        Editor.Ipc.sendToPanel("node-library", "node-library:delete-prefab", e);
      },
    },
    {
      label: Editor.T("node-library.menu.rename"),
      enabled: e.modify,
      click() {
        Editor.Ipc.sendToPanel("node-library", "node-library:rename-prefab", e);
      },
    },
    {
      label: Editor.T("node-library.menu.icon"),
      enabled: e.modify,
      click() {
        Editor.Ipc.sendToPanel(
          "node-library",
          "node-library:set-prefab-icon",
          e
        );
      },
    },
  ];
};
