"use strict";
const { ipcMain: e, ipcRenderer: n } = require("electron");
const t = {};

exports.contexts = function (e) {
  return "renderer" === process.type
    ? n.sendSync("_cloud_function_", "contexts", e)
    : [t[e]];
};

exports.setContext = function (e, c) {
    return "renderer" === process.type
      ? n.sendSync("_cloud_function_", "setContext", e, c)
      : (t[e] = c);
  };

exports.hover = function (e) {};
const c = {};

exports.select = function (e, r) {
  return "renderer" === process.type
    ? n.sendSync("_cloud_function_", "select", e, r)
    : (Array.isArray(r) || (r = [r]),
      c[e] &&
        Editor.Ipc.sendToWins(
          "cloud-function:unselected",
          "cloud-function",
          c[e],
          r
        ),
      (c[e] = r),
      Editor.Ipc.sendToWins("cloud-function:selected", "cloud-function", r),
      (t[e] = r));
};

exports.curSelection = function (e) {
    return "renderer" === process.type
      ? n.sendSync("_cloud_function_", "curSelection", e)
      : c[e] || [];
  };

exports.curActivate = function (e) {
    return "renderer" === process.type
      ? n.sendSync("_cloud_function_", "contexts", e)
      : [t[e]];
  };

exports.cancel = function () {};

if ("browser" === process.type) {
  e.on(
    "_cloud_function_",
    (e, n, ...t) => (e.returnValue = exports[n](...t))
  );
}
