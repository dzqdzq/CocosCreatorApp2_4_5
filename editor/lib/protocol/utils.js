"use strict";
const e = require("path");

const t = {
  engine: { dev: "engine", release: "../engine" },
  "engine-dev": {
    dev: "engine/bin/.cache/dev",
    release: "../engine/bin/.cache/dev",
  },
  simulator: { dev: "simulator", release: "simulator" },
  static: { dev: "editor/static", release: "../static" },
  templates: { dev: "templates", release: "../templates" },
  utils: { dev: "utils", release: "../utils" },
  editor: { dev: "editor", release: "../app.asar.unpacked/editor" },
  node_modules: { dev: "", release: "../app.asar.unpacked/node_modules" },
};

let i = e.relative(t.engine.release, t["engine-dev"].release);

exports.unpackUrl2path = function (n) {
  let a = n.hostname;
  let s = n.pathname || "";
  let r = t[a];
  if (!r) {
    Editor.error(
      `Unrecognized unpack host '${a}'! Please validate your url.`
    );

    return null;
  }
  let o = Editor.isMainProcess ? Editor.Profile : Editor.remote.Profile;
  let l = o.load("local://settings.json");

  if (l) {
    if (false !== l.get("use-global-engine-setting")) {
      l = o.load("global://settings.json");
    }
  } else {
    l = o.load("global://settings.json");
  }

  let d = Editor.isMainProcess ? Editor.App.path : Editor.appPath;
  let g = Editor.dev ? r.dev : r.release;
  if (!g) {
    return s.replace(/^[/\\]/, "");
  }
  switch (a) {
    case "simulator":
      d = l.get("use-default-cpp-engine")
        ? (Editor.isMainProcess
            ? Editor.builtinCocosRoot
            : Editor.remote.builtinCocosRoot) || ""
        : l.get("cpp-engine-path") || "";
      break;
    case "engine-dev":
    case "engine":
      if (!l.get("use-default-js-engine") &&
        l.get("js-engine-path")) {
        d = l.get("js-engine-path");
        g = "engine-dev" === a ? i : "";
      }
  }
  return e.join(d, g, s);
};

exports.unpackMapping = t;
