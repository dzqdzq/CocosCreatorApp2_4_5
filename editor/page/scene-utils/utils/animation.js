"use strict";
const e = require("util");
const n = require("../lib/tasks");
let t;
let i;
let a;
let o;
let r;
let c = { RECORD: false, DIRTY: false, PLAYING: false };

let d = {
  aNode: null,
  rNode: null,
  component: null,
  animation: null,
  recordDumps: null,
  undoDump: null,
  time: 0,
};

let l = function (e, n) {
  if (e._prefab && e._prefab.fileId === n) {
    return e;
  }
  for (var t = e._children, i = 0, a = t.length; i < a; i++) {
    if ((e = l(t[i], n))) {
      return e;
    }
  }
  return null;
};

let s = function (e, n) {
  if (e._id === n) {
    return e;
  }
  for (var t = e._children, i = 0, a = t.length; i < a; i++) {
    if ((e = s(t[i], n))) {
      return e;
    }
  }
  return null;
};

let m = function (e, n) {
  if (!d.animation) {
    return 0;
  }
  let t = cc.engine
    .getInstanceById(d.component)
    .getAnimationState(d.animation);
  if (!t) {
    return 0;
  }
  let i = t.clip;
  if (i && c.DIRTY) {
    let t = [
      Editor.T("MESSAGE.save"),
      Editor.T("MESSAGE.cancel"),
      Editor.T("MESSAGE.dont_save"),
    ];

    if (n) {
      t.splice(1, 1);
    }

    e = Editor.Dialog.messageBox({
        type: "warning",
        buttons: t,
        title: Editor.T("MESSAGE.animation_editor.save_confirm_title"),
        message: Editor.T("MESSAGE.animation_editor.save_confirm_message", {
          name: i.name,
        }),
        detail: Editor.T("MESSAGE.animation_editor.save_confirm_detail"),
        defaultId: 0,
        cancelId: n ? void 0 : 1,
        noLink: true,
      });

    if (n && 1 === e) {
      e = 2;
    }
  }
  return e;
};

let u = function (e) {
  let n = cc.engine
    .getInstanceById(d.component)
    .getAnimationState(d.animation);
  if (!n) {
    return e && e();
  }
  let t = n.clip;
  cc.assetManager.loadAny(t._uuid, async (n, i) => {
    if (n) {
      Editor.error(n);
      return e && e();
    }
    c.DIRTY = false;
    let a = i.serialize();

    Editor.Ipc.sendToAll("scene:animation-clip-changed", {
      uuid: t._uuid,
      data: a,
      clip: i.name,
      dirty: false,
    });

    await I({ clip: i.name, data: a, dirty: false });

    if (e) {
      e();
    }
  });
};

let p = function (e) {
  if (!d.rNode) {
    return false;
  }
  for (; e; ) {
    if (e.uuid === d.rNode) {
      return true;
    }
    e = e.parent;
  }
  return false;
};

let g = function (e) {
  if (!d.animation) {
    return;
  }
  e = e || cc.engine.getInstanceById(d.aNode);
  let n = cc.engine
    .getInstanceById(d.component)
    .getAnimationState(d.animation);
  if (!n) {
    return;
  }
  let t = n.clip;
  if (!e || !t || e.is3DNode) {
    return;
  }
  let i = _Scene.gizmosView;
  let a = "";
  if (e.uuid !== d.rNode) {
    a = e.name;
    let n = e.parent;
    for (; n.uuid !== d.rNode; ) {
      a = `${n.name}/${a}`;
      n = n.parent;
    }
    if (!n) {
      Editor.error("Can't generate child path for node.");
      return;
    }
  }

  if (!e.trajectoryGizmo) {
    e.trajectoryGizmo = new _Scene.gizmos.trajectory(i, e);
  }

  e.trajectoryGizmo.show(cc.engine.getInstanceById(d.rNode), t, a);
};

let f = function (e) {
  if ((e = e || cc.engine.getInstanceById(d.aNode)) &&
    e.trajectoryGizmo) {
    e.trajectoryGizmo.hide();
  }
};

let E = function (e) {
  c.PLAYING = false;
  _Scene.gizmosView.hidden = false;
  let n = cc.engine
    .getInstanceById(d.component)
    .getAnimationState(d.animation);

  if (n) {
    n.on("stop", E);

    Editor.Ipc.sendToAll("scene:animation-state-changed", {
      clip: e.name,
      state: "stop",
    });
  }
};

let y = function () {
  if (!d.animation || !d.component) {
    return false;
  }
  _Scene.gizmosView.hidden = false;
  let e = cc.engine
    .getInstanceById(d.component)
    .getAnimationState(d.animation);
  if (!e) {
    return false;
  }
  e.off("stop", E);
  e.getWrappedInfo(e.time);
  e.pause();
  cc.engine.setAnimatingInEditMode(false, "timeline");
  c.PLAYING = false;

  Editor.Ipc.sendToAll("scene:animation-state-changed", {
    clip: e.name,
    state: "pause",
  });
};

let I = async function (n) {
  if (!d.animation) {
    return;
  }

  if (c.PLAYING) {
    y();
  }

  let t = cc.engine.getInstanceById(d.component).getAnimationState(n.clip);
  if (!t || n.clip !== d.animation) {
    return;
  }
  try {
    let i = await e.promisify(cc.assetManager.loadAny.bind(cc.assetManager))(
      t.clip._uuid
    );
    n.dirty = Editor.serialize(i) !== n.data;
  } catch (e) {
    Editor.warn(e);
    n.dirty = true;
  }
  let i = function (e, n) {
    return (e & n) === n;
  };
  return new Promise((e, t) => {
    cc.assetManager.editorExtend.loadJson(n.data, (n, i) => {
      if (n) {
        return t(n);
      }
      e(i);
    });
  })
    .then((e) => {
    let n = d.time;

    if (n > e.duration) {
      n = e.duration;
    }

    if (t.wrapMode !== e.wrapMode) {
      t.getWrappedInfo(n);

      if (t.isPlaying && !t.isPaused) {
        if (i(e.wrapMode, cc.WrapMode.Reverse)) {
          n = Math.abs(n - e.duration);
        }
      } else {
        if (i(e.wrapMode, cc.WrapMode.Reverse) !=
              i(e.wrapMode, cc.WrapMode.Reverse)) {
          n = Math.abs(n - e.duration);
        }
      }
    } else {
      if (i(t.wrapMode, cc.WrapMode.Reverse)) {
        n = Math.abs(n - e.duration);
      }
    }
    t.setTime(n);
    return Promise.resolve(e);
  })
    .then((e) => {
    let n = cc.engine.getInstanceById(d.component);
    n._init();
    let t = null;
    for (let i in n._nameToState) {
      let a = n._nameToState[i];
      let o = a.clip;
      if (
        o === e ||
        (o && e && (o.name === e.name || o._uuid === e._uuid))
      ) {
        e._uuid = e._uuid || o._uuid;
        t = a;
        break;
      }
    }
    if (!t) {
      return cc.error(`Can't find state from clip [${e.name}]`);
    }
    let i = n._clips.indexOf(t.clip);
    n._clips[i] = e;

    if (t.name !== e.name) {
      delete n._nameToState[t.name];
      n._nameToState[e.name] = t;
      t._name = e.name;
    }

    t._clip = e;
    n._animator._reloadClip(t);
  })
    .then((e) => {
    let t = cc.engine
      .getInstanceById(d.component)
      .getAnimationState(d.animation);

    if (t) {
      t.sample();
    }

    f();
    g();
    c.DIRTY = void 0 === n.dirty || "undefined" === n.dirty || n.dirty;
    cc.engine.repaintInEditMode();
  })
    .catch((e) => {
      Editor.error(e);
    });
};

let A = function (e) {
  if (!c.DIRTY) {
    return e && e();
  }
  c.DIRTY = false;
  if (!d.animation) {
    return e && e();
  }
  let n = cc.engine
    .getInstanceById(d.component)
    .getAnimationState(d.animation);
  if (!n) {
    return e && e();
  }
  let t = n.clip;
  _Scene.Undo.save();

  Editor.assetdb.queryUrlByUuid(t._uuid, (n, i) => {
    Editor.Ipc.sendToMain("asset-db:save-exists", i, t.serialize(), e);
  });
};

o = r = function () {};

t = i =
a =
  function (e, n) {
    if (n instanceof cc.Animation) {
      Editor.Ipc.sendToAll("scene:animation-clips-changed", {
        node: e.uuid,
        component: cc.js.getClassName(n),
      });
    }
  };

const _ = [
  { type: "cc.Vec2", name: "position" },
  { type: "Float", name: "x" },
  { type: "Float", name: "y" },
  { type: "Float", name: "z" },
  { type: "cc.Vec2", name: "scale" },
  { type: "Float", name: "scaleX" },
  { type: "Float", name: "scaleY" },
  { type: "Float", name: "scaleZ" },
  { type: "Float", name: "angle" },
  { type: "cc.Quat", name: "eulerAngles" },
  { type: "Float", name: "width" },
  { type: "Float", name: "height" },
  { type: "cc.Color", name: "color" },
  { type: "Float", name: "opacity" },
  { type: "Float", name: "anchorX" },
  { type: "Float", name: "anchorY" },
  { type: "Float", name: "skewX" },
  { type: "Float", name: "skewY" },
];
let S = function (e, n, t, i) {
  if (!i.properties || !i.properties[n] || Array.isArray(e)) {
    return null;
  }
  let a;
  let o = i.properties[n];
  let r = o.type;

  if (e && e.type) {
    r = e.type;
    delete e.type;
  }

  return "animatable" in o && false === o.animatable
    ? null
    : false === o.visible || "cc.Node" === r
    ? null
    : (a = cc.js.getClassByName(t) ? t + "." + n : i.name + "." + n);
};

module.exports = {
  STATE: c,
  Cache: d,
  confirm: m,
  restoreClip: u,
  contains: p,
  activate: function (e) {
    d.aNode = e.uuid;

    if (c.RECORD && p(e)) {
      g(e);
    }
  },
  deactivate: function (e) {
    if (d.aNode && d.aNode === e.uuid) {
      d.aNode = null;
    }

    f(e);
  },
  showTrajectoryGizmo: g,
  hideTrajectoryGizmo: f,
  isPlaying: function () {
    return c.PLAYING;
  },
  setAnimationTime: function (e) {
    if (!c.RECORD || !d.animation || !d.component) {
      return false;
    }
    let n = cc.engine
      .getInstanceById(d.component)
      .getAnimationState(d.animation);
    return (!!n && (!c.PLAYING, (d.time = e), e > n.duration && (e = n.duration), (n.wrapMode & cc.WrapMode.Reverse) === cc.WrapMode.Reverse &&
      (e = n.duration - e), n.setTime(e), n.sample(), cc.engine.repaintInEditMode(), true));
  },
  getAnimationTime: function (e) {
    if (!d.animation) {
      return 0;
    }
    let n = cc.engine
      .getInstanceById(d.component)
      .getAnimationState(d.animation);
    return n ? n.getWrappedInfo(n.time).time : 0;
  },
  setAnimationSpeed: function (e) {
    if (!d.animation) {
      return false;
    }
    let n = cc.engine
      .getInstanceById(d.component)
      .getAnimationState(d.animation);
    if (n) {
      return false;
    }
    n.speed = e;
  },
  playAnimation: function () {
    if (!d.animation || !d.component) {
      return false;
    }
    _Scene.gizmosView.hidden = true;
    let e = cc.engine.getInstanceById(d.component);
    let n = e.getAnimationState(d.animation);
    if (!n) {
      return false;
    }
    let t = n.getWrappedInfo(n.time);

    if (n.isPaused && t.time >= n.duration) {
      n.setTime(0);
    }

    e.play(n.name);
    n.on("stop", E);
    cc.engine.setAnimatingInEditMode(true, "timeline");
    c.PLAYING = true;

    Editor.Ipc.sendToAll("scene:animation-state-changed", {
      clip: n.name,
      state: "play",
    });
  },
  pauseAnimation: y,
  mountClip: function (e, n) {
    let t;
    if (e) {
      let n = cc.engine.getInstanceById(e);
      t = n.getComponent(cc.Animation);
    } else {
      t = cc.engine.getInstanceById(d.component);
    }
    if (!t) {
      return false;
    }
    cc.assetManager.loadAny(n, (e, n) => {
      if (e) {
        return Editor.warn(e);
      }
      t.addClip(n);
    });
  },
  updateClip: I,
  switchClip: function (e, t) {
    if (!e) {
      return t && t(new Error("The clip's name cannot be empty."));
    }

    let i = (e, n) => {
      if (!e || !d.rNode) {
        return n && n();
      }
      let t = cc.engine.getInstanceById(d.component);
      let i = t.getAnimationState(e);
      if (!i) {
        return (
          n && n(new Error(`The corresponding clip cannot be found - ${e}`))
        );
      }
      d.animation = e;
      t.play(e);
      t.pause(e);
      let a = d.time;

      if (a > i.duration) {
        a = i.duration;
      }

      i.setTime(a);
      let o = i.clip;
      if (!o) {
        return n && n(new Error(`Animation switch failed - ${e}`));
      }

      Editor.assetdb.queryUrlByUuid(o._uuid, (e, n) => {
        _Scene.updateTitle(n);
        exports.title = n;
      });

      i.sample();
      g();
      Editor.Ipc.sendToAll("scene:animation-current-clip-changed", e);

      if (n) {
        n();
      }
    };

    let a = function () {
      n.push(
        {
          name: "animation-change-current-clip",
          target: this,
          run: i,
          params: [e],
        },
        t
      );
    };

    if (!d.animation) {
      return a();
    }
    let o = m(0, true);
    if (1 === o) {
      Editor.Ipc.sendToAll(
        "scene:animation-current-clip-changed",
        d.animation
      );

      return;
    }

    if (0 === o) {
      A(a);
    } else {
      u(a);
    }
  },
  save: A,
  isRecording: function (e) {
    return (!!(c.RECORD && e instanceof cc.Animation) && (Editor.Dialog.messageBox({
      type: "warning",
      buttons: [Editor.T("MESSAGE.ok")],
      title: Editor.T("MESSAGE.warning"),
      message: Editor.T("MESSAGE.animation_editor.recording_tips"),
      detail: Editor.T("MESSAGE.animation_editor.recording_detail"),
      noLink: true,
    }), true));
  },
  isRecordCurrentClip: function (e, n) {
    if (!(c.RECORD && e instanceof cc.Animation)) {
      return false;
    }
    try {
      let t = Editor.getPropertyByPath(e, n.path);

      let i = cc.engine
        .getInstanceById(d.component)
        .getAnimationState(d.animation);

      if (!t.value) {
        return false;
      }
      if (t.value._uuid === i.clip._uuid) {
        Editor.Dialog.messageBox({
          type: "warning",
          buttons: [Editor.T("MESSAGE.ok")],
          title: Editor.T("MESSAGE.warning"),
          message: Editor.T("MESSAGE.animation_editor.cant_remove_clip", {
            name: i.name,
          }),
          detail: Editor.T("MESSAGE.animation_editor.recording_detail"),
          noLink: true,
        });

        return true;
      }
    } catch (e) {
      Editor.error(e);
    }
    return false;
  },
  verifyPrefab: function (e, n) {
    if (!c.RECORD) {
      return true;
    }
    try {
      let t = s(e, d.rNode);
      let i = cc.instantiate(n.data);
      if (l(i, t._prefab.fileId).getComponent(cc.Animation)) {
        return true;
      }
    } catch (e) {
      Editor.error(e);
    }

    Editor.Dialog.messageBox({
      type: "warning",
      buttons: [Editor.T("MESSAGE.ok")],
      title: Editor.T("MESSAGE.warning"),
      message: Editor.T("MESSAGE.animation_editor.recording_tips"),
      detail: Editor.T("MESSAGE.animation_editor.recording_detail"),
      noLink: true,
    });

    return false;
  },
  onRevertPrefab: function (e) {
    if (!c.RECORD) {
      Editor.Ipc.sendToAll("scene:revert-prefab-changed", e);
    }
  },
  onAddComponent: t,
  onRemoveComponent: i,
  onResetComponent: a,
  assetChanged: o,
  assetsMoved: r,
  recordNodeChanged: function (e, n) {
    if (!e || !e.length) {
      return;
    }
    let t = e[0];
    if (
      !(
        n instanceof cc.Component &&
        n.constructor &&
        n !== t.getComponent(n.constructor)
      )
    ) {
      if ("string" == typeof t) {
        e = e.map((e) => cc.engine.getInstanceById(e));
      }

      for (let n = 0; n < e.length; ++n) {
        let t = e[n].getComponent(cc.Animation);
        if (t) {
          Editor.Ipc.sendToAll("scene:animation-clips-changed", {
            node: e[n].uuid,
            component: cc.js.getClassName(t),
          });
          break;
        }
      }

      if (c.RECORD) {
        Editor.Ipc.sendToWins(
          "editor:record-node-changed",
          e.map((e) => ({ id: e.uuid, dump: Editor.getNodeDump(e) }))
        );
      }
    }
  },
  queryEditProperties: function (e, n) {
    let t = [];
    let i = e.value;
    let a = e.types;

    if (n) {
      t.push({ name: "active", type: "cc.Boolean" });
    }

    _.forEach((e) => {
      t.push(e);
    });

    i.__comps__.forEach((e) => {
      if ("cc.Animation" !== e.type) {
        for (let n = 0; n < t.length; ++n) {
          if (t[n].name.startsWith(e.type)) {
            return;
          }
        }
        (function (e, n) {
          let t = [];
          let i = e.type;
          if (!i) {
            Editor.warn("Type can not be null");
            return;
          }
          let a = n[i];
          let o = e.value;
          for (let e in o) {
            if ("type" === e || "__scriptAsset" === e) {
              continue;
            }
            let n = S(o, e, i, a);

            if (null !== n) {
              t.push({ type: o[e].type || null, name: n });
            }
          }
          return t;
        })(e, a).forEach((e) => {
          t.push(e);
        });
      }
    });

    return t;
  },
};
