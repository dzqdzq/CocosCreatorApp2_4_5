"use strict";
const e = require("../package.json");
let t = Editor.Profile.load("project://project.json");
module.exports = () => {
  let s = t.get("assets-sort-type");
  return [
    {
      label: Editor.T("ASSETS.sort_name"),
      type: "radio",
      checked: "name" === s,
      click() {
        t.set("assets-sort-type", "name");
        t.save();
        Editor.Ipc.sendToPanel(e.name, "assets:sort");
      },
    },
    {
      label: Editor.i18n.t("ASSETS.sort_ext"),
      type: "radio",
      checked: "ext" === s,
      click() {
        t.set("assets-sort-type", "ext");
        t.save();
        Editor.Ipc.sendToPanel(e.name, "assets:sort");
      },
    },
  ];
};
