(() => {
  "use strict";
  const e = require("lodash");
  window.Vue = Editor.require("app://node_modules/vue/dist/vue");
  window.sinon = require("sinon");
  Editor.require("app://editor/page/editor-init");

  if (window.tap) {
    Editor.require("app://engine-dev");
  } else {
    Editor.require("unpack://engine-dev");
  }

  Editor.require("app://editor/page/engine-extends");

  window._Scene = {
      DetectConflict: { afterAddChild() {}, beforeAddComponent: () => true },
    };

  Editor.require("app://editor/page/scene-utils/engine-extends");
  Editor.require("app://editor/page/scene-utils/undo/scene-undo-impl");
  Editor.require("app://editor/page/scene-utils/dump");
  Editor.require("app://editor/page/scene-utils/set-property-by-path");
  Editor.require("app://editor/page/scene-utils/lib/detect-conflict");
  Editor.require("app://editor/page/scene-utils/edit-mode");
  Editor.require("app://editor/page/scene-utils/utils/node");
  Editor.require("app://editor/page/asset-db");
  window.Helper = e.assign(window.Helper, require("./helper"));
})();
