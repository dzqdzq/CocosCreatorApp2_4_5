"use strict";
const e = Editor;
let r = e.argv;
e._buildCommand = r.build;
e._compileCommand = r.compile;
e.showInternalMount = true;
require("../../../share/default-profiles");
e.Network = require("../network");
e.Project = require("../project");
e.Engine = require("../engine");
e.AssetDB = require("../asset-db");
e.assetdb = e.AssetDB.assetdb;
require("../i18n");
require("../protocol");
e.PreviewServer = require("../preview-server");
e.Metrics = require("../../../share/metrics");
e.CocosAnalytics = require("../../../share/cocos-analytics");
e.Scene = require("../../share/editor-scene");
e.Compiler = require("../../core/compiler");
e.ProjectCompiler = require("../../share/quick-compile/compile-project");
e.Builder = require("../builder");
e.NativeUtils = require("../../core/native-utils");
e.isBuilder = false;
e.stashedScene = null;
e.currentSceneUuid = null;
e.builtinCocosRoot = "";
require("../../core/ipc");
require("../../core/create-package.js");
require("../windows");
require("../../share/editor-utils");
e.User = require("../../../share/user");

if (!e.assets) {
  e.assets = {};
}

if (!e.metas) {
  e.metas = {};
}

if (!e.inspectors) {
  e.inspectors = {};
}

if (!e.properties) {
  e.properties = {};
}

if (!e.assettype2name) {
  e.assettype2name = {};
}

e.gizmos = {};
e.sceneScripts = {};

e.init({
  i18n: require(`../../../share/i18n/${e.lang}/localization`),
  "main-menu": require("../../core/main-menu"),
  "panel-window": "unpack://static/window.html",
  layout: "unpack://static/layout/landscape.json",
  selection: ["asset", "node"],
  "package-search-path": [
    e.dev ? "app://builtin" : "app://../builtin",
    "app://editor/builtin",
  ],
  theme: "default",
  "theme-search-path": ["app://themes"],
});

e.projectInfo = {
    get name() {
      Editor.warn(
        "'Editor.projectInfo.name' has been deprecated, please use 'Editor.Project.name'."
      );

      return e.Project.name;
    },
    get path() {
      Editor.warn(
        "'Editor.projectInfo.path' has been deprecated, please use 'Editor.Project.path'."
      );

      return e.Project.path;
    },
  };

module.exports = e;
