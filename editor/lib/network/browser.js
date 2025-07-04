"use strict";
const e = require("../../../share/@base/electron-base-ipc");
const i = require("../../../share/network");

module.exports = new (class {
  constructor() {
    this.isOnline = false;
    e.broadcast("editor-lib-network:flag-changed", "isOnline", this.isOnline);
  }
  get ip() {
    return this.ipList[0] || "127.0.0.1";
  }
  get ipList() {
    return i.queryIpList();
  }
  async update() {
    this.isOnline = await new Promise((e) => {
      i.canConnectPassport(e);
    });

    e.broadcast("editor-lib-network:flag-changed", "isOnline", this.isOnline);
    return this.isOnline;
  }
})();

e.on("editor-lib-network:query-flag", (e, i) => module.exports[i]);

e.on("editor-lib-network:call", async (e, i, t) => {
  if (!module.exports[i]) {
    e.reply(
      new Error(`The network did not find the specified interface: ${i}`),
      null
    );

    return;
  }
  try {
    let r = await module.exports[i](...t);
    e.reply(null, r);
  } catch (i) {
    e.reply(i, null);
  }
});
