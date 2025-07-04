(() => {
  "use strict";
  const e = require("electron").ipcRenderer;
  const r = (require("fire-fs"), require("fire-path"));

  window.onerror = function (e, r, i, o, n) {
    window.onerror = null;
    var t = n.stack || n;

    if (Editor &&
      Editor.Ipc &&
      Editor.Ipc.sendToMain) {
      Editor.Ipc.sendToMain("editor:renderer-console-error", t);
      Editor.Ipc.sendToMain("metrics:track-exception", t);
    }
  };

  window.addEventListener("unhandledrejection", function e(r) {
    window.removeEventListener("unhandledrejection", e);
    window.onerror(void 0, void 0, void 0, void 0, r.reason);
  });

  e.on("app:init-common-asset-worker", function (e) {
    Editor.require("app://editor/share/editor-utils");
    Editor.require("unpack://engine-dev");
    Editor.require("app://editor/share/engine-extends/init");
    Editor.require("app://editor/share/engine-extends/serialize");
    Editor.require("app://editor/page/asset-db");
    Editor.require("app://editor/share/register-builtin-assets");
    let i = Editor.url("app://editor/page/scene-utils");

    Editor.Protocol.register("scene", (e) =>
      r.join(i, e.hostname || "", e.path || "")
    );

    Editor.require("app://editor/page/scene-utils");
    e.reply(null);
  });

  e.on("app:start-common-asset-worker", async function (e, r, i) {
    let o = require(r);
    let n = await o(i);
    e.reply(null, n);
  });
})();
