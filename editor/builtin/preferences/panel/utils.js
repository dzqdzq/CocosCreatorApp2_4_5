"use strict";
const e = require("fire-fs");
const { dirname: t, join: i } = require("path");
const o = Editor.require("app://share/engine-utils");
let s = null;
exports.profiles = { global: null };

exports.resetSimulatorConfig = function (e) {
    s = o.getSimulatorConfigAt(e);
  };

exports.init = function () {
  exports.profiles.global = Editor.Profile.load("global://settings.json");

  (function () {
    let e = exports.profiles.global;
    let t = e.get("use-default-cpp-engine");
    s = o.getSimulatorConfigAt(!t && e.get("cpp-engine-path"));
  })();
};

exports.save = function () {
    let i = exports.profiles.global;
    i.save();
    let r = o.getSimulatorConfigPath(
      i.get("use-default-cpp-engine") ? void 0 : i.get("cpp-engine-path")
    );
    if (!e.existsSync(t(r))) {
      Editor.warn(
        "Sorry, save failed. Cannot find simulator config.json under " + r
      );

      return;
    }
    e.writeJsonSync(r, s, "utf-8");
  };

exports.queryGeneral = function () {
  let e = exports.profiles.global;
  return {
    language: e.get("language"),
    nodeState: e.get("node-tree-state"),
    ip: e.get("local-ip"),
    log: e.get("show-console-log"),
    step: e.get("step"),
    metaBackupDialog: e.get("show-meta-backup-dialog"),
    autoTrimImage: e.get("trim-imported-image"),
    autoSyncPrefab: e.get("auto-sync-prefab"),
    httpProxy: e.get("http-proxy"),
  };
};

exports.queryEditor = function () {
    let e = exports.profiles.global;
    return {
      sctiptEditorList: JSON.parse(JSON.stringify(e.get("script-editor-list"))),
      autoCompilerScript: e.get("auto-compiler-scripts"),
      customizeScriptEditor: e.get("script-editor"),
      customizePictureEditor: e.get("picture-editor-root"),
    };
  };

exports.queryNative = function () {
    let e = exports.profiles.global;
    return {
      useDefaultJsEngine: e.get("use-default-js-engine"),
      jsEnginePath: e.get("js-engine-path"),
      useDefaultCppEngine: e.get("use-default-cpp-engine"),
      cppEnginePath: e.get("cpp-engine-path"),
      weChatPath: e.get("wechatgame-app-path"),
      ndkPath: e.get("ndk-root"),
      sdkPath: e.get("android-sdk-root"),
      watchJsEngine: e.get("watch-js-engine"),
    };
  };

exports.queryPreview = function () {
  let e = exports.profiles.global;
  let t = e.get("clear-simulator-cache");
  let i = [];
  let o = s.simulator_screen_size;

  if (s &&
    o) {
    o.forEach((e, t) => {
        i.push({
          value: t + "",
          width: e.width,
          height: e.height,
          title: e.title,
        });
      });

    i.push({
      value: o.length + "",
      title: Editor.T("PREFERENCES.sim_res_custom"),
      custom: true,
    });
  }

  return {
    autoRefresh: e.get("auto-refresh"),
    simulatorDebugger: e.get("simulator-debugger"),
    previewBrowserList: e.get("preview-browser-list"),
    previewBrowser: e.get("preview-browser"),
    isLandscape: e.get("simulator-orientation"),
    resolution: e.get("simulator-resolution"),
    customizeSize: e.get("simulator-customsize-resolution"),
    clearSimulatorCache: "boolean" != typeof t || t,
    simulatorPath: s ? Editor.url("unpack://simulator/") : "",
    simulatorWaitForConnect: (s && s.init_cfg.waitForConnect) || false,
    resolutionList: i,
  };
};

exports.setGeneral = function (e) {
  let t = exports.profiles.global;

  if (t.get("language") !== e.language) {
    Editor.Dialog.messageBox({
      type: "info",
      buttons: [Editor.T("MESSAGE.preferences.ok")],
      title: Editor.T("MESSAGE.preferences.hint_title"),
      message: Editor.T("MESSAGE.preferences.hint_message"),
      detail: Editor.T("MESSAGE.preferences.hint_detail"),
      defaultId: 0,
      cancelId: 0,
      noLink: true,
    });
  }

  t.set("language", e.language);
  t.set("node-tree-state", parseInt(e.nodeState));
  t.set("local-ip", parseInt(e.ip));
  t.set("show-console-log", e.log);
  t.set("step", e.step);
  t.set("show-meta-backup-dialog", e.metaBackupDialog);
  t.set("trim-imported-image", e.autoTrimImage);
  t.set("auto-sync-prefab", e.autoSyncPrefab);
  t.set("http-proxy", e.httpProxy);
};

exports.setEditor = function (e) {
  let t = exports.profiles.global;
  t.set("script-editor-list", JSON.parse(JSON.stringify(e.sctiptEditorList)));
  t.set("auto-compiler-scripts", e.autoCompilerScript);
  t.set("script-editor", e.customizeScriptEditor);
  t.set("picture-editor-root", e.customizePictureEditor);
};

exports.setNative = function (e) {
  let t = exports.profiles.global;
  t.set("use-default-js-engine", e.useDefaultJsEngine);
  t.set("js-engine-path", e.jsEnginePath);
  t.set("use-default-cpp-engine", e.useDefaultCppEngine);
  t.set("cpp-engine-path", e.cppEnginePath);
  t.set("wechatgame-app-path", e.weChatPath);
  t.set("ndk-root", e.ndkPath);
  t.set("android-sdk-root", e.sdkPath);
  t.set("watch-js-engine", e.watchJsEngine);
};

exports.setPreview = function (e) {
  let t = exports.profiles.global;

  if ("string" == typeof e.isLandscape) {
    e.isLandscape = "true" === e.isLandscape;
  }

  t.set("auto-refresh", e.autoRefresh);
  t.set("simulator-debugger", e.simulatorDebugger);
  t.set("preview-browser-list", e.previewBrowserList);
  t.set("preview-browser", e.previewBrowser);
  t.set("simulator-orientation", e.isLandscape);
  t.set("simulator-resolution", parseInt(e.resolution));
  t.set("simulator-customsize-resolution", e.customizeSize);
  t.set("clear-simulator-cache", e.clearSimulatorCache);
  s.init_cfg.width = parseInt(e.customizeSize.width);
  s.init_cfg.height = parseInt(e.customizeSize.height);
  s.init_cfg.isLandscape = e.isLandscape;
  s.init_cfg.waitForConnect = e.simulatorWaitForConnect;
};
