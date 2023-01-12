let o = require("fire-fs"),
  r = require("fire-path");
module.exports = {
  platforms: {},
  load() {
    this.loadPlatforms();
  },
  loadPlatforms() {
    let a = r.join(__dirname, "platform");
    o.readdirSync(a).forEach((o) => {
      r.join(a, o);
      let e = r.join(a, o, "main.js");
      try {
        let r = require(e);
        this.platforms[r.platform] = r;
      } catch (r) {
        Editor.error(`Load ${o} (main.js) failed`);
      }
    });
  },
  unload() {
    this.platforms = {};
  },
  messages: {
    open() {
      Editor.Panel.open("channel-upload-tools");
    },
  },
};
