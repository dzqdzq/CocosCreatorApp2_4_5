"use strict";
const { ipcMain: e } = require("electron");
const i = require("fire-fs");
const t = require("lodash");
const r = Editor.Profile.load("global://settings.json");
function o() {
  const e = Editor.Profile.load("project://project.json");
  const i = Editor.require("unpack://engine/gulp/tasks/engine");
  let r = e.get("excluded-modules");
  t.pullAll(r, ["TypeScript Polyfill"]);
  let o = [];

  if (i && i.excludeAllDepends) {
    o = i.excludeAllDepends(r);
  }

  return o;
}

module.exports = new (class {
  async build() {
    let e = Editor.require("app://editor/share/quick-compile/compile-engine");
    if (Editor.require(
      "app://editor/share/quick-compile/check-auto-build-engine"
    )()) {
      Editor.log(Editor.T("EDITOR_MAIN.building_engine"));

      this.engineCompiler = await e({
          enableWatch: r.get("watch-js-engine"),
          enginePath: Editor.url("unpack://engine"),
          moduleExcludes: o(),
        });
    } else {
      let t = Editor.url("unpack://engine-dev");

      if (!i.existsSync(t)) {
        Editor.warn(`Can not find ${t}, force auto build engine.`);
        await e({ enginePath: Editor.url("unpack://engine") });
      }
    }
  }
  async revertEngineDialog(e, i, t) {
    Editor.Dialog.messageBox({
      type: "error",
      title: i || "",
      buttons: [Editor.T("MESSAGE.ok")],
      message: t || Editor.T("EDITOR_MAIN.custom_engine_failed"),
      detail: `Error call stack: ${e.stack}`,
      noLink: true,
    });
    let r = Editor.Profile.load("local://settings.json");

    if (false !== r.get("use-global-engine-setting")) {
      r = Editor.Profile.load("global://settings.json");
    }

    r.set("use-default-js-engine", true);
    r.save();
  }
  async init() {
    Editor.log("Initializing Cocos2d");
    let e = Editor.Profile.load("local://settings.json");

    if (false !== e.get("use-global-engine-setting")) {
      e = Editor.Profile.load("global://settings.json");
    }

    let i = e.get("use-default-js-engine");
    if (!i) {
      try {
        require(Editor.url("unpack://engine-dev"));
      } catch (e) {
        this.revertEngineDialog(e);
        i = true;
      }
    }
    if (i) {
      try {
        require(Editor.url("unpack://engine-dev"));
      } catch (e) {
        throw (
          (Editor.Dialog.messageBox({
            type: "error",
            buttons: [Editor.T("MESSAGE.ok")],
            message: Editor.T("EDITOR_MAIN.builtin_engine_failed"),
            detail: e.stack,
            noLink: true,
          }),
          new Error(Editor.T("EDITOR_MAIN.builtin_engine_failed")))
        );
      }
    }
  }
  async initExtends() {
    Editor.log("Initializing engine extends");
    require("../../share/engine-extends/init");
    require("../../share/engine-extends/serialize");
  }
  initSceneList() {
    Editor.assetdb.queryAssets(null, "scene", function (e, i) {
      Editor.sceneList = i.map((e) => e.uuid);
    });
    let e = Editor._projectLocalProfile.get("last-edit");

    if (!Editor.assetdb.existsByUuid(e)) {
      e = Editor._projectProfile.get("start-scene");

      if (!Editor.assetdb.existsByUuid(e)) {
        e = null;
      }

      Editor._projectLocalProfile.set("last-edit", e);
      Editor._projectLocalProfile.save();
    }

    Editor.currentSceneUuid = e;
  }
})();

e.on("app:rebuild-editor-engine", (e) => {
  if (module.exports.engineCompiler) {
    module.exports.engineCompiler.rebuild().then(() => {
          e.reply();
        });
  } else {
    e.reply();
  }
});

e.on("editor:project-profile-updated", async () => {
  let e = module.exports.engineCompiler;
  if (e) {
    let i = o();

    if (!t.isEqual(i.sort(), e.excludes.sort())) {
      Editor.log("Engine modules have been changed. Recompiling...");
      e.modulePlugin.excludes = i;
      await e.rebuild();
      Editor.log("...Complete.");
    }
  }
});

e.on("migrate-project", (e, t) => {
  const r = require("semver");
  const o = require("path");
  const n = o.join(Editor.Project.path, "assets");
  function s(e) {
    try {
      const t = Editor.url(`unpack://static/migration/${e}`);
      const r = o.join(n, `migration/${e}`);
      i.copySync(t, r);
    } catch (e) {
      console.error(e);
    }
  }

  if (!t) {
    t = (function () {
        const e = require("globby");
        let t;
        try {
          let r = e.sync(`${n}/**/*.@(png|jpg).meta`, {
            nodir: true,
            caseSensitiveMatch: false,
            absolute: true,
          });
          if (!(r.length > 0)) {
            console.warn(
              "can not guess last project version, no texture meta found"
            );

            return;
          }
          t = i.readJsonSync(r[0]);
        } catch (e) {
          console.error(e);
          return;
        }
        return t && t.ver
          ? r.satisfies(t.ver, "< 2.3.0", { includePrerelease: true })
            ? (console.log(
                "last project version must < 2.1.0 since texture meta version < 2.3.0"
              ),
              "2.0.10")
            : (console.log(
                "last project version must >= 2.1.0 since texture meta version >= 2.3.0"
              ),
              "2.1.0")
          : (console.error(
              "can not guess last project version, texture meta version is invalid"
            ),
            void 0);
      })();
  }

  if (t && "2.0.10" !== t) {
    if (r.satisfies(t, ">= 2.1.0 < 2.1.2", { includePrerelease: true })) {
      s("use_reversed_rotateTo.js");
      s("use_reversed_rotateBy.js");
    }

    if (r.satisfies(t, ">= 2.2.1 <= 2.2.2", { includePrerelease: true })) {
      s("use_reversed_rotateTo.js");
    }

    if (r.satisfies(t, ">= 2.3.0 < 2.3.3", { includePrerelease: true })) {
      s("use_reversed_rotateBy.js");
    }

    if (r.satisfies(t, ">= 2.1.0 < 2.2.2", { includePrerelease: true })) {
      s("use_v2.1-2.2.1_cc.Toggle_event.js");
    }
  } else {
    s("use_v2.0.x_cc.Toggle_event.js");
  }
});
