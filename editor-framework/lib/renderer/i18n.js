"use strict";
const e = require("electron");
let r = require("../share/i18n");

r.updatePhrases = function () {
  let t = e.ipcRenderer.sendSync("editor:get-i18n-phrases");
  r.polyglot.extend(t);
};

r.updatePhrases();
module.exports = r;
