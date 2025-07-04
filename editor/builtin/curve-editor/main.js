"use strict";
const { open: e, close: o } = require("./panel/manager");
const n = require("electron").BrowserWindow;

module.exports = {
  load() {},
  unload() {},
  messages: {
    open(o, n) {
      e(o, n);
    },
    close(e) {
      o(e);
    },
    "curve-editor:popup-curve-menu"(e, o, r, s) {
      let u = new Editor.Menu(o, e.sender);
      r = Math.round(r);
      s = Math.round(s);
      u.nativeMenu.popup(n.fromWebContents(e.sender), r, s);
      u.dispose();
    },
  },
};
