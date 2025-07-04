"use strict";
let e = {};
module.exports = e;
const o = require("util");
const n = require("./ipc");
function r(e) {
  return e ? (e.toString ? e.toString() : "Object") : "" + e;
}

e.trace = function (e, t, ...l) {
  t = l.length ? o.format.apply(o, [t, ...l]) : r(t);
  console.trace(t);
  let i = new Error("dummy").stack.split("\n");
  i.shift();
  i[0] = t;
  t = i.join("\n");
  n.sendToMain("editor:renderer-console-trace", e, t);
};

e.log = function (e, ...t) {
  e = t.length ? o.format.apply(o, arguments) : r(e);
  console.log(e);
  n.sendToMain("editor:renderer-console-log", e);
};

e.success = function (e, ...t) {
  e = t.length ? o.format.apply(o, arguments) : r(e);
  console.log("%c" + e, "color: green");
  n.sendToMain("editor:renderer-console-success", e);
};

e.failed = function (e, ...t) {
  e = t.length ? o.format.apply(o, arguments) : r(e);
  console.log("%c" + e, "color: red");
  n.sendToMain("editor:renderer-console-failed", e);
};

e.info = function (e, ...t) {
  e = t.length ? o.format.apply(o, arguments) : r(e);
  console.info(e);
  n.sendToMain("editor:renderer-console-info", e);
};

e.warn = function (e, ...t) {
  e = t.length ? o.format.apply(o, arguments) : r(e);
  console.warn(e);
  n.sendToMain("editor:renderer-console-warn", e);
};

e.error = function (e, ...t) {
  e = t.length ? o.format.apply(o, arguments) : r(e);
  console.error(e);
  let l = new Error("dummy").stack.split("\n");
  l.shift();
  l[0] = e;
  e = l.join("\n");
  n.sendToMain("editor:renderer-console-error", e);
};
