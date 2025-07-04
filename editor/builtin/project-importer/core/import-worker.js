(() => {
  "use strict";
  const e = require("path");
  const r = require("electron").ipcRenderer;

  window.onerror = function (e, r, i, t, o) {
    window.onerror = null;
    Editor.Ipc.sendToMain("app:import-project-abort", o.stack);
  };

  r.on("app:init-import-worker", function (r) {
    let i = Editor.url("app://editor/page/scene-utils");

    Editor.Protocol.register("scene", (r) =>
      e.join(i, r.hostname || "", r.path || "")
    );

    Editor.require("app://editor/share/editor-utils");
    Editor.require("unpack://engine-dev");
    Editor.require("app://editor/page/engine-extends");
    Editor.require("app://editor/share/engine-extends/init");
    Editor.require("app://editor/share/engine-extends/serialize");
    Editor.require("app://editor/share/register-builtin-assets");
    Editor.require("app://editor/page/asset-db");
    Editor.require("app://editor/page/scene-utils");

    require("async").waterfall(
      [
        function (e) {
          var r = Editor.remote.importPath.replace(/\\/g, "/");
          cc.assetManager.init({ importBase: r, nativeBase: r });
          var i = document.createElement("canvas");
          document.body.appendChild(i);
          i.id = "engine-canvas";

          cc.game.run(
            {
              width: 800,
              height: 600,
              id: "engine-canvas",
              debugMode: cc.debug.DebugMode.INFO,
            },
            e
          );
        },
      ],
      r.reply
    );
  });

  r.on("app:import-project", function (e, r, i) {
    var t = Editor.require(i);

    if (t.importer) {
      t.importer(r, (...r) => {
            e.reply(...r);
          });
    } else {
      e.reply(new Error("Not found correct importer."));
    }
  });
})();
