const e = require("../utils/node");
const r = require("./sandbox");
var n = {
  dump() {
    var n = _Scene.getEditingWorkspace();
    var o = cc.director.getScene();

    o.children.forEach((r) => {
      if (!r._persistNode) {
        e._destroyForUndo(r, () => {
          _Scene.Undo.recordDeleteNode(r.uuid);
        });
      }
    });

    _Scene.Undo.commit();
    _Scene.reset();
    return {
      workspace: n,
      dataId: r.registerReloadableData({
        scene: o,
        undo: _Scene.Undo.dump(),
      }),
    };
  },
  restore(e) {
    _Scene.reset();
    var n = r.popReloadableData(e.dataId);
    if (n) {
      _Scene._UndoImpl.renewObject(n.scene);
      cc.director.runSceneImmediate(n.scene);
      cc.director.getScene()._restoreProperties();
      _Scene.Undo.restore(n.undo);
      _Scene.Undo.undo();
    } else {
      Editor.warn("Failed when restoring stashed scene, can not find data.");
    }
    _Scene.loadWorkspace(e.workspace);
  },
};
module.exports = n;
