"use strict";
const e = require("electron");
const t = e.ipcMain;
const i = require("child_process").spawn;
const n = require("path");
const o = require("fire-fs");
const r = require("plist");
const s = JSON.parse(o.readFileSync(Editor.App.home + "/profiles/settings.json"));

t.on("cloud-function:open-text-file", function (t, i) {
  if ("default" === s["script-editor"]) {
    if (Editor.isWin32) {
      if (1 ===
        Editor.Dialog.messageBox({
          type: "warning",
          buttons: [Editor.T("MESSAGE.cancel"), Editor.T("MESSAGE.yes")],
          title: Editor.T("MESSAGE.warning"),
          message: Editor.T("MESSAGE.warning"),
          detail: Editor.T("PREFERENCES.vacancy_script_editor_tips"),
        })) {
        Editor.Ipc.sendToMain("preferences:update-tab", 1);
        Editor.Ipc.sendToPanel("preferences", "update-tab", 1);
        Editor.Panel.open("preferences");
      }
    } else {
      if (e.shell.openItem) {
        e.shell.openItem(i);
      } else {
        e.shell.openPath(i);
      }
    }
  } else {
    if (i) {
      Editor.Ipc.sendToMain("cloud-function:open-text-file-by-path", i);
    }
  }
});

t.on("cloud-function:open-text-file-by-path", function (e, t) {
  let a = s["script-editor"];
  if ("default" === a) {
    return Editor.warn(
      "Can not open " + t + " because text editor is not configured."
    );
  }
  let d = [];
  let p = "";
  if ("darwin" === process.platform) {
    if (a.endsWith(".app")) {
      a = n.join(a, "/Contents/MacOS/");
      let e = r.parse(o.readFileSync(n.join(a, "../Info.plist"), "utf8"));
      a = n.join(a, e.CFBundleExecutable);
    }

    if (-1 !== a.indexOf("Visual Studio Code")) {
      p = a;
      d = [Editor.Project.path, t, "-n"];
    } else {
      p = "open";
      d = ["-a", n.basename(a), t];
    }
  } else {
    if (-1 !== a.indexOf("Code")) {
      p = a;
      d = [Editor.Project.path, t, "-r"];
    } else {
      p = a;
      d = [t];
    }
  }
  i(p, d, { detached: true, stdio: "ignore" }).unref();
});
