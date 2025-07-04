"use strict";
const o = require("electron");
const e = o.clipboard;

module.exports = {
  load() {
    Editor.Menu.register(
      "open-log-file",
      () => [
        {
          label: Editor.T("CONSOLE.editor_log"),
          params: [],
          click() {
            Editor.Ipc.sendToMain("console:open-log-file");
          },
        },
        {
          label: Editor.T("CONSOLE.cocos_console_log"),
          params: [],
          click() {
            Editor.Ipc.sendToMain("app:open-cocos-console-log");
          },
        },
      ],
      true
    );
  },
  unload() {
    Editor.Menu.unregister("open-log-file");
  },
  messages: {
    open() {
      Editor.Panel.open("console");
    },
    "open-log-file": function () {
      o.shell.openPath(Editor.logfile);
    },
    "console:clear"(o, e, n) {
      Editor.clearLog(e, n);
    },
    "popup-open-log-menu": function (e, n, l) {
      let r = Editor.Menu.getMenu("open-log-file");
      let i = new Editor.Menu(r, e.sender);
      n = Math.floor(n);
      l = Math.floor(l);
      i.nativeMenu.popup(o.BrowserWindow.fromWebContents(e.sender), n, l);
      i.dispose();
    },
    "popup-item-menu"(n, l, r, i) {
      var t = [
        {
          label: Editor.T("CONSOLE.copy_to_clipboard"),
          params: [],
          click() {
            e.writeText(i || "");
          },
        },
      ];
      let p = new Editor.Menu(t, n.sender);
      l = Math.floor(l);
      r = Math.floor(r);
      p.nativeMenu.popup(o.BrowserWindow.fromWebContents(n.sender), l, r);
      p.dispose();
    },
    "app:play-on-device"() {
      Editor.Ipc.sendToPanel("console", "editor:console-on-device-play");
    },
  },
};
