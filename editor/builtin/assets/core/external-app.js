"use strict";
const e = require("electron");
const t = e.ipcMain;
const i = require("child_process").spawn;
const o = require("path");
const n = require("fire-fs");
const s = require("plist");
const r = Editor.Profile.load("global://settings.json");

t.on("assets:open-text-file", function (t, i) {
  if ("default" === r.get("script-editor")) {
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

      return;
    }
    let t = n.existsSync(i) ? i : Editor.assetdb.uuidToFspath(i);
    e.shell.openPath(t);
  } else {
    let e = n.existsSync(i) ? i : Editor.assetdb.uuidToFspath(i);

    if (e) {
      Editor.Ipc.sendToMain("assets:open-text-file-by-path", e);
    }
  }
});

t.on("assets:open-text-file-by-path", function (e, t) {
  let a = r.get("script-editor");
  if ("default" === a) {
    return Editor.warn(
      "Can not open " + t + " because text editor is not configured."
    );
  }
  let d = [];
  let p = "";
  if ("darwin" === process.platform) {
    if (a.endsWith(".app")) {
      a = o.join(a, "/Contents/MacOS/");
      let e = s.parse(n.readFileSync(o.join(a, "../Info.plist"), "utf8"));
      a = o.join(a, e.CFBundleExecutable);
    }

    if (-1 !== a.indexOf("Visual Studio Code")) {
      p = a;
      d = [Editor.Project.path, t, "-n"];
    } else {
      p = "open";
      d = ["-a", o.basename(a), t];
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

t.on("assets:open-texture-file", function (e, t) {
  let i = Editor.assetdb.uuidToFspath(t);

  if (i) {
    Editor.Ipc.sendToMain("assets:open-texture-file-by-path", i);
  }
});

t.on("assets:open-texture-file-by-path", function (e, t) {
  let a = r.get("picture-editor-root");
  if (a) {
    let e = [];
    let r = "";
    if ("darwin" === process.platform) {
      if (a.endsWith(".app")) {
        a = o.join(a, "/Contents/MacOS/");
        let e = s.parse(n.readFileSync(o.join(a, "../Info.plist"), "utf8"));
        a = o.join(a, e.CFBundleExecutable);
      }
      r = "open";
      e = ["-a", a, t];
    } else {
      r = a;
      e = [t];
    }
    i(r, e, { detached: true, stdio: "ignore" }).unref();
  }
});
