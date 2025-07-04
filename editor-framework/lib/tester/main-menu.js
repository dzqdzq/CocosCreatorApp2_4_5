"use strict";
const e = require("electron");
module.exports = function () {
  return [
    {
      label: "Test Runner",
      submenu: [
        { label: "Hide", accelerator: "CmdOrCtrl+H", role: "hide" },
        {
          label: "Hide Others",
          accelerator: "CmdOrCtrl+Shift+H",
          role: "hideothers",
        },
        { label: "Show All", role: "unhide" },
        { type: "separator" },
        { label: "Quit", accelerator: "CmdOrCtrl+Q", role: "quit" },
      ],
    },
    {
      label: "Edit",
      submenu: [
        { label: "Undo", accelerator: "CmdOrCtrl+Z", role: "undo" },
        { label: "Redo", accelerator: "Shift+CmdOrCtrl+Z", role: "redo" },
        { type: "separator" },
        { label: "Cut", accelerator: "CmdOrCtrl+X", role: "cut" },
        { label: "Copy", accelerator: "CmdOrCtrl+C", role: "copy" },
        { label: "Paste", accelerator: "CmdOrCtrl+V", role: "paste" },
        { label: "Select All", accelerator: "CmdOrCtrl+A", role: "selectall" },
      ],
    },
    {
      label: "Window",
      id: "window",
      submenu: Editor.isDarwin
        ? [
            { label: "Minimize", accelerator: "CmdOrCtrl+M", role: "minimize" },
            { label: "Close", accelerator: "CmdOrCtrl+W", role: "close" },
            { type: "separator" },
            { label: "Bring All to Front", role: "front" },
          ]
        : [{ label: "Close", accelerator: "CmdOrCtrl+W", role: "close" }],
    },
    {
      label: "Developer",
      id: "developer",
      submenu: [
        {
          label: "Reload",
          accelerator: "CmdOrCtrl+R",
          click() {
            e.ipcMain.emit("mocha-reload");
            e.BrowserWindow.getFocusedWindow().reload();
          },
        },
        { type: "separator" },
        {
          label: "Inspect Element",
          accelerator: "CmdOrCtrl+Shift+C",
          click() {
            let l = e.BrowserWindow.getFocusedWindow();
            let r = Editor.Window.find(l);

            if (r) {
              r.send("editor:window-inspect");
            }
          },
        },
        {
          label: "Developer Tools",
          accelerator: "CmdOrCtrl+Alt+I",
          click() {
            let l = e.BrowserWindow.getFocusedWindow();

            if (l) {
              l.openDevTools();
            }
          },
        },
      ],
    },
  ];
};
