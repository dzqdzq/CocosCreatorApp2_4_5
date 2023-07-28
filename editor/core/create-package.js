"use strict";
const e = require("electron").ipcMain;
const a = require("path");
const t = require("fire-fs");
const r = Editor.url("unpack://static/package-template");
function i(e, a, r) {
  var i = t.readFileSync(e, { encoding: "utf8" });
  t.writeFileSync(e, i.replace(new RegExp(a, "ig"), r), { encoding: "utf8" });
}
e.on("editor:create-package", async (e, c) => {
  var n = "";

  if ("global" === c) {
    n = a.join(Editor.App.home, "packages");
  } else {
    if ("project" === c) {
      n = a.join(Editor.Project.path, "packages");
    }
  }

  var o = await Editor.Dialog.saveFile({
    title: Editor.T("MESSAGE.package.title"),
    defaultPath: n,
    buttonLabel: Editor.T("MESSAGE.package.create"),
  });
  if (!o) {
    return;
  }
  if (t.isDirSync(o)) {
    Editor.error(
      "Failed to create package at " + o + ", Directory already exists!"
    );

    return;
  }
  const s = a.basename(o);
  const u = Editor.Package.packagePath(s);
  if (Editor.Package.packagePath(s)) {
    Editor.error(
      `Failed to create ${s} package because it has the same name as ${u}`
    );

    return;
  }
  (function (e, c) {
    var n = a.basename(e);
    t.copy(r, e, function (t) {
      if (t) {
        return c(t);
      }
      (function (e, t, c) {
        var n = a.basename(r);
        i(a.join(t, "package.json"), n, e);
        i(a.join(t, "main.js"), n, e);
        i(a.join(t, "panel", "index.js"), n, e);
        return c(null);
      })(n, e, c);
    });
  })(o, function (e) {
    if (e) {
      Editor.error(e);
    } else {
      Editor.success("Create package successfully at " + o);
    }
  });
});
