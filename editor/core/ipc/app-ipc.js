"use strict";
const e = require("electron");
const r = e.ipcMain;
const i = Editor.Profile.load("global://settings.json");

r.on("app:explore-project", () => {
  e.shell.showItemInFolder(Editor.Project.path);
});

r.on("app:explore-app", () => {
  e.shell.showItemInFolder(Editor.App.path);
});

r.on("app:build-project", (e, r) => {
  Editor.Builder.build(r);
});

r.on("app:query-cocos-templates", (e) => {
  Editor.NativeUtils.getCocosTemplates((r, i) => {
    e.reply(r, i);
  });
});

r.on("app:query-android-apilevels", (e) => {
  Editor.NativeUtils.getAndroidAPILevels((r, i) => {
    e.reply(r, i);
  });
});

r.on("app:query-android-instant-apilevels", (e) => {
  Editor.NativeUtils.getAndroidInstantAPILevels((r, i) => {
    e.reply(r, i);
  });
});

r.on("app:compile-project", (e, r) => {
  Editor.Builder.compile(r);
});

r.on("app:open-cocos-console-log", () => {
  Editor.NativeUtils.openNativeLogFile();
});

r.on("app:stop-compile", () => {
  Editor.NativeUtils.stopCompile();
});

r.on("app:run-project", (r, i) => {
  var t = i.platform;
  if ("ios" === t ||
  "android" === t ||
  "mac" === t ||
  "win32" === t ||
  "android-instant" === t) {
    Editor.NativeUtils.run(i, function (e) {
      if (e) {
        Editor.failed(e);
        return;
      }
    });
  } else {
    var o = `http://localhost:${
      Editor.PreviewServer.previewPort
    }/build?_t=${Date.now()}`;
    e.shell.openExternal(o);
    e.shell.beep();
  }
});

r.on("app:save-keystore", (e, r) => {
  Editor.NativeUtils.saveKeystore(r, (r) => {
    if (r) {
      e.reply(r.toString());
      return;
    }
    e.reply();
  });
});

r.on("app:update-build-preview-path", (e, r) => {
  Editor.PreviewServer.setPreviewBuildPath(r);
});

r.on("app:update-android-instant-preview-path", (e, r) => {
  Editor.PreviewServer.setPreviewAndroidInstantPath(r);
});

r.on("app:play-on-device", (r, t) => {
  let o = t ? t.platform : i.get("preview-platform");
  if ("browser" === o) {
    let r = i.get("preview-browser");
    var l = `http://localhost:${Editor.PreviewServer.previewPort}`;
    if ("default" === r) {
      e.shell.openExternal(l);
    } else {
      let e = require("child_process").spawn;
      let i = [];
      let t = "";

      if (Editor.isDarwin) {
        t = "open";
        i = [l, "-a", r];
      } else {
        t = r;
        i = [l];
      }

      e(t, i, { detached: true, stdio: "ignore" }).unref();
    }
  } else {
    if ("simulator" === o) {
      Editor.NativeUtils.runSimulator(t);
    }
  }
});

r.on("app:reload-on-device", () => {
  if ("browser" === i.get("preview-platform")) {
    Editor.PreviewServer.browserReload();
  }
});

r.on("app:query-plugin-scripts", (e, r) => {
  Editor.assetdb.queryMetas("db://**/*", "javascript", function (i, t) {
    if (i) {
      return e.reply(i);
    }
    var o;

    o = require("../../share/build-platforms")[r].isNative
      ? (e) => e.isPlugin && e.loadPluginInNative
      : "editor" === r
      ? (e) => e.isPlugin && e.loadPluginInWeb && e.loadPluginInEditor
      : (e) => e.isPlugin && e.loadPluginInWeb;

    var l = t.filter(o).map((e) => Editor.assetdb.uuidToFspath(e.uuid));
    l.sort();
    e.reply(null, l);
  });
});
