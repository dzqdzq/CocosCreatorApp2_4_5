const { ipcRenderer: e, remote: t } = require("electron");
const n = require("fs");
const r = require("path");

global.hostAPI = {
  storeVersion: (function (e) {
    try {
      return JSON.parse(n.readFileSync(e, "utf-8"));
    } catch (e) {
      return {};
    }
  })(`${__dirname}/../package.json`).version,
  sendToHost: (t, ...n) => e.sendToHost(t, n),
  jumpUrl: (t, n = false) => e.sendToHost(`__${n ? "cocos" : "normal"}_jump`, t),
  async selectFile(s = {}) {
    const o = ["openFile"];

    if (s.multiSelections) {
      o.push("multiSelections");
    }

    const i = t.dialog.showOpenDialog({
      title:
        s.title ||
        (await (function (t) {
          return new Promise((n, r) => {
            e.sendToHost("__translate", t);

            e.once("__translate_finished", (e, t) => {
              n(t);
            });
          });
        })("store.dialog.select_files")),
      properties: o,
      filters: s.filters,
    });
    function l(e) {
      const t = r.basename(e);
      const s = n.readFileSync(e);
      return new File([s], t);
    }
    return i
      ? i.then
        ? new Promise((e, t) => {
            i.then((n) => {
              if (n.canceled) {
                t(null);
              }

              e(n.filePaths.map(l));
            });
          })
        : Promise.resolve(i.filePaths.map(l))
      : Promise.reject(null);
  },
};
