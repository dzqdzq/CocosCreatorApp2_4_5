"use strict";
let e = require("./scene-undo-impl");
require("../utils/prefab");
const t = require("../utils/node");
const o = require("../utils/animation");
class n extends Editor.Undo.Command {
  static get type() {
    return "record-objects";
  }
  undo() {
    let t = [];
    for (let o = this.info.before.length - 1; o >= 0; --o) {
      let n = this.info.before[o];
      let i = cc.engine.getInstanceById(n.id);
      try {
        e.restoreObject(i, n.data);
        let o = null;

        if (cc.Node.isNode(i)) {
          o = i;
        } else {
          if (i instanceof cc.Component) {
            o = i.node;
          }
        }

        if (o && -1 === t.indexOf(o.uuid)) {
          t.push(o.uuid);
        }

        Editor.Selection.select("node", t);
      } catch (e) {
        Editor.error(`Failed to restore object ${i._name}: ${e}`);
      }
    }
  }
  redo() {
    let t = [];
    for (let o = 0; o < this.info.after.length; ++o) {
      let n = this.info.after[o];
      let i = cc.engine.getInstanceById(n.id);
      try {
        e.restoreObject(i, n.data);
        let o = null;

        if (cc.Node.isNode(i)) {
          o = i;
        } else {
          if (i instanceof cc.Component) {
            o = i.node;
          }
        }

        if (o && -1 === t.indexOf(o.uuid)) {
          t.push(o.uuid);
        }

        Editor.Selection.select("node", t);
      } catch (e) {
        Editor.error(`Failed to restore object ${i._name}: ${e}`);
      }
    }
  }
}
class i extends Editor.Undo.Command {
  static get type() {
    return "record-nodes";
  }
  undo() {
    let t = [];
    for (let o = this.info.before.length - 1; o >= 0; --o) {
      let n = this.info.before[o];
      let i = cc.engine.getInstanceById(n.id);
      try {
        e.restoreNode(i, n.data);

        if (i && -1 === t.indexOf(i.uuid)) {
          t.push(i.uuid);
        }

        Editor.Selection.select("node", t);
      } catch (e) {
        Editor.error(`Failed to restore object ${i._name}: ${e}`);
      }
    }
    o.recordNodeChanged(t);
  }
  redo() {
    let t = [];
    for (let o = 0; o < this.info.after.length; ++o) {
      let n = this.info.after[o];
      let i = cc.engine.getInstanceById(n.id);
      try {
        e.restoreNode(i, n.data);

        if (i && -1 === t.indexOf(i.uuid)) {
          t.push(i.uuid);
        }

        Editor.Selection.select("node", t);
      } catch (e) {
        Editor.error(`Failed to restore object ${i._name}: ${e}`);
      }
    }
    o.recordNodeChanged(t);
  }
}
class d extends Editor.Undo.Command {
  static get type() {
    return "create-nodes";
  }
  undo() {
    let o = [];
    for (let n = this.info.list.length - 1; n >= 0; --n) {
      let i = this.info.list[n];

      t._destroyForUndo(i.node, () => {
        i.data = e.recordDeleteNode(i.node);
      });

      o.push(i.node.uuid);
    }
    Editor.Selection.unselect("node", o);
  }
  redo() {
    let t = [];
    for (let o = 0; o < this.info.list.length; ++o) {
      let n = this.info.list[o];
      try {
        e.restoreDeleteNode(n.node, n.data);
        t.push(n.node.uuid);
      } catch (e) {
        Editor.error(`Failed to restore delete node ${n.node._name}: ${e}`);
      }
    }
    Editor.Selection.select("node", t);
  }
}
class r extends Editor.Undo.Command {
  static get type() {
    return "delete-nodes";
  }
  undo() {
    let t = [];
    for (let o = this.info.list.length - 1; o >= 0; --o) {
      let n = this.info.list[o];
      try {
        e.restoreDeleteNode(n.node, n.data);
        t.push(n.node.uuid);
      } catch (e) {
        Editor.error(`Failed to restore delete node ${n.node._name}: ${e}`);
      }
    }
    for (let e = 0; e < this.info.list.length; ++e) {
      let t = this.info.list[e];
      t.node.setSiblingIndex(t.data.siblingIndex);
    }
    Editor.Selection.select("node", t);
  }
  redo() {
    let o = [];
    for (let n = 0; n < this.info.list.length; ++n) {
      let i = this.info.list[n];

      t._destroyForUndo(i.node, () => {
        i.data = e.recordDeleteNode(i.node);
      });

      o.push(i.node.uuid);
    }
    Editor.Selection.unselect("node", o);
  }
}
class s extends Editor.Undo.Command {
  static get type() {
    return "move-nodes";
  }
  static moveNode(e, t, o) {
    if (e.parent !== t) {
      let o = e.getWorldPosition(cc.v3());
      let n = e.getWorldRotation(cc.quat());
      let i = e.getWorldScale(cc.v3());
      e.parent = t;
      e.setWorldPosition(o);
      e.setWorldRotation(n);
      e.setWorldScale(i);
    }
    e.setSiblingIndex(o);
  }
  undo() {
    let e = [];
    for (let t = this.info.before.length - 1; t >= 0; --t) {
      let o = this.info.before[t];
      s.moveNode(o.node, o.parent, o.siblingIndex);
      e.push(o.node.uuid);
    }
    Editor.Selection.select("node", e);
  }
  redo() {
    let e = [];
    for (let t = 0; t < this.info.after.length; ++t) {
      let o = this.info.after[t];
      s.moveNode(o.node, o.parent, o.siblingIndex);
      e.push(o.node.uuid);
    }
    Editor.Selection.select("node", e);
  }
}
class c extends Editor.Undo.Command {
  static get type() {
    return "add-component";
  }
  undo() {
    let n = cc.engine.getInstanceById(this.info.id);

    if (n) {
      t._destroyForUndo(this.info.comp, () => {
          this.info.data = e.recordObject(this.info.comp);
        });

      Editor.Selection.select("node", n.uuid);
      o.onRemoveComponent(n, this.info.comp);
    }
  }
  redo() {
    let t = cc.engine.getInstanceById(this.info.id);
    if (t) {
      try {
        e.restoreObject(this.info.comp, this.info.data);
        e.renewObject(this.info.comp);
        t._addComponentAt(this.info.comp, this.info.index);
      } catch (e) {
        Editor.error(
          `Failed to restore component at node ${this.info.node.name}: ${e}`
        );
      }
      Editor.Selection.select("node", t.uuid);
      o.onAddComponent(t, this.info.comp);
    }
  }
}
class l extends Editor.Undo.Command {
  static get type() {
    return "remove-component";
  }
  undo() {
    let t = cc.engine.getInstanceById(this.info.id);
    if (t) {
      try {
        e.restoreObject(this.info.comp, this.info.data);
        e.renewObject(this.info.comp);
        t._addComponentAt(this.info.comp, this.info.index);
      } catch (e) {
        Editor.error(
          `Failed to restore component at node ${this.info.node.name}: ${e}`
        );
      }
      Editor.Selection.select("node", t.uuid);
      o.onAddComponent(t, this.info.comp);
    }
  }
  redo() {
    let n = cc.engine.getInstanceById(this.info.id);

    if (n) {
      t._destroyForUndo(this.info.comp, () => {
          this.info.data = e.recordObject(this.info.comp);
        });

      Editor.Selection.select("node", n.uuid);
      o.onRemoveComponent(n, this.info.comp);
    }
  }
}
let a = [];
let p = [];
let h = [];
let u = [];
let f = [];
let m = Editor.Undo.local();

let g = {
  _listeners: [],
  reset() {
    a = [];
    p = [];
    h = [];
    u = [];
    f = [];
  },
  init() {
    m.register(i.type, i);
    m.register(d.type, d);
    m.register(r.type, r);
    m.register(s.type, s);
    m.register(c.type, c);
    m.register(l.type, l);
    m.register(n.type, n);
    this.reset();
  },
  clear() {
    this.reset();
    m.clear();
  },
  dump() {
    let e = {};
    e._type = m._type;
    e._position = m._position;
    e._savePosition = m._savePosition;
    e._groups = [];

    m._groups.forEach((t) => {
      let o = {};
      o.desc = t.desc;
      o._commands = [];

      t._commands.forEach((e) => {
        let t = {};
        t.type = e.constructor.type;
        t.info = e.info;
        o._commands.push(t);
      });

      e._groups.push(o);
    });

    return e;
  },
  restore(e) {
    m._silent = true;
    this.clear();

    e._groups.forEach((e) => {
      e._commands.forEach((e) => {
        m.add(e.type, e.info);
      });

      m.commit();
    });

    m._type = e._type;
    m._position = e._position;
    m._savePosition = e._savePosition;
    m._silent = false;
  },
  recordObject(t, o) {
    if (o) {
      m.setCurrentDescription(o);
    }

    if ((!f.some((e) => e.id === t))) {
      let o = cc.engine.getInstanceById(t);
      try {
        let n = e.recordObject(o);
        f.push({ id: t, data: n });
      } catch (e) {
        Editor.error(`Failed to record object ${o._name}: ${e}`);
      }
    }
  },
  recordNode(t, o) {
    if (o) {
      m.setCurrentDescription(o);
    }

    if ((!a.some((e) => e.id === t))) {
      let o = cc.engine.getInstanceById(t);
      if (!o) {
        return;
      }
      try {
        let n = e.recordNode(o);
        a.push({ id: t, data: n });
      } catch (e) {
        Editor.error(`Failed to record node ${o._name}: ${e}`);
      }
    }
  },
  recordCreateNode(e, t) {
    if (t) {
      m.setCurrentDescription(t);
    }

    if ((!p.some((t) => t.node.id === e))) {
      let t = cc.engine.getInstanceById(e);
      p.push({
        node: t,
        parent: t.parent,
        siblingIndex: t.getSiblingIndex(),
      });
    }
  },
  recordDeleteNode(t, o) {
    if (o) {
      m.setCurrentDescription(o);
    }

    if ((!h.some((e) => e.node.id === t))) {
      let o = cc.engine.getInstanceById(t);
      if (!o) {
        return;
      }
      try {
        h.push({ node: o, data: e.recordDeleteNode(o) });
      } catch (e) {
        Editor.error(`Failed to record delete node ${o._name}: ${e}`);
      }
    }
  },
  recordMoveNode(e, t) {
    if (t) {
      m.setCurrentDescription(t);
    }

    if ((!u.some((t) => t.node.id === e))) {
      let t = cc.engine.getInstanceById(e);
      u.push({
        node: t,
        parent: t.parent,
        siblingIndex: t.getSiblingIndex(),
      });
    }
  },
  recordAddComponent(e, t, o, n) {
    if (n) {
      m.setCurrentDescription(n);
    }

    m.add(c.type, { id: e, comp: t, index: o });
  },
  recordRemoveComponent(t, o, n, i) {
    if (i) {
      m.setCurrentDescription(i);
    }

    m.add(l.type, { id: t, comp: o, index: n, data: e.recordObject(o) });
  },
  commit() {
    if (p.length) {
      m.add(d.type, { list: p });
      p = [];
    }

    if ((f.length)) {
      try {
        let t = f;

        let o = f.map((t) => {
          let o = cc.engine.getInstanceById(t.id);
          return { id: t.id, data: e.recordObject(o) };
        });

        m.add(n.type, { before: t, after: o });
      } catch (e) {
        Editor.error(`Failed to add record objects to undo list: ${e}`);
      }
      f = [];
    }
    if (a.length) {
      try {
        let t = a;

        let o = a.map((t) => {
          let o = cc.engine.getInstanceById(t.id);
          return { id: t.id, data: e.recordNode(o) };
        });

        m.add(i.type, { before: t, after: o });
      } catch (e) {
        Editor.error(`Failed to add record nodes to undo list: ${e}`);
      }
      a = [];
    }
    if (u.length) {
      let e = u;

      let t = u.map((e) => ({
        node: e.node,
        parent: e.node.parent,
        siblingIndex: e.node.getSiblingIndex(),
      }));

      m.add(s.type, { before: e, after: t });
      u = [];
    }

    if (h.length) {
      m.add(r.type, { list: h });
      h = [];
    }

    m.commit();
  },
  cancel() {
    p = [];
    h = [];
    u = [];
    f = [];
    m.cancel();
  },
  undo() {
    m.undo();
    cc.engine.repaintInEditMode();
  },
  redo() {
    m.redo();
    cc.engine.repaintInEditMode();
  },
  save() {
    m.save();
  },
  dirty: () => m.dirty(),
  on(e, t) {
    this._listeners.push({ type: e, listener: t });
    m.on.apply(m, arguments);
  },
  _unregisterListeners() {
    this._listeners.forEach((e) => {
      m.removeListener(e.type, e.listener);
    });
  },
  _registerListeners() {
    this._listeners.forEach((e) => {
      m.on(e.type, e.listener);
    });
  },
};

module.exports = g;
module.exports._undo = m;
