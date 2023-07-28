"use strict";
const e = require("../../share/@base/electron-base-ipc");

module.exports = new (class {
  constructor() {
    this.isOnline = e.sendSync("editor-lib-network:query-flag", "isOnline");
  }
  async update() {
    await e.send("editor-lib-network:call", "update").pomise();
    return this.isOnline();
  }
})();

e.broadcast("editor-lib-network:flag-changed", (e, s, t) => {
  module.exports[s] = t;
});
