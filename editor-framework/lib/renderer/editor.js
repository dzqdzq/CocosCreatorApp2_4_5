"use strict";
let e = {};
module.exports = e;
const r = require("electron");
const t = require("fire-path");
const i = require("./protocol");
const l = require("./ui");
function n(e) {
  let r = t.extname(e);
  return ".js" === r
    ? l.importScript(e)
    : ".css" === r
    ? l.importStylesheet(e)
    : ".tmpl" === r
    ? l.importTemplate(e)
    : l.importResource(e);
}

e.require = function (r) {
  return require(e.url(r));
};

e.url = i.url;

e.import = function (e) {
    if (Array.isArray(e)) {
      let r = [];
      for (let t = 0; t < e.length; ++t) {
        let i = e[t];
        r.push(n(i));
      }
      return Promise.all(r);
    }
    return n(e);
  };

const u = r.ipcRenderer;
u.on("editor:query-ipc-events", (e) => {
  let r = [];
  for (let e in u._events) {
    let t = u._events[e];
    let i = Array.isArray(t) ? t.length : 1;
    r.push({ name: e, level: "page", count: i });
  }
  e.reply(null, r);
});
