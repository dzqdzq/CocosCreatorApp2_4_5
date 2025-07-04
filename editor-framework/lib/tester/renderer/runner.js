(() => {
  "use strict";
  const e = require("electron");
  const r = require("fire-path");

  process.stdout.write = function (...r) {
    e.ipcRenderer.send.apply(e.ipcRenderer, ["stdout:write", ...r]);
  };

  let t = require("../share/tap");
  t.detail = Editor.argv.detail;
  t.init(Editor.argv.reporter);

  t.on("end", () => {
    e.ipcRenderer.send("tap:end", t._fail);
  });

  window.tap = t;
  window.helper = require("./helper");
  window.suite = t.suite;

  window.addEventListener("resize", () => {
    if (window.helper.targetEL) {
      window.helper.targetEL.dispatchEvent(new window.CustomEvent("resize"));
    }
  });

  window.onerror = function (r, t, i, n, d) {
      e.ipcRenderer.send("tap:error", d.stack || d);
    };

  Editor.argv.files.forEach((t) => {
    let i = r.resolve(t);
    try {
      require(i);
    } catch (r) {
      e.ipcRenderer.send(
        "tap:error",
        `Failed to load spec: ${t}\n ${r.stack}`
      );
    }
  });

  t.end();
})();
