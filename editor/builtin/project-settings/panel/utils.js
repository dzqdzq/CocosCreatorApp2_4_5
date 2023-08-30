"use strict";
const e = require("fire-fs");
const { dirname: t, join: o } = require("path");
const i = Editor.require("app://share/engine-utils");
let r = null;
exports.profiles = { project: null, global: null, local: null };

exports.init = function () {
  exports.profiles.project = Editor.Profile.load("project://project.json");
  exports.profiles.global = Editor.Profile.load("global://settings.json");
  exports.profiles.local = Editor.Profile.load("local://settings.json");

  (function () {
    let e = exports.profiles.global;
    let t = e.get("use-default-cpp-engine");
    r = i.getSimulatorConfigAt(!t && e.get("cpp-engine-path"));
  })();
};

exports.queryGroupList = function () {
  let e = [];
  let t = exports.profiles.project.get("group-list");
  return t
    ? (t.forEach((t) => {
        e.push(t);
      }),
      exports.profiles.project.set("group-list", t),
      e)
    : e;
};

exports.queryCollision = function () {
    let e = exports.profiles.project.get("collision-matrix") || [];
    return JSON.parse(JSON.stringify(e));
  };

exports.queryExcluded = function () {
    let e = exports.profiles.project.get("excluded-modules") || [];
    return JSON.parse(JSON.stringify(e));
  };

exports.queryPreview = function () {
    return {
      scene: exports.profiles.project.get("start-scene") || "current",
      port: exports.profiles.project.get("preview-port"),
      resolutionWidth: exports.profiles.project.get("design-resolution-width"),
      resolutionHeight: exports.profiles.project.get(
        "design-resolution-height"
      ),
      fitWidth: exports.profiles.project.get("fit-width"),
      fitHeight: exports.profiles.project.get("fit-height"),
    };
  };

exports.querySimulator = function () {
  if (!r) {
    return null;
  }
  let e;
  let t = exports.profiles.project;
  let o = t.get("use-project-simulator-setting");
  let i = t.get("simulator-orientation") || r.isLandscape;
  let s = t.get("simulator-resolution") || {};
  let n = t.get("use-customize-simulator");
  let l = t.get("clear-simulator-cache");

  let p = r.simulator_screen_size.map((e, t) => ({
    index: t,
    width: e.width,
    height: e.height,
    title: e.title,
  }));

  p.push({
    index: p.length,
    title: Editor.T("PREFERENCES.sim_res_custom"),
    custom: true,
    width: s.width,
    height: s.height,
  });

  if (n) {
    e = p.length - 1;
  } else {
    if (!p.some((t, o) => {
          if (t.width === s.width && t.height === s.height) {
            e = o;
            return true;
          }
        })) {
      n = true;
      e = p.length - 1;
    }
  }

  return {
    type: o ? "project" : "global",
    direction: i ? "horizontal" : "vertical",
    resolution: e,
    resolutionList: p,
    width: s.width,
    height: s.height,
    clearSimulatorCache: "boolean" != typeof l || l,
  };
};

exports.queryEngine = function () {
  let e = exports.profiles.local;

  let t = function (t, o) {
    return void 0 === e.get(t) ? o : e.get(t);
  };

  return {
    useGlobalSetting: t("use-global-engine-setting", true),
    useDefaultJsEngine: t("use-default-js-engine", true),
    jsEnginePath: e.get("js-engine-path") || "",
    useDefaultCppEngine: t("use-default-cpp-engine", true),
    cppEnginePath: e.get("cpp-engine-path") || "",
  };
};

exports.queryFacebook = function () {
  let e = exports.profiles.project;
  let t = e.get("facebook");

  if (!t) {
    t = e.set("facebook", {});
  }

  return { enable: t.enable, appID: t.appID, live: t.live, audience: t.audience };
};

exports.setGroupList = function (e) {
  let t = exports.profiles.project;
  let o = t.get("group-list");
  for (o || ((o = []), t.set("group-list", o)); o.length > e.length; ) {
    o.pop();
  }

  e.forEach((e, t) => {
    o[t] = e;
  });

  t.set("group-list", o);
};

exports.setCollision = function (e) {
    exports.profiles.project.set(
      "collision-matrix",
      JSON.parse(JSON.stringify(e))
    );
  };

exports.setExcluded = function (e) {
    exports.profiles.project.set(
      "excluded-modules",
      JSON.parse(JSON.stringify(e))
    );
  };

exports.setPreview = function (e) {
  let t = exports.profiles.project;

  if ("current" !== e.scene) {
    t.set("start-scene", e.scene);
  } else {
    t.remove("start-scene");
  }

  t.set("preview-port", parseInt(e.port));

  Editor.Ipc.sendToMain(
    "preview-server:use-new-preview-port",
    parseInt(e.port)
  );

  t.set("design-resolution-width", e.resolutionWidth);
  t.set("design-resolution-height", e.resolutionHeight);
  t.set("fit-width", e.fitWidth);
  t.set("fit-height", e.fitHeight);
};

exports.setSimulator = function (e) {
  let t = exports.profiles.project;
  t.set("use-project-simulator-setting", !("project" != e.type));
  t.set("simulator-orientation", !("horizontal" != e.direction));

  t.set(
    "use-customize-simulator",
    !!(e.resolution >= e.resolutionList.length - 1)
  );

  t.set("simulator-resolution", { width: e.width, height: e.height });
  t.set("clear-simulator-cache", e.clearSimulatorCache);
  let o = r.init_cfg;
  if ("global" === e.type) {
    let t = exports.profiles.global;
    let i = t.get("simulator-resolution");
    let r = e.resolutionList[i];
    o.width = r.width;
    o.height = r.height;
    o.isLandscape = t.get("simulator-orientation");
  } else {
    o.width = e.width;
    o.height = e.height;
    o.isLandscape = !("horizontal" != e.direction);
  }
};

exports.setEngine = function (e) {
  let t = exports.profiles.local;
  t.set("use-global-engine-setting", e.useGlobalSetting);
  t.set("use-default-js-engine", e.useDefaultJsEngine);
  t.set("js-engine-path", e.jsEnginePath);
  t.set("use-default-cpp-engine", e.useDefaultCppEngine);
  t.set("cpp-engine-path", e.cppEnginePath);
};

exports.setFacebook = function (e) {
  let t = exports.profiles.project;
  let o = t.get("facebook");
  o.enable = e.enable;
  o.appID = e.appID || "";
  o.live = e.live || { enable: false };
  o.audience = e.audience || { enable: false };
  t.set("facebook", o);
};

exports.save = function () {
  let o = exports.profiles.local;

  if (o.get("use-global-engine-setting")) {
    o = exports.profiles.global;
  }

  let s = i.getSimulatorConfigPath(
    o.get("use-default-cpp-engine") ? void 0 : o.get("cpp-engine-path")
  );

  if (e.existsSync(t(s))) {
    e.writeJsonSync(s, r, "utf-8");
  } else {
    Editor.warn(
          "Sorry, save failed. Cannot find simulator config.json under " + s
        );
  }

  exports.profiles.project.save();
  exports.profiles.local.save();
  Editor.Ipc.sendToAll("editor:project-profile-updated");
};
