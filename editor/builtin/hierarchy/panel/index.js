"use strict";
const e = require("fire-fs");
const t = (require("fire-path"), Editor.require("packages://hierarchy/panel/utils/event"));
const r = Editor.require("packages://hierarchy/panel/utils/cache");
const o = Editor.require("packages://hierarchy/panel/utils/operation");
const n = Editor.require("packages://hierarchy/panel/manager");
Editor.require("packages://hierarchy/panel/utils/communication");
function i(e) {
  let t = Editor.Selection.curSelection("node");
  Editor.Ipc.sendToWins("scene:center-nodes", t);
  l(t, e);
}
function l(e, t) {
  let n = e[e.length - 1];
  if (!n) {
    return;
  }
  let i = r.queryNode(n);

  if (i) {
    if (!i.isSearch) {
      o.foldAllParentNodeState(i, false);
    }

    requestAnimationFrame(() => {
      let e = 20 * i.showIndex;
      let r = t.clientHeight;
      let o = t.scrollTop;

      if (e > o + r - 20) {
        t.scrollTop = e - r + 20;
      } else {
        if (e < o) {
          t.scrollTop = e;
        }
      }
    });
  }
}

let s = function (e) {
  let t = r.querySearchNodes();

  if (0 === t.length) {
    t = r.queryNodes();
  }

  t = t.filter((e) => e && e.show);
  let o = Editor.Selection.curSelection("node");
  let n = o[o.length - 1];
  let i = o.indexOf(n);
  let l = t.findIndex((e) => e.id === n);
  let s = t[l + ("down" === e ? 1 : -1)];
  if (!s) {
    return;
  }
  let d = t[l];

  if (s.selected) {
    d.selected = !d.selected;
    o.splice(i, 1);
  } else {
    s.selected = !s.selected;

    if (s.selected) {
      o.push(s.id);
    } else {
      o.forEach((e, t) => {
        if (e === s.id) {
          o.splice(t, 1);
        }
      });
    }
  }

  Editor.Selection.select("node", o, true, true);
};

let d = -1;
Editor.Panel.extend({
  listeners: {
    "panel-resize"() {
      this._vm.length = (this.clientHeight - 56) / 20 + 3;
      t.emit("refresh-node-tree");
    },
  },
  style: e.readFileSync(
    Editor.url("packages://hierarchy/panel/style/index.css")
  ),
  template: e.readFileSync(
    Editor.url("packages://hierarchy/panel/template/index.html")
  ),
  messages: {
    "scene:ready"() {
      n.startup();
    },
    "scene:reloading"() {
      n.stop();
    },
    "selection:selected"(e, t, r) {
      if ("node" === t) {
        r.forEach((e) => {
            o.select(e, true);
          });

        l(r, this._vm.$els.nodes);
      }
    },
    "selection:unselected"(e, t, r) {
      if ("node" === t) {
        r.forEach((e) => {
          o.select(e, false);
        });
      }
    },
    "scene:animation-record-changed"(e, t, n) {
      r.recording = !!t;
      o.ignore(n, t);
    },
    "scene:prefab-mode-changed"(e, t) {
      r.editPrefab = !!t;
    },
    "change-filter"(e, t) {
      this._vm.filter = t;
    },
    delete(e, t) {
      clearTimeout(d);
      Editor.Selection.select("node", t, true);

      d = setTimeout(() => {
          n.deleteNode(t);
        }, 0);
    },
    rename(e, t) {
      o.rename(t);
    },
    copy(e) {
      if (r.recording) {
        return;
      }
      let t = Editor.Selection.curSelection("node");
      r.copyNodes = t;
      Editor.Ipc.sendToPanel("scene", "scene:copy-nodes", t);
    },
    "show-path"(e, t) {
      o.print(t);
    },
    duplicate(e, t) {
      Editor.Ipc.sendToPanel("scene", "scene:duplicate-nodes", t);
    },
    filter(e, t) {
      this._vm.filter = t;
    },
    hint(e, t) {
      o.hint(t);
    },
    "hierarchy:hint"(e, t) {
      this._vm.$refs.nodes.scrollToItem(t);
    },
  },
  ready() {
    this._vm = (function (e, r) {
      return new Vue({
        el: e,
        data: { length: 0, filter: "" },
        watch: {},
        methods: {},
        components: {
          tools: Editor.require("packages://hierarchy/panel/component/tools"),
          nodes: Editor.require("packages://hierarchy/panel/component/nodes"),
          search: Editor.require("packages://hierarchy/panel/component/search"),
        },
        created() {
          Editor.Ipc.sendToPanel(
            "scene",
            "scene:is-ready",
            (e, t) => {
              if (t) {
                n.startup();
              }
            },
            -1
          );

          t.on("filter-changed", (e) => {
            this.filter = e;

            if ("" === e) {
              i(this.$els.nodes);
            }
          });

          t.on("empty-filter", () => {
            i(this.$els.nodes);
          });
        },
      });
    })(this.shadowRoot);

    this._vm.length = (this.clientHeight - 56) / 20 + 3;
    r.initNodeState();
    r.initNodeStateProfile();
  },
  close() {
    r.saveNodeTreeStateProfile();
  },
  selectAll(e) {
    if (e) {
      e.stopPropagation();
      e.preventDefault();
    }

    let t = [];

    r.queryNodes().forEach((e) => {
      t.push(e.id);

      if (e.children.length > 0) {
        o.fold(e.id, false);
      }
    });

    Editor.Selection.select("node", t, true, false);
  },
  delete(e) {
    if (e) {
      e.stopPropagation();
      e.preventDefault();
    }

    if (r.recording) {
      return;
    }
    const t = r.queryRoots();
    let o = [];

    r.queryNodes().forEach((e) => {
      if (!(r.editPrefab && e.id === t[0])) {
        if (e.selected) {
          o.push(e.id);
        }
      }
    });

    n.deleteNode(o);
  },
  up(e) {
    if (e) {
      e.stopPropagation();
      e.preventDefault();
    }

    let t = r.queryNodes();
    for (let e = 0; e < t.length; e++) {
      let r = t[e];
      let o = r.showIndex;
      if (r && r.selected) {
        for (e; e >= 0; e--) {
          let r = t[e];
          if (
            (!this._vm.filter || r.isSearch) &&
            r.showIndex >= 0 &&
            r.showIndex < o
          ) {
            Editor.Selection.select("node", r.id, true, true);
            break;
          }
        }
        break;
      }
    }
  },
  down(e) {
    if (e) {
      e.stopPropagation();
      e.preventDefault();
    }

    let t = r.queryNodes();
    for (let e = t.length - 1; e >= 0; e--) {
      let r = t[e];
      let o = r.showIndex;
      if (r && r.selected) {
        for (e; e < t.length; e++) {
          let r = t[e];
          if ((!this._vm.filter || r.isSearch) && r.showIndex > o) {
            Editor.Selection.select("node", r.id, true, true);
            break;
          }
        }
        break;
      }
    }
  },
  left(e) {
    if (e) {
      e.stopPropagation();
      e.preventDefault();
    }

    r.queryNodes().forEach((e) => {
      if (e.selected) {
        o.fold(e.id, true);
      }
    });
  },
  right(e) {
    if (e) {
      e.stopPropagation();
      e.preventDefault();
    }

    r.queryNodes().forEach((e) => {
      if (e.selected) {
        o.fold(e.id, false);
      }
    });
  },
  shiftUp(e) {
    if (e) {
      e.stopPropagation();
      e.preventDefault();
    }

    s("up");
  },
  shiftDown(e) {
    if (e) {
      e.stopPropagation();
      e.preventDefault();
    }

    s("down");
  },
  f2(e) {
    if (e) {
      e.stopPropagation();
      e.preventDefault();
    }

    let t = r.queryNodes();
    for (let e = 0; e < t.length; e++) {
      let r = t[e];
      if (r && r.selected) {
        o.rename(r.id, true);
        break;
      }
    }
  },
  find(e) {
    let t = Editor.Selection.curSelection("node");

    if (!t.some((e) => {
      let t = r.queryNode(e);
      return t && t.rename;
    })) {
      if (e) {
        e.stopPropagation();
        e.preventDefault();
      }

      Editor.Ipc.sendToWins("scene:center-nodes", t);
    }
  },
  copy() {
    Editor.Ipc.sendToPanel("hierarchy", "copy");
  },
  paste() {
    if (r.recording) {
      return;
    }
    let e = Editor.Selection.curActivate("node");
    let t = r.queryNode(e);

    if (t && t.parent) {
      e = t.parent;
    }

    Editor.Ipc.sendToPanel("scene", "scene:paste-nodes", e);
  },
  duplicate() {
    if (r.recording) {
      return;
    }
    let e = Editor.Selection.curSelection("node");

    if (e.length > 0) {
      Editor.Ipc.sendToPanel("hierarchy", "duplicate", e);
    }
  },
});
