"use strict";
const e = require("electron").ipcMain,
  a = require("path"),
  t = require("fire-fs"),
  r = Editor.url("unpack://static/package-template");
function i(e, a, r) {
  var i = t.readFileSync(e, { encoding: "utf8" });
  t.writeFileSync(e, i.replace(new RegExp(a, "ig"), r), { encoding: "utf8" });
}
e.on("editor:create-package", async (e, c) => {
  var n = "";
  "global" === c
    ? (n = a.join(Editor.App.home, "packages"))
    : "project" === c && (n = a.join(Editor.Project.path, "packages"));
  var o = await Editor.Dialog.saveFile({
    title: Editor.T("MESSAGE.package.title"),
    defaultPath: n,
    buttonLabel: Editor.T("MESSAGE.package.create"),
  });
  if (!o) return;
  if (t.isDirSync(o))
    return (
      Editor.error(
        "Failed to create package at " + o + ", Directory already exists!"
      ),
      void 0
    );
  const s = a.basename(o),
    u = Editor.Package.packagePath(s);
  if (Editor.Package.packagePath(s))
    return (
      Editor.error(
        `Failed to create ${s} package because it has the same name as ${u}`
      ),
      void 0
    );
  (function (e, c) {
    var n = a.basename(e);
    t.copy(r, e, function (t) {
      if (t) return c(t);
      (function (e, t, c) {
        var n = a.basename(r);
        return (
          i(a.join(t, "package.json"), n, e),
          i(a.join(t, "main.js"), n, e),
          i(a.join(t, "panel", "index.js"), n, e),
          c(null)
        );
      })(n, e, c);
    });
  })(o, function (e) {
    e ? Editor.error(e) : Editor.success("Create package successfully at " + o);
  });
});
