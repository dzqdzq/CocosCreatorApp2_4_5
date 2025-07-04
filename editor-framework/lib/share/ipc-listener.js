"use strict";
const e = require("electron");
const s = require("./platform");
let i = null;
i = s.isMainProcess ? e.ipcMain : e.ipcRenderer;

module.exports = class {
  constructor() {
    this.listeningIpcs = [];
  }
  on(e, s) {
    i.on(e, s);
    this.listeningIpcs.push([e, s]);
  }
  once(e, s) {
    i.once(e, s);
    this.listeningIpcs.push([e, s]);
  }
  clear() {
    for (let e = 0; e < this.listeningIpcs.length; e++) {
      let s = this.listeningIpcs[e];
      i.removeListener(s[0], s[1]);
    }
    this.listeningIpcs.length = 0;
  }
};
