"use strict";
let e = true;
function n(e) {
  if ((function (e) {
    let n = e;
    let c = false;
    for (; null != n; ) {
      if (n._objFlags & cc.Object.Flags.HideInHierarchy) {
        c = false;
        break;
      }
      n = n.parent;
    }
    return c;
  })(e)) {
    return;
  }
  let n = cc.js.getClassName(e);
  let c = _Scene.gizmos[n];

  if (c) {
    if (e.gizmo) {
      e.gizmo.remove();
      e.gizmo = null;
    }

    e.gizmo = new c(_Scene.gizmosView, e);

    if (_Scene.gizmosView) {
      _Scene.gizmosView.checkNodeGizmoState(e);
    }

    e.gizmo.update();
  }

  cc.engine.repaintInEditMode();
}
function c(e) {
  if (e.gizmo) {
    e.gizmo.remove();
    e.gizmo.hide();
    e.gizmo = null;
  }

  if (e.trajectoryGizmo) {
    e.trajectoryGizmo.remove();
    e.trajectoryGizmo = null;
  }

  cc.engine.repaintInEditMode();
}
function o() {
  let e = Editor.Selection.curActivate("node");
  let n = e && cc.engine.getInstanceById(e);
  if (cc.isValid(n)) {
    let e = n._components;
    for (let n = 0; n < e.length; n++) {
      let c = e[n];
      if (cc.isValid(c) &&
      c.constructor._executeInEditMode &&
      c.constructor._playOnFocus &&
      c.enabledInHierarchy) {
        cc.engine.setAnimatingInEditMode(true, "component_playOnFocus");
        return;
      }
    }
  }
  cc.engine.setAnimatingInEditMode(false, "component_playOnFocus");
}
function i(e) {
  _Scene.gizmosView.onComponentEnable(e);

  if (cc.engine.getInstanceById(e).constructor._playOnFocus) {
    o();
  }

  cc.engine.repaintInEditMode();
}
function t(e) {
  _Scene.gizmosView.onComponentDisable(e);
  let n = cc.engine.getInstanceById(e);

  if (n) {
    if (n.constructor._playOnFocus) {
      o();
    }
  } else {
    o();
  }

  cc.engine.repaintInEditMode();
}
function r(n) {
  if (n.gizmo) {
    n.gizmo._dirty = n.gizmo._dirty || e;
    n.gizmo.update();
  }

  if (n.trajectoryGizmo) {
    n.trajectoryGizmo.update();
  }

  let c = n._components;
  for (let n = 0, o = c.length; n < o; n++) {
    let o = c[n];

    if (o.gizmo) {
      o.gizmo._dirty = o.gizmo._dirty || e;
      o.gizmo.update();
    }
  }
  n._children.forEach(r);
}
function d() {
  let n = cc.director.getScene();

  if (n &&
    !_Scene.isLoadingScene) {
    _Scene.gizmosView.update();
    n._children.forEach(r);
    e = false;
  }
}
function g() {
  let e = cc.engine.getDesignResolutionSize();
  _Scene.gizmosView.designSize = [e.width, e.height];
}
function a() {
  if (!cc.engine.isPlaying) {
    _Scene.gizmosView.onSceneLaunched();
    _Scene.view.onSceneLaunched();
    cc.engine.repaintInEditMode();
  }
}
function s(n) {
  e = true;
}
let m = {
  isLoaded: false,
  register() {
    if (!this.isLoaded) {
      this.isLoaded = true;
      cc.director.on(cc.Director.EVENT_AFTER_UPDATE, d);
      cc.director.on(cc.Director.EVENT_AFTER_SCENE_LAUNCH, a);
      cc.engine.on("node-attach-to-scene", n);
      cc.engine.on("node-detach-from-scene", c);
      cc.engine.on("component-enabled", i);
      cc.engine.on("component-disabled", t);
      cc.engine.on("design-resolution-changed", g);
      _Scene.Undo.on("changed", s);
    }
  },
  unregister() {
    this.isLoaded = false;
    cc.director.off(cc.Director.EVENT_AFTER_UPDATE, d);
    cc.director.off(cc.Director.EVENT_AFTER_SCENE_LAUNCH, a);
    cc.engine.off("node-attach-to-scene", n);
    cc.engine.off("node-detach-from-scene", c);
    cc.engine.off("component-enabled", i);
    cc.engine.off("component-disabled", t);
    cc.engine.off("design-resolution-changed", g);
    _Scene.Undo.off("changed", s);
  },
};
module.exports = m;
