"use strict";
const e = require("fs");
const t = require("path");
const i = require("fire-url");
const s = require("globby");
const o = require("../utils/cache");
const r = require("../utils/operation");
const n = require("../utils/event");
const l = require("../utils/display");
const a = require("../utils/communication");
const d = require("../utils/utils");

exports.template = e.readFileSync(
  t.join(__dirname, "../template/nodes.html"),
  "utf-8"
);

exports.props = ["length"];

exports.components = {
    node: require("./node"),
    highlight: require("./highlight"),
  };

exports.created = function () {
    n.on("nodes_focus", (e) => {
      this.focused = e;

      if (e && this.$el) {
        this.$el.parentElement.focus();
      }
    });
  };

exports.data = function () {
    return {
      focused: false,
      start: 0,
      nodes: o.queryShowNodes(),
      list: [],
      allNodes: o.queryNodes(),
      uh: { height: 0 },
      y: -999,
      highlight: { node: null, state: 0 },
    };
  };

exports.watch = {
    start() {
      this.reset();
    },
    length() {
      this.reset();
    },
    nodes() {
      this.reset();
    },
  };

exports.methods = {
    reset() {
      if (!this._updateLock) {
        this._updateLock = true;

        requestAnimationFrame(() => {
          this._updateLock = false;
          this.updateShowList();
        });
      }
    },
    updateShowList() {
      let e = o.queryShowNodes();
      this.uh.height = 0;
      this.list.length = 0;
      let t = this.start + Math.ceil(this.length);
      t = t > e.length ? e.length : t;
      for (let i = this.start; i < t; i++) {
        this.list.push(e[i]);
      }
      this.uh.height = e.length * o.lineHeight + 4;
    },
    onMouseDown(e) {
      if (2 === e.button) {
        Editor.Selection.setContext("asset", null);
        a.popup("context", { x: e.clientX, y: e.clientY });
        return;
      }
      Editor.Selection.select("asset");
    },
    onScroll(e) {
      let t = e.target.scrollTop;
      this.start = (t / o.lineHeight) | 0;
    },
    onFocus() {
      this.focused = true;
    },
    onBlur() {
      this.focused = false;
    },
    scrollIfNeeded(e) {
      let t = o.queryNode(e);
      if (!t) {
        return;
      }
      let i = o.queryShowNodes().indexOf(t);
      if (-1 === i) {
        return;
      }
      let s = i * o.lineHeight;
      let r = this.$el.scrollTop + this.$el.clientHeight - o.lineHeight - 2;

      if (s < this.$el.scrollTop - 2) {
        this.$el.scrollTop -= this.$el.scrollTop - 2 - s;
      } else {
        if (s >= r) {
          this.$el.scrollTop += s - r;
        }
      }
    },
    scrollToItem(e) {
      let t = o.queryNode(e);
      if (!t) {
        return;
      }
      r.recParentNodes(e, false);
      let i = o.queryShowNodes();
      setTimeout(() => {
        if (this.$el) {
          let s = i.indexOf(t);

          if (s > -1) {
            this.$el.scrollTop = o.lineHeight * s - (o.lineHeight * this.length) / 2;
            r.hint(e);
          }
        }
      }, 50);
    },
    onDragStart: d.onDragStart,
    onDragOver: d.onDragOver,
    onDragEnd: d.onDragEnd,
    onDropAreaMove(e) {
      e.preventDefault();
      e.stopPropagation();
      e.target;
      let t = this.$el.getBoundingClientRect();
      this.y = this.$el.scrollTop + e.detail.clientY - t.top - 5;
      let i = e.detail.dragType;
      let s = "none";

      if ("asset" === i || "file" === i || "cloud-function" === i) {
        s = "copy";
      } else {
        if ("node" === i) {
          s = "move";
        }
      }

      Editor.UI.DragDrop.updateDropEffect(e.detail.dataTransfer, s);
    },
    onDropAreaAccept(e) {
      e.stopPropagation();
      Editor.Selection.cancel();
      let n = l.point(this.y);
      if (!n.node) {
        return;
      }
      let a = e.detail.dragType;
      let d = e.detail.dragItems;
      if ("cloud-function" === a) {
        d.forEach((e) => {
          Editor.Ipc.sendToPackage(
            "node-library",
            "import-cloud-component",
            e.path
          );
        });

        return;
      }

      if ("file" === a) {
        d = (d = Editor.UI.DragDrop.filterFiles(d)).map((e) => e.path);
      } else {
        if (!("asset" !== a && "node" !== a)) {
          d = d.map((e) => e.id);
        }
      }

      if (0 === d.length) {
        return;
      }
      if (n.node && -1 !== d.indexOf(n.node.id)) {
        return;
      }
      this.y = -999;
      1;

      if (n.node) {
        console.log(`插入目标节点：${n.node.name} - ${n.node.id}`);
      }

      let h = r.getRealUrl(n.node.id);
      let u = true;

      if ("folder" !== n.node.assetType &&
          "mount" !== n.node.assetType) {
        h = r.getPath(n.node.id);
        u = false;
      }

      if (
        ("file" === e.detail.dragType)
      ) {
        let e;
        if (u) {
          e = n.node.children.map((e) => e.name + e.extname);
        } else {
          let t = o.queryNode(n.node.parent);
          if (!t) {
            return;
          }
          e = t.children.map((e) => e.name + e.extname);
        }
        let i = [];
        for (let s = 0; s < d.length; s++) {
          let o = t.basename(d[s]);

          if (e.indexOf(o) >= 0) {
            i.push(d[s]);
          }
        }
        if (i.length > 0) {
          for (let e = 0; e < i.length; e++) {
            let s = i.length - e;
            let o = t.basename(i[e]);
            let r = null;
            let n = "";

            if (s > 1) {
              r = [
                    Editor.T("MESSAGE.assets.skip"),
                    Editor.T("MESSAGE.assets.merge"),
                    Editor.T("MESSAGE.assets.skip_all"),
                    Editor.T("MESSAGE.assets.merge_all"),
                  ];

              n = Editor.T("MESSAGE.assets.left_count", { leftCount: s });
            } else {
              r = [
                    Editor.T("MESSAGE.assets.skip"),
                    Editor.T("MESSAGE.assets.merge"),
                  ];
            }

            let l = Editor.Dialog.messageBox({
              type: "warning",
              buttons: r,
              title: Editor.T("MESSAGE.warning"),
              message: Editor.T("MESSAGE.assets.import_conflict", {
                fileName: o,
              }),
              detail: n,
              noLink: true,
              defaultId: 0,
              cancelId: 1,
            });
            if (0 === l) {
              let t = d.indexOf(i[e]);

              if (t >= 0) {
                d.splice(t, 1);
              }
            } else {
              if (2 === l) {
                for (let t = e; t < i.length; t++) {
                  let e = d.indexOf(i[t]);

                  if (e >= 0) {
                    d.splice(e, 1);
                  }
                }
                break;
              }
              if (3 === l) {
                break;
              }
            }
          }
        }

        if (d.length > 0) {
          Editor.assetdb.import(d, h, true);
        }
      } else {
        e.detail.dragItems
          .map((e) => ({ uuid: e.id, assetType: e.assetType }))
          .forEach((l, a) => {
          let d = l.uuid;
          let u = h;
          switch (e.detail.dragType) {
            case "node":
              Editor.Ipc.sendToPanel("scene", "scene:create-prefab", d, u);
              break;
            case "asset":
              if ("auto-atlas" === l.assetType) {
                if (s.sync(
                  t.join(Editor.remote.assetdb.urlToFspath(u), "*.pac")
                ).length > 0) {
                  Editor.Dialog.messageBox({
                    type: "warning",
                    title: " ",
                    buttons: [Editor.T("MESSAGE.sure")],
                    message: Editor.T("MESSAGE.assets.auto_atlas"),
                    noLink: true,
                    defaultId: 0,
                  });

                  return;
                }
              }
              if (o.queryNode(d).parent === n.node.parent &&
              "folder" !== n.node.assetType) {
                return;
              }
              let a = r.getRealUrl(d);
              u = i.join(u, i.basename(a));
              Editor.assetdb.move(a, u, true);
          }
          window.requestAnimationFrame(() => {
            r.hint(d);
          });
        });
      }
    },
  };

exports.directives = {
    init(e, t) {
      requestAnimationFrame(() => {
        if (this.vm) {
          this.vm.reset();
        }
      });
    },
  };

exports.created = function () {
    n.on("refresh-asset-tree", () => {
      this.reset();
    });
  };
