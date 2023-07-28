"use strict";
const e = require("electron").BrowserWindow;
const o = require("./menu/create");
const r = require("./menu/search");
const n = require("./menu/node");

module.exports = {
  load() {},
  unload() {},
  messages: {
    open() {
      Editor.Panel.open("hierarchy");
    },
    "popup-create-menu"(r, n, t, u, s) {
      var p = o(null, u);
      var a = new Editor.Menu(p, r.sender);
      n = Math.floor(n);
      t = Math.floor(t);
      a.nativeMenu.popup(e.fromWebContents(r.sender), n, t);
      a.dispose();
    },
    "popup-search-menu"(o, n, t, u, s) {
      var p = r();
      var a = new Editor.Menu(p, o.sender);
      n = Math.floor(n);
      t = Math.floor(t);
      a.nativeMenu.popup(e.fromWebContents(o.sender), n, t);
      a.dispose();
    },
    "popup-node-menu"(o, r, t, u, s, p, a) {
      var d = n(u, s, p, a);
      var i = new Editor.Menu(d, o.sender);
      r = Math.floor(r);
      t = Math.floor(t);
      i.nativeMenu.popup(e.fromWebContents(o.sender), r, t);
      i.dispose();
    },
  },
};
