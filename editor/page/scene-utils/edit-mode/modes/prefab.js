var e = require("fire-url");
const t = require("../../utils/prefab");
const r = require("../../utils/node");
const n = Editor.Profile.load("global://settings.json");
var a = "";
var c = "";
var i = null;
var o = "";
var s = [];
function d() {
  _Scene.StashInPage.restore(i);
  o = "";

  if (s.length > 0) {
    setTimeout(function () {
      for (var e = 0; e < s.length; e++) {
        _Scene.syncPrefab(s[e]);
      }
      s.length = 0;
    }, 400);
  }
}
var l = {
  name: "prefab",
  title: "",
  open(e, r) {
    cc.assetManager.loadAny(e, (s, l) => {
      if (s) {
        return cc.error(s);
      }
      (function () {
        var e = new cc.SceneAsset();
        e.scene = cc.director.getScene();
        e._name = e.scene.name;
        o = Editor.serialize(e, { stringify: true });
        i = _Scene.StashInPage.dump();
        _Scene.Undo.clear();
      })();
      var u;
      var f = new cc.Scene();
      try {
        u = cc.instantiate(l);

        if (n.get("auto-sync-prefab")) {
          t._setPrefabSync(u, true);
        }
      } catch (e) {
        d();
        return r(e);
      }
      c = u.uuid;
      u.parent = f;
      cc.director.runSceneImmediate(f);
      Editor.Selection.select("node", c, true, true);

      (function () {
        var e = cc.engine.getInstanceById(c);
        if (e) {
          var t = cc.director.getScene();
          t.position = cc.Vec2.ZERO;
          t.scale = 1;
          var r = e.getBoundingBoxToWorld();
          Editor.require(
            "packages://scene/panel/tools/camera"
          ).adjustToCenter(50, r);
        }
      })();

      Editor.Ipc.sendToAll("scene:prefab-mode-changed", true);
      a = e;

      Editor.assetdb.queryUrlByUuid(e, (e, t) => {
        _Scene.updateTitle(t);
        this.title = t;
        r();
      });
    });
  },
  confirmClose: function () {
    let t = 2;
    if (c && a && this.dirty()) {
      var r = cc.engine.getInstanceById(c);
      var n = r && r.name;
      if (!n) {
        var i = Editor.assetdb.remote.uuidToUrl(a);
        n = e.basename(i);
      }

      t = Editor.Dialog.messageBox({
        type: "warning",
        buttons: [
          Editor.T("MESSAGE.save"),
          Editor.T("MESSAGE.cancel"),
          Editor.T("MESSAGE.dont_save"),
        ],
        title: Editor.T("MESSAGE.prefab_editor.save_confirm_title"),
        message: Editor.T("MESSAGE.prefab_editor.save_confirm_message", {
          name: n,
        }),
        detail: Editor.T("MESSAGE.prefab_editor.save_confirm_detail"),
        defaultId: 0,
        cancelId: 1,
        noLink: true,
      });
    }
    return t;
  },
  close: function (e, t) {
    switch (e) {
      case 0:
        this.save(() => {
          this.closeWithoutSave();
          t();
        });
        break;
      case 1:
        if (t) {
          t();
        }

        break;
      case 2:
        this.closeWithoutSave();

        if (t) {
          t();
        }
    }
    Editor.Ipc.sendToAll("scene:prefab-mode-changed", false);
  },
  beforePushOther(e, t) {
    if (e === this) {
      require("../index").popAll();
    }
  },
  checkRootNodes() {
    for (
      var e = cc.director.getScene(), t = cc.engine.getInstanceById(c), n = 0;
      n < e.children.length;
      n++
    ) {
      var a = e.children[n];
      if (
        !(
          a._objFlags &
          (cc.Object.Flags.DontSave | cc.Object.Flags.HideInHierarchy)
        ) &&
        a !== t
      ) {
        var i = r.getNodePath(t);
        Editor.info(
          Editor.T("MESSAGE.prefab_editor.only_save_prefab", { node: i })
        );
        break;
      }
    }
  },
  closeWithoutSave() {
    if (!a) {
      return Editor.error("no editing prefab");
    }
    a = "";
    c = "";
    d();
  },
  save(e) {
    this.checkRootNodes();
    _Scene.Undo.save();
    _Scene.applyPrefab(c, false);

    if (e) {
      setTimeout(e, 200);
    }
  },
  getPreviewScene: () => o,
  prefabAssetChanged(e) {
    s.push(e);
  },
  dirty: () => _Scene.Undo.dirty(),
  get rootPrefabId() {
    return c;
  },
};
module.exports = l;
