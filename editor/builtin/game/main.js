"use strict";
module.exports = {
  load() {
    Editor._previewCameraData = null;
  },
  unload() {},
  messages: {
    open() {
      Editor.Panel.open("game-window");
    },
  },
};
