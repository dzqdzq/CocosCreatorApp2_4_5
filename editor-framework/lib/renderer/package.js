"use strict";
let e = {};
module.exports = e;
const o = require("./ipc");

e.reload = function (e) {
  o.sendToMain("editor:package-reload", e);
};

e.queryInfos = function (e) {
    o.sendToMain("editor:package-query-infos", e);
  };

e.queryInfo = function (e, n) {
    o.sendToMain("editor:package-query-info", e, n);
  };
