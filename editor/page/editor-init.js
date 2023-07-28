"use strict";
const e = require("electron").ipcRenderer;
Editor.Project = Editor.remote.Project;
Editor.libraryPath = Editor.remote.libraryPath;
Editor.importPath = Editor.remote.importPath;
Editor.isBuilder = false;
Editor.globalProfile = Editor.remote.App._profile;
Editor.gizmos = Editor.remote.gizmos;
Editor.sceneScripts = Editor.remote.sceneScripts;

Editor.projectInfo = {
    get name() {
      Editor.warn(
        "'Editor.projectInfo.name' has been deprecated, please use 'Editor.Project.name'."
      );

      return Editor.Project.name;
    },
    get path() {
      Editor.warn(
        "'Editor.projectInfo.path' has been deprecated, please use 'Editor.Project.path'."
      );

      return Editor.Project.path;
    },
  };

if (!Editor.assets) {
  Editor.assets = {};
}

if (!Editor.metas) {
  Editor.metas = {};
}

if (!Editor.inspectors) {
  Editor.inspectors = {};
}

if (!Editor.properties) {
  Editor.properties = {};
}

if (!Editor.assettype2name) {
  Editor.assettype2name = {};
}

Editor.Utils = require("../share/editor-utils");
Editor.Scene = require("../share/editor-scene");
require("./ui");
let t = Editor.Profile.load("global://settings.json");
Editor.UI.Settings.stepFloat = t.get("step");

e.on("app:global-step-changed", (e, t) => {
  Editor.UI.Settings.stepFloat = t;
});

window.addEventListener(
  "keydown",
  (e) => {
    if ("win32" === process.platform &&
      window._Scene &&
      e.ctrlKey &&
      90 === e.keyCode) {
      e.preventDefault();

      if (e.shiftKey) {
        Editor.Ipc.sendToPanel("scene", "scene:redo");
      } else {
        Editor.Ipc.sendToPanel("scene", "scene:undo");
      }
    }
  },
  true
);
