require("../share/engine-extends/serialize");
require("../share/engine-extends/json-packer");
require("../share/engine-extends/texture-asset-packer");

window._Scene = {
    _UndoImpl: require("../page/scene-utils/undo/scene-undo-impl"),
    PrefabUtils: require("../page/scene-utils/utils/prefab"),
  };

let e = { scene: "../page/scene-utils/" };

Editor.require = function (r) {
  let n = r.match(/(\S+)\:\/\//);
  let i = n ? n[1] : "";

  if (e[i]) {
    r = r.replace(n[0], e[i]);
  }

  return require(r);
};
