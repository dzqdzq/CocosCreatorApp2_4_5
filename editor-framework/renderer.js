"use strict";
(async () => {
  try {
    require("./lib/share/require"), require("./lib/share/polyfills");
    const e = require("electron"),
      t = require("fire-path");
    let r,
      o = !1;
    (window.onerror = function (e, t, o, a, n) {
      return (
        r && r.Ipc.sendToMain
          ? r.Ipc.sendToMain("editor:renderer-console-error", n.stack || n)
          : console.error(n.stack || n),
        !1
      );
    }),
      window.addEventListener("dragstart", (e) => {
        e.preventDefault(), e.stopPropagation();
      }),
      window.addEventListener("drop", (e) => {
        e.preventDefault(), e.stopPropagation();
      }),
      window.addEventListener("dragover", (e) => {
        (e.dataTransfer.dropEffect = "none"),
          e.preventDefault(),
          e.stopPropagation();
      }),
      window.addEventListener("contextmenu", (e) => {
        e.preventDefault(), e.stopPropagation();
      }),
      window.addEventListener("copy", (e) => {
        if (e.target !== document.body) return;
        let t = r.UI.focusedPanelFrame;
        t &&
          (e.preventDefault(),
          e.stopPropagation(),
          r.UI.fire(t, "panel-copy", {
            bubbles: !1,
            detail: { clipboardData: e.clipboardData },
          }));
      }),
      window.addEventListener("cut", (e) => {
        if (e.target !== document.body) return;
        let t = r.UI.focusedPanelFrame;
        t &&
          (e.preventDefault(),
          e.stopPropagation(),
          r.UI.fire(t, "panel-cut", {
            bubbles: !1,
            detail: { clipboardData: e.clipboardData },
          }));
      }),
      window.addEventListener("paste", (e) => {
        if (e.target !== document.body) return;
        let t = r.UI.focusedPanelFrame;
        t &&
          (e.preventDefault(),
          e.stopPropagation(),
          r.UI.fire(t, "panel-paste", {
            bubbles: !1,
            detail: { clipboardData: e.clipboardData },
          }));
      }),
      window.addEventListener("beforeunload", (e) => {
        let t = require("electron").remote.getCurrentWindow();
        t && (t = Editor.remote.Window.find(t)),
          o ||
            ((e.returnValue = !0),
            (async () => {
              let e = r.Panel.panels,
                a = !1;
              for (let t = 0; t < e.length; t++) {
                let r = !0,
                  o = e[t];
                if ((!a && o.canClose && (r = await o.canClose()), !1 === r)) {
                  a = !0;
                  break;
                }
              }
              a
                ? (t.closing = !1)
                : (e.forEach((e) => {
                    if (e.close)
                      try {
                        e.close();
                      } catch (e) {}
                  }),
                  (o = !0),
                  t &&
                    setImmediate(() => {
                      t.closing ? t.nativeWin.close() : t.nativeWin.reload();
                    }));
            })());
      }),
      e.webFrame.setVisualZoomLevelLimits
        ? e.webFrame.setVisualZoomLevelLimits(1, 1)
        : e.webFrame.setZoomLevelLimits(1, 1);
    let a = e.remote.getGlobal("Editor"),
      n = a.url("app://"),
      i = a.url("editor-framework://");
    if (
      (require("module").globalPaths.push(t.join(n, "node_modules")),
      ((r = require(`${i}/lib/renderer`)).remote = a),
      window.location.hash)
    ) {
      let e = window.location.hash.slice(1);
      r.argv = Object.freeze(JSON.parse(decodeURIComponent(e)));
    } else r.argv = {};
    (r.dev = a.dev),
      (r.lang = a.lang),
      (r.appPath = n),
      (r.frameworkPath = i),
      (r.Ipc.debug = a.dev),
      r.Protocol.init(r);
  } catch (e) {
    window.onload = function () {
      let t = require("electron").remote.getCurrentWindow();
      t.setSize(800, 600),
        t.center(),
        t.show(),
        t.openDevTools(),
        console.error(e.stack || e);
    };
  }
})();
