"use strict";
const e = require("electron"),
  t = e.ipcMain,
  i = require("child_process").spawn,
  n = require("path"),
  o = require("fire-fs"),
  r = require("plist"),
  s = JSON.parse(o.readFileSync(Editor.App.home + "/profiles/settings.json"));
t.on("cloud-function:open-text-file", function (t, i) {
  if ("default" === s["script-editor"])
    if (Editor.isWin32) {
      1 ===
        Editor.Dialog.messageBox({
          type: "warning",
          buttons: [Editor.T("MESSAGE.cancel"), Editor.T("MESSAGE.yes")],
          title: Editor.T("MESSAGE.warning"),
          message: Editor.T("MESSAGE.warning"),
          detail: Editor.T("PREFERENCES.vacancy_script_editor_tips"),
        }) &&
        (Editor.Ipc.sendToMain("preferences:update-tab", 1),
        Editor.Ipc.sendToPanel("preferences", "update-tab", 1),
        Editor.Panel.open("preferences"));
    } else e.shell.openItem ? e.shell.openItem(i) : e.shell.openPath(i);
  else i && Editor.Ipc.sendToMain("cloud-function:open-text-file-by-path", i);
}),
  t.on("cloud-function:open-text-file-by-path", function (e, t) {
    let a = s["script-editor"];
    if ("default" === a)
      return Editor.warn(
        "Can not open " + t + " because text editor is not configured."
      );
    let d = [],
      p = "";
    if ("darwin" === process.platform) {
      if (a.endsWith(".app")) {
        a = n.join(a, "/Contents/MacOS/");
        let e = r.parse(o.readFileSync(n.join(a, "../Info.plist"), "utf8"));
        a = n.join(a, e.CFBundleExecutable);
      }
      -1 !== a.indexOf("Visual Studio Code")
        ? ((p = a), (d = [Editor.Project.path, t, "-n"]))
        : ((p = "open"), (d = ["-a", n.basename(a), t]));
    } else -1 !== a.indexOf("Code") ? ((p = a), (d = [Editor.Project.path, t, "-r"])) : ((p = a), (d = [t]));
    i(p, d, { detached: !0, stdio: "ignore" }).unref();
  });
