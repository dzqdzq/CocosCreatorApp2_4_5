"use strict";

const {
    download: o,
    install: t,
    unzip: e,
    remove: i,
    getList: r,
    downloadZip: s,
  } = require("./lib/store");

const a = require("./utils/package");

exports.messages = {
  open() {
    Editor.Panel.open("store");
  },
  async download(t, e) {
    try {
      await o(e);
    } catch (o) {
      Editor.error(o);

      Editor.Dialog.messageBox({
        title: Editor.T("store.dialog.download_error"),
        message: o.message,
        buttons: [Editor.T("store.button.confirm")],
        defaultId: 0,
        cancelId: 0,
      });
    }
  },
  async "download-zip"(o, t, e) {
    try {
      const o = await s(t, e, (o) => {});
      Editor.Ipc.sendToAll("store:download-zip-succeed", t, e, o);
    } catch (o) {
      Editor.Ipc.sendToAll("store:download-zip-failed", t, e);
    }
  },
  "install-zip"(o, t) {
    a.install(t, "global", (o, e) => {
      if (o) {
        Editor.Ipc.sendToAll("store:install-zip-failed", t);
      } else {
        setTimeout(() => {
              Editor.Ipc.sendToAll("store:install-zip-succeed", t);
            }, 1e3);
      }
    });
  },
  async unzip(o, t, i) {
    try {
      await e(t, i);
    } catch (o) {
      Editor.error(o);

      Editor.Dialog.messageBox({
        title: Editor.T("store.dialog.zip_error"),
        message: o.message,
        buttons: [Editor.T("store.button.confirm")],
        defaultId: 0,
        cancelId: 0,
      });
    }
  },
  async install(o, e, i) {
    try {
      await t(e, i);
    } catch (o) {
      Editor.error(o);

      Editor.Dialog.messageBox({
        title: Editor.T("store.dialog.install_error"),
        message: o.message,
        buttons: [Editor.T("store.button.confirm")],
        defaultId: 0,
        cancelId: 0,
      });
    }
  },
  remove(o, t, e) {
    i(t, e);
  },
  clear(o) {
    r()
      .map((o) => ({
        production_id: o.production_id,
        version_id: o.version_id,
      }))
      .forEach((o) => {
        i(o.production_id, o.version_id);
      });
  },
  "query-download-list"(o) {
    o.reply(null, r());
  },
  "app:sign-out"() {
    Editor.Panel.close("store");
  },
};

exports.load = function () {};
exports.unload = function () {};
