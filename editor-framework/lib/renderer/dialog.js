"use strict";
const e = require("electron").ipcRenderer;
let l = {
  openFile: (...l) => e.sendSync.apply(e, ["dialog:open-file", ...l]),
  saveFile: (...l) => e.sendSync.apply(e, ["dialog:save-file", ...l]),
  messageBox: (...l) => e.sendSync.apply(e, ["dialog:message-box", ...l]),
};
module.exports = l;
