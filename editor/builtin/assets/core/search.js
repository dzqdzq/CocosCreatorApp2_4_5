"use strict";
const e = require("../package.json");
module.exports = () => [
  {
    label: Editor.T("ASSETS.path"),
    click() {
      Editor.Ipc.sendToPanel(e.name, "change-filter", "");
    },
  },
  {
    label: Editor.T("ASSETS.type"),
    submenu: (function () {
      let t = [
          {
            label: "asset-bundle",
            click() {
              Editor.Ipc.sendToPanel(e.name, "change-filter", "t:asset-bundle");
            },
          },
          { type: "separator" },
        ];

      let l = Object.keys(Editor.assets);
      l.sort();
      for (let a = 0; a < l.length; ++a) {
        let n = l[a];
        t.push({
          label: n,
          click() {
            Editor.Ipc.sendToPanel(e.name, "change-filter", `t:${n}`);
          },
        });
      }
      return t;
    })(),
  },
  {
    label: Editor.T("ASSETS.uuid"),
    click() {
      Editor.Ipc.sendToPanel(e.name, "change-filter", "u:");
    },
  },
  {
    label: Editor.T("ASSETS.uuid_used_by"),
    click() {
      Editor.Ipc.sendToPanel(e.name, "change-filter", "used:");
    },
  },
];
