"use strict";
let e = 0;
module.exports = {
  load() {},
  unload() {},
  messages: {
    open(l, t) {
      if (t && t.tab) {
        e = t.tab;
      }

      Editor.Panel.open("preferences");
    },
    close() {
      Editor.Panel.close("preferences");
    },
    "query-tab"(l) {
      l.reply(null, e);
    },
    "update-tab"(l, t) {
      e = t;
    },
  },
};
