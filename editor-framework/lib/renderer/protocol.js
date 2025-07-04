"use strict";
let t = {};
module.exports = t;
const r = require("fire-path");
const e = require("fire-url");
let o;
let i;
let n;
let p = ["http:", "https:", "ftp:", "ssh:", "file:"];
let u = {};
function l(t) {
  return (e) =>
    e.pathname ? r.join(t, e.host, e.pathname) : r.join(t, e.host);
}

t.init = function (t) {
  o = t.appPath;
  i = t.frameworkPath;
  n = t.remote;
  t.Protocol.register("editor-framework", l(i));
  t.Protocol.register("app", l(o));
};

t.url = function (t) {
    let r = e.parse(t);
    if (!r.protocol) {
      return t;
    }
    if (-1 !== p.indexOf(r.protocol)) {
      return t;
    }
    let o = u[r.protocol];
    return o ? o(r) : n.url(t);
  };

t.register = function (t, r) {
    u[t + ":"] = r;
  };
