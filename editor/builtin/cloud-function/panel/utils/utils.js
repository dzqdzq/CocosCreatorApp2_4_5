"use strict";
const { promisify: e } = require("util");
const n = require("fire-fs");
const r = require("fire-path");
const t = require("./event");

let i = async function (e) {
    return await new Promise((r) => {
      n.exists(e, r);
    });
  };

let s = function (e) {
  if (n.existsSync(e)) {
    for (var r of n.readdirSync(e)) {
      var t = e + "/" + r;

      if (n.statSync(t).isDirectory()) {
        s(t);
      } else {
        n.unlinkSync(t);
      }
    }
    n.rmdirSync(e);
  }
};

let o = function (e) {
  if (!n.existsSync(r.dirname(e))) {
    o(r.dirname(e));
  }

  n.mkdirSync(e);
};

let u = function (e) {
  var r = n.existsSync(e) ? n.readFileSync(e, "utf-8") : "{}";
  var t = null;
  try {
    t = JSON.parse(r);
  } catch (e) {}
  return t;
};

let c = function () {
  const e = `${Editor.Project.path}/settings/serverless.json`;
  var n = u(e);
  return n.env_id && "0" !== n.env_id ? n.env_id : "undefinedenv";
};

module.exports = {
  isSubDir: function (e, n) {
    return 0 === e.indexOf(n) && e !== n;
  },
  copy: async function (r, t) {
    if (!(await i(r))) {
      new Error(`File does not exist - ${r}`);
      return;
    }
    for (; await i(t); ) {
      t = t.replace(/( - (\d+))?(\.[^\.]+)?$/, (e, n, r, t) => {
        let i = r ? parseInt(r) : 0;
        let s = ++i + "";
        for (; s.length < 3; ) {
          s = "0" + s;
        }
        return ` - ${s}${t || ""}`;
      });
    }
    await e(n.copy)(r, t);
    return t;
  },
  isDir: async function (r) {
    return await e(n.isDir)(r);
  },
  uuid2path: async function (n) {
    let r = await e(Editor.assetdb.queryUrlByUuid)(n);
    if (!r) {
      return null;
    }
    let t = Editor.url(r);
    return decodeURI(t);
  },
  exists: i,
  isReadOnly: async function (n) {
    let r = await e(Editor.assetdb.queryInfoByUuid)(n);
    if (!r) {
      return true;
    }
    let t = await e(Editor.assetdb.queryUrlByUuid)(n);
    if (!t) {
      return true;
    }
    let i = await e(Editor.assetdb.queryAssets)(t, r.type);
    return !(!i || !i[0] || !i[0].readonly);
  },
  removeDir: s,
  mkdirs: o,
  emptyFilter: function () {
    t.emit("filter-changed", "");
    t.emit("empty-filter");
  },
  printToConsole: function (e, n) {
    Editor.Ipc.sendToMain("cloud-function:print-to-console", e, n);
  },
  readJson: u,
  saveJson: function (e, r) {
    n.writeFileSync(e, JSON.stringify(r, null, "\t"));
  },
  getCurrentEnvId: c,
  checkedCurrentEnvId: function () {
    return "undefinedenv" !== c();
  },
  checkedEnableTCB: function () {
    return new Promise((e, n) => {
      Editor.Ipc.sendToMain(
        "cocos-services:plugin-messages",
        "service:query-service-enable",
        { service_component_name: "service-tcb" },
        (r, t) => {
          if (r) {
            return n(r);
          }
          e(t);
        }
      );
    });
  },
  tr: function (e, ...n) {
    return Editor.T(`cloud-function.${e}`, ...n);
  },
};
