"use strict";
const e = require("./scene-undo");
const r = require("./scene-query");
const t = require("./scene-operation");
const i = require("./scene-animation");
const o = require("./scene-layout");
const n = Editor.require("scene://edit-mode");
const a = Editor.require("scene://utils/particle");
let c = {
  "is-ready"(e) {
    e.reply(null, this._viewReady);
  },
  "new-scene"() {
    this.confirmCloseScene(() => {
      this._newScene();
    });
  },
  saved() {
    _Scene.Undo.save();
  },
  "play-on-device"() {
    _Scene.stashScene(() => {
      Editor.Ipc.sendToMain("app:play-on-device");
    });
  },
  "reload-on-device"() {
    _Scene.stashScene(() => {
      Editor.Ipc.sendToMain("app:reload-on-device");
    });
  },
  "preview-server-scene-stashed"() {
    _Scene.stashScene(() => {
      Editor.Ipc.sendToMain("app:preview-server-scene-stashed");
    });
  },
  "load-package-scene-script"(e, r, t) {
    this._loadSceneScript(r, t);
  },
  "unload-package-scene-script"(e, r) {
    this._unloadSceneScript(r);
  },
  "soft-reload"(e, r) {
    if (_Scene._inited) {
      n.softReload(r);
    }
  },
  "enter-prefab-edit-mode"(e, r) {
    cc.assetManager.loadAny(r, (e, t) =>
      e
        ? (Editor.error(e), void 0)
        : t.readonly
        ? (Editor.warn("The prefab is readonly, can not be modified."), void 0)
        : (n.push("prefab", r), void 0)
    );
  },
  "stash-and-save"() {
    n.save();
  },
  "print-simulator-log"(e, r, t) {
    let i = "Simulator: ";
    if (-1 !== r.indexOf("project.dev.js:")) {
      let e = r.split(":");
      let t = Path.join(Editor.remote.Project.path, "library/bundle.project.js");
      let n = Number.parseInt(e[1]);
      let a = r.substring(r.indexOf(":" + e[2]) + 1, r.length);
      var o = new Error(a);
      o.stack = `${i}${a}\n    at a (${t}?009:${n}:0)`;
      Editor.error(o);
      return;
    }

    if ("error" === t) {
      Editor.error(i + r);
    } else {
      if ("warn" === t) {
        Editor.warn(i + r);
      } else {
        Editor.log(i + r);
      }
    }
  },
  "generate-texture-packer-preview-files": async function (e, r) {
    const t = Editor.require("app://editor/page/build/texture-packer");
    try {
      await t.generatePreviewFiles(r);
    } catch (r) {
      Editor.error(r);

      if (e.reply) {
        e.reply(r);
      }

      return;
    }

    if (e.reply) {
      e.reply();
    }
  },
  "query-texture-packer-preview-files": function (e, r) {
    Editor.require("app://editor/page/build/texture-packer").queryPreviewInfo(
      r,
      (r, t) => {
        if (e.reply) {
          e.reply(r, t);
        } else {
          if (r) {
            Editor.error(r);
          }
        }
      }
    );
  },
  "export-particle-plist": function (e, r) {
    a.exportParticlePlist(r);
  },
  "update-edit-mode": function (e, r) {
    _Scene.updateTitle(r.title);
    _Scene.view._vm.mode = r.name;
  },
};

Object.keys(e).forEach((r) => {
  c[r] = e[r];
});

Object.keys(r).forEach((e) => {
  c[e] = r[e];
});

Object.keys(t).forEach((e) => {
  c[e] = t[e];
});

Object.keys(i).forEach((e) => {
  c[e] = i[e];
});

Object.keys(o).forEach((e) => {
  c[e] = o[e];
});

module.exports = c;
