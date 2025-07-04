"use strict";
const e = require("fire-fs");
let r = require("path").join(
  Editor.Project.path,
  "local",
  "layout.editor.json"
);
if (e.existsSync(r)) {
  let t;
  try {
    t = JSON.parse(e.readFileSync(r, "utf8"));
  } catch (e) {
    t = null;
  } finally {
    if (!(t && t.version)) {
      Editor.warn(
          "Invalid layout profile, remove old profile and init a new one at: " + r
        );

      e.removeSync(r);
    }
  }
}
