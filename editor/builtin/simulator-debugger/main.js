"use strict";
require("electron").BrowserWindow;
module.exports = {
  load() {},
  unload() {},
  messages: {
    open() {
      Editor.Panel.open("simulator-debugger");
    },
  },
};
