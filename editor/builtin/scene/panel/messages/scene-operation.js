"use strict";
const e = Editor.require("scene://utils/scene");
const n = Editor.require("scene://utils/animation");
function t(e, n, t) {
  try {
    let o = Array.isArray(e) ? e : e.split("^").filter(Boolean);
    for (let e = 0; e < o.length && t(o[e], n[e]); ++e)
      {}
  } catch (e) {
    console.error(e);
  }
}
function o(e, n) {
  try {
    let t = Array.isArray(e) ? e : e.split("^").filter(Boolean);
    for (let e = 0; e < t.length && n(t[e]); ++e)
      {}
  } catch (e) {
    console.error(e);
  }
}

module.exports = {
  "create-nodes-by-uuids"(n, t, o, r, c) {
    e.createNodes(t, o, r, c);
  },
  "create-node-by-classid"(n, t, o, r, c) {
    Editor.Ipc.sendToMain("metrics:track-event", {
      category: "Scene",
      action: "Node Prefab Add",
      label: "Empty",
    });

    e.createNodeByClassID(t, o, r, c);
  },
  "create-node-by-prefab"(n, t, o, r, c) {
    Editor.Ipc.sendToMain("metrics:track-event", {
      category: "Scene",
      action: "Node Prefab Add",
      label: t.replace("New ", ""),
    });

    e.createNodeByPrefab(t, o, r, c);
  },
  "new-property"(n, t) {
    e.createProperty(t.id, t.path, t.type);
  },
  "reset-property"(n, t) {
    e.resetProperty(t.id, t.path, t.type);
  },
  "set-property"(n, t) {
    if (e.setProperty(t)) {
      let e = cc.engine.getInstanceById(t.id);

      if (e) {
        setTimeout(() => {
          Editor.Ipc.sendToAll("scene:node-component-updated", {
            node: e.node ? e.node.uuid : e.id,
            component: e.node ? t.id : null,
            property: t.path || e.path,
            value: t.value,
          });
        }, 100);
      }
    }
  },
  "add-component"(t, r, c) {
    if (n.STATE.RECORD) {
      Editor.Dialog.messageBox({
        type: "warning",
        buttons: [Editor.T("MESSAGE.ok")],
        title: Editor.T("MESSAGE.warning"),
        message: Editor.T("MESSAGE.animation_editor.recording_tips"),
        detail: Editor.T("MESSAGE.animation_editor.recording_detail"),
        noLink: true,
      });

      return;
    }

    if (!r) {
      r = Editor.Selection.curActivate("node");
    }

    Editor.Ipc.sendToMain("metrics:track-event", {
      category: "Scene",
      action: "Component Add",
      label: c,
    });

    o(
      r,
      (n) =>
        !!e.checkAddComponentID(n, c) &&
        (e.addComponent(n, c),
        Editor.Ipc.sendToAll("scene:node-component-added", {
          node: n,
          component: c,
        }),
        true)
    );
  },
  "remove-component"(n, o, r) {
    t(
      o,
      r,
      (n, t) =>
        !!e.checkRemoveComponentID(n, t) &&
        (e.removeComponent(n, t),
        Editor.Ipc.sendToAll("scene:node-component-removed", {
          node: n,
          component: t,
        }),
        true)
    );
  },
  "reset-node"(e, n) {
    o(n, (e) => {
      let n = cc.engine.getInstanceById(e);
      return (!!n && (_Scene.Undo.recordNode(n.uuid, "Reset Node"), _Scene.resetNode(n), _Scene.Undo.commit(), true));
    });
  },
  "reset-all"(e, n) {
    o(n, (e) => {
      let n = cc.engine.getInstanceById(e);
      if (!n) {
        return false;
      }
      _Scene.Undo.recordNode(n.uuid, "Reset All");
      _Scene.resetNode(n);
      for (var t = 0; t < n._components.length; ++t) {
        _Scene.resetComponent(n._components[t]);
      }
      _Scene.Undo.commit();
      return true;
    });
  },
  "move-up-component"(e, o, r) {
    if (n.STATE.RECORD) {
      Editor.Dialog.messageBox({
        type: "warning",
        buttons: [Editor.T("MESSAGE.ok")],
        title: Editor.T("MESSAGE.warning"),
        message: Editor.T("MESSAGE.animation_editor.recording_tips"),
        detail: Editor.T("MESSAGE.animation_editor.recording_detail"),
        noLink: true,
      });

      return;
    }
    t(o, r, (e, n) => {
      let t = cc.engine.getInstanceById(e);
      let o = cc.engine.getInstanceById(n);
      if (!t || !o) {
        return false;
      }
      let r = t._components.indexOf(o);
      if (r <= 0) {
        return false;
      }
      let c = r - 1;
      t._components.splice(r, 1);
      t._components.splice(c, 0, o);
      return true;
    });
  },
  "move-down-component"(e, o, r) {
    if (n.STATE.RECORD) {
      Editor.Dialog.messageBox({
        type: "warning",
        buttons: [Editor.T("MESSAGE.ok")],
        title: Editor.T("MESSAGE.warning"),
        message: Editor.T("MESSAGE.animation_editor.recording_tips"),
        detail: Editor.T("MESSAGE.animation_editor.recording_detail"),
        noLink: true,
      });

      return;
    }
    t(o, r, (e, n) => {
      let t = cc.engine.getInstanceById(e);
      let o = cc.engine.getInstanceById(n);
      if (!t || !o) {
        return false;
      }
      let r = t._components.indexOf(o);
      if (r >= t._components.length) {
        return false;
      }
      let c = r + 1;
      t._components.splice(r, 1);
      t._components.splice(c, 0, o);
      return true;
    });
  },
  "reset-component"(e, n, o) {
    t(n, o, (e, n) => {
      let t = cc.engine.getInstanceById(n);
      return (!!t && (_Scene.Undo.recordNode(e, "Reset Component"), _Scene.resetComponent(t), _Scene.Undo.commit(), true));
    });
  },
  "copy-component"(n, t) {
    e.copyComponent(t);
  },
  "paste-component"(n, t, r) {
    o(t, (n) => (e.pasteComponent(n, r), true));
  },
  "move-nodes"(n, t, o, r) {
    e.moveNodes(t, o, r);
  },
  "delete-nodes"(n, t) {
    e.deleteNodes(t);
  },
  "copy-nodes"(n, t) {
    e.copyNodes(t);
  },
  "paste-nodes"(n, t) {
    e.pasteNodes(t);
  },
  "duplicate-nodes"(n, t) {
    e.duplicateNodes(t);
  },
  "create-prefab"(e, n, t) {
    _Scene.createPrefab(n, t);
  },
  "apply-prefab"(e, n, t) {
    _Scene.applyPrefab(n, t);
  },
  "revert-prefab"(e, n, t) {
    _Scene.revertPrefab(n, t);
  },
  "set-prefab-sync"(e, n) {
    _Scene.setPrefabSync(n);
  },
  "break-prefab-instance"() {
    let e = Editor.Selection.curSelection("node");
    _Scene.breakPrefabInstance(e);
  },
  "link-prefab"() {
    _Scene.linkPrefab();
  },
  "regenerate-polygon-points"(e, n) {
    var t = cc.engine.getInstanceById(n);

    if (t && t.resetPointsByContour) {
      t.resetPointsByContour();
    }
  },
  "search-skeleton-animation-clips"(e, n) {
    var t = cc.engine.getInstanceById(n);

    if (t && t.searchClips) {
      t.searchClips();
    }
  },
  "change-node-lock"(e, n, t) {
    let o = cc.engine.getInstanceById(n);

    if (o instanceof cc.Node) {
      if (void 0 === t) {
        t = !(o._objFlags & cc.Object.Flags.LockedInEditor);
      }

      _Scene.Undo.recordNode(o.uuid);

      o._objFlags = t
          ? o._objFlags | cc.Object.Flags.LockedInEditor
          : o._objFlags & ~cc.Object.Flags.LockedInEditor;

      _Scene.Undo.commit();
    }
  },
  "copy-editor-camera-data-to-nodes"() {
    _Scene.view.copyEditorCameraDataToNodes();
  },
  "set-group-sync"(e, n, t) {
    _Scene.setGroupSync(n, t);
  },
  generate_attached_node(e, n) {
    var t = cc.engine.getInstanceById(n);

    if (t && t.attachUtil) {
      t.attachUtil.generateAllAttachedNodes();
    }
  },
};
