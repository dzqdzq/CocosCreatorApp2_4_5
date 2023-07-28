let e;
let a;

module.exports = {
  initPreviewCamera(r) {
    if (e) {
      return r.reply && r.reply();
    }
    function n() {
      const n = Editor.require("packages://game-window/preview-camera");
      let i = new cc.Node("preview-camera-node");
      let t = i.addComponent(n);
      t.cameras = cc.Camera.cameras;
      i.parent = _Scene.view.foregroundNode;
      e = t;
      a = false;

      if (r.reply) {
        r.reply();
      }
    }

    if (!a) {
      a = true;
      a = true;

      if (cc.engine.isInitialized) {
        n();
      } else {
        cc.engine.on("scene-view-ready", n);
      }
    }
  },
  setCanvas(a) {
    if (e) {
      e.canvas = a;
    }
  },
  enabled(a, r) {
    if (e) {
      e.node.active = r;
    }
  },
  getBase64Data(a) {
    if (!e) {
      this.initPreviewCamera({});
      return a.reply(null);
    }

    if (a.reply) {
      a.reply(null, e.getBase64Data());
    }
  },
  getBinaryData(a) {
    if (!e) {
      this.initPreviewCamera({});
      return a.reply(null);
    }
    if (!a.reply) {
      return;
    }
    let r = e.getBinaryData();
    let n = !!r;
    a.reply(null, n, r);
  },
};
