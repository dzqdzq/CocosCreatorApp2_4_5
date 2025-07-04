"use strict";
const e = require("fire-path");

exports.init = function (e) {
  Editor.require("app://editor/page/editor-init");
  Editor.User = Editor.require("app://share/user");
  Editor.Metrics = Editor.require("app://share/metrics");
  Editor.CocosAnalytics = Editor.require("app://share/cocos-analytics");
  Editor.require("app://editor/page/asset-db");

  if (e) {
    exports.initEngineSupport();
  }
};

exports.initEngineSupport = function () {
  Editor.require("unpack://engine-dev");
  Editor.require("app://editor/page/engine-extends");
  let r = Editor.importPath.replace(/\\/g, "/");
  cc.assetManager.init({ importBase: r, nativeBase: r });
  Editor.require("app://editor/share/register-builtin-assets");
  let i = Editor.url("app://editor/page/scene-utils");
  Editor.Protocol.register("scene", (r) =>
    e.join(i, r.hostname || "", r.path || "")
  );
};
