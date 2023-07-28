const e = require("fire-fs");
const t = require("fire-path");
const s = require("fire-url");
const i = require("globby");
const a = Editor.require("packages://assets/panel/utils/event");
const r = Editor.require("packages://assets/panel/utils/cache");
const o = Editor.require("packages://assets/panel/utils/operation");
const l = Editor.require("packages://assets/panel/utils/utils");

let n = function (e) {
    return e.length <= 1 ? e[0] : e[e.length - 1];
  };

let d = function (e, t) {
  let s = Editor.Selection.curSelection("asset");
  let i = n(s);
  let a = t[t.findIndex((e) => e.id === i) + ("down" === e ? 1 : -1)];

  if (a) {
    Editor.Selection.select("asset", [a.id], true, true);
  }
};

let u = function (e) {
  let t = r.queryShowNodes();
  let s = Editor.Selection.curSelection("asset");
  let i = n(s);
  let a = s.indexOf(i);
  let o = t.findIndex((e) => e.id === i);
  let l = t[o];
  let d = t[o + ("down" === e ? 1 : -1)];

  if (d) {
    if (d.selected) {
      l.selected = !l.selected;
      s.splice(a, 1);
    } else {
      d.selected = !d.selected;

      if (d.selected) {
        s.push(d.id);
      } else {
        s.forEach((e, t) => {
          if (e === d.id) {
            s.splice(t, 1);
          }
        });
      }
    }

    Editor.Selection.select("asset", s, true, true);
  }
};

Editor.Panel.extend({
  listeners: {
    "panel-resize"() {
      this._vm.length = (this.clientHeight - 56) / r.lineHeight + 3;
      a.emit("refresh-asset-tree");
    },
  },
  style: e.readFileSync(Editor.url("packages://assets/panel/style/index.css")),
  template: e.readFileSync(
    Editor.url("packages://assets/panel/template/index.html")
  ),
  ready() {
    this._vm = (function (e, t) {
      return new Vue({
        el: e,
        data: { length: 0, filter: "", currentPath: "db://", loading: true },
        watch: {},
        methods: {},
        components: {
          tools: Editor.require("packages://assets/panel/component/tools"),
          nodes: Editor.require("packages://assets/panel/component/nodes"),
          search: Editor.require("packages://assets/panel/component/search"),
        },
        created() {
          o.loadAssets();

          a.on("filter-changed", (e) => {
            this.filter = e;
          });

          a.on("start-loading", () => {
            this.loading = true;
          });

          a.on("finish-loading", () => {
            this.loading = false;
            let e = Editor.Selection.curSelection("asset");

            e.forEach((e) => {
              o.select(e, true);
            });

            if (e.length > 0) {
              this.$refs.nodes.scrollToItem(e[0]);
            }
          });

          a.on("empty-filter", () => {
            let e = Editor.Selection.curSelection("asset");

            if (e.length > 0) {
              this.$refs.nodes.scrollToItem(e[0]);
            }
          });
        },
      });
    })(this.shadowRoot);

    this._vm.length = (this.clientHeight - 56) / r.lineHeight + 3;
  },
  close() {
    a.removeAllListeners();

    if (this._vm) {
      this._vm.$destroy();
    }
  },
  messages: {
    "assets:copy"(e, t) {
      let s = Editor.Selection.curSelection("asset");

      if (-1 === s.indexOf(t)) {
        r.copyUuids = [t];
      } else {
        r.copyUuids = s;
      }
    },
    async "assets:paste"(e, s) {
      let i = await l.uuid2path(s);
      if (!(await l.isDir(i)) && ((i = t.dirname(i)), !(await l.isDir(i)))) {
        return Editor.warn("The selected location is not a folder.");
      }
      if (r.copyUuids && (await l.exists(i))) {
        for (let e = 0; e < r.copyUuids.length; e++) {
          let s = r.copyUuids[e];
          if (await l.isReadOnly(s)) {
            return;
          }
          let a = await l.uuid2path(s);
          if (!a) {
            return Editor.warn(`File is missing - ${s}`);
          }
          let o = t.basename(a);
          let n = t.join(i, o);
          if (await l.isDir(a)) {
            let e = t.dirname(n);
            if (e === a || l.isSubDir(e, a)) {
              Editor.Dialog.messageBox({
                type: "warning",
                title: " ",
                buttons: [Editor.T("MESSAGE.sure")],
                message: Editor.T("MESSAGE.assets.paste_folder_warn"),
                noLink: true,
                defaultId: 0,
              });

              return;
            }
          }
          if (!(n = await l.copy(a, n))) {
            return;
          }
          let d = t.relative(Editor.url("db://assets"), n);
          Editor.assetdb.refresh(`db://assets/${d}`);
        }
      }
    },
    "assets:end-refresh"(e) {
      this.hideLoader();
    },
    "assets:start-refresh"(e) {
      this.showLoaderAfter(100);
    },
    "assets:sort"(e) {
      o.autoSort();

      if (this._vm.filter) {
        a.emit("search:sort");
      }
    },
    "selection:selected"(e, t, s) {
      if ("asset" !== t || !s) {
        return;
      }
      let i = n(s);
      this._vm.currentPath = o.getRealUrl(i);

      s.forEach((e) => {
        o.select(e, true);
      });

      if (this._vm.filter) {
        this._vm.$refs.search.scrollIfNeeded(i);
      } else {
        this._vm.$refs.nodes.scrollIfNeeded(i);
      }
    },
    "change-filter"(e, t) {
      this._vm.filter = t;
    },
    "selection:unselected"(e, t, s) {
      if ("asset" === t) {
        s.forEach((e) => {
          o.select(e, false);
        });
      }
    },
    "asset-db:assets-created"(e, s) {
      let i = [];

      s.forEach((e) => {
        if (e.hidden) {
          return;
        }
        let a = t.basenameNoExt(e.path);
        let r = t.extname(e.path);

        if ("folder" === e.type) {
          a = t.basename(e.path);
          r = "";
        } else {
          if ("mount" === e.type) {
            a = e.name;
            r = "";
          }
        }

        o.add({
          name: a,
          extname: r,
          type: e.type,
          isSubAsset: e.isSubAsset,
          readonly: e.readonly,
          hidden: false,
          parentUuid: e.parentUuid,
          uuid: e.uuid,
        });

        if (this._activeWhenCreated === e.url) {
          this._activeWhenCreated = null;
          Editor.Selection.select("asset", e.uuid);
        }

        if (!s.some((t) => t.uuid === e.parentUuid)) {
          i.push(e);
        }
      });

      i.forEach((e) => {
        window.requestAnimationFrame(() => {
          o.hint(e.uuid);
          let t = r.queryNode(e.uuid);

          if (t && t.parent) {
            o.fold(t.parent, false);
          }
        });
      });

      if (
        (i.length)
      ) {
        let e = i[0];
        this._vm.$refs.nodes.scrollToItem(e.uuid);
      }
    },
    "asset-db:assets-moved"(e, s) {
      let i = Editor.Utils.arrayCmpFilter(s, (e, s) =>
        t.contains(e.srcPath, s.srcPath)
          ? 1
          : t.contains(s.srcPath, e.srcPath)
          ? -1
          : 0
      );

      i.forEach((e) => {
        Editor.assetdb.queryInfoByUuid(e.uuid, (s, i) => {
          let a = "";

          a = "folder" === i.type
            ? t.basename(e.destPath)
            : t.basenameNoExt(e.destPath);

          o.move(e.uuid, e.parentUuid, a);
        });
      });

      i.forEach((e) => {
        window.requestAnimationFrame(() => {
          o.hint(e.uuid);
        });
      });
    },
    "asset-db:assets-deleted"(e, t) {
      t.forEach((e) => {
        o.remove(e.uuid);
      });
      let s = t.map((e) => e.uuid);
      Editor.Selection.unselect("asset", s, true);
    },
    "asset-db:asset-changed"(e, t) {
      o.hint(t.uuid);

      if (!("texture" !== t.type && "sprite-frame" !== t.type)) {
        o.updateIcon(t.uuid);
      }
    },
    "asset-db:asset-uuid-changed"(e, t) {
      o.updateUuid(t.oldUuid, t.uuid);
    },
    "assets:hint"(e, t) {
      this._vm.$refs.nodes.scrollToItem(t);
    },
    "assets:search"(e, t) {
      this._vm.filter = t;
    },
    "assets:clearSearch"(e) {
      this._vm.filter = "";
    },
    async "assets:new-asset"(a, l, n) {
      let d;
      let u;
      let c;
      if (n) {
        let e = Editor.Selection.contexts("asset");
        if (e.length > 0) {
          let s = e[0];

          if ("folder" === (u = r.queryNode(s)).assetType || "mount" === u.assetType) {
            c = o.getRealUrl(u.id);
          } else {
            d = o.getRealUrl(u.id);
            c = t.dirname(d);
          }
        } else {
          c = "db://assets";
        }
      } else {
        let e = Editor.Selection.curActivate("asset");
        if (e) {
          u = r.queryNode(e);
          d = o.getRealUrl(e);

          c = "folder" === u.assetType ||
          "mount" === u.assetType ||
          u === r.queryRoot()
            ? d
            : t.dirname(d);
        } else {
          c = "db://assets";
        }
      }
      let h = l.data;

      if (l.url) {
        h = e.readFileSync(Editor.url(l.url), { encoding: "utf8" });
      }

      let p = s.join(c, l.name);
      switch (s.extname(p)) {
        case ".fire":
          let e = Editor.Profile.load("project://project.json");

          (h = JSON.parse(h)).forEach((t) => {
            if ("cc.Canvas" === t.__type__) {
              t._designResolution = {
                  __type__: "cc.Size",
                  width: e.get("design-resolution-width"),
                  height: e.get("design-resolution-height"),
                };

              t._fitWidth = e.get("fit-width");
              t._fitHeight = e.get("fit-height");
            }
          });

          h = JSON.stringify(h);
          break;
        case ".pac":
          if (i.sync(t.join(Editor.remote.assetdb.urlToFspath(c), "*.pac"))
            .length > 0) {
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
          break;
        case ".js":
        case ".ts":
          p = await o.getUniqueUrl(p, ["typescript", "javascript"]);
      }
      (() => {
        this._activeWhenCreated = p;

        Editor.assetdb.create(p, h, function (e, t) {
          setTimeout(function () {
            if (!t) {
              return;
            }
            let e = t[0].uuid;
            Editor.Selection.select("asset", e, true, true);

            if (r.queryNode(e)) {
              o.rename(e);
            }
          }, 50);
        });
      })();
    },
    "assets:find-usages"(e, t) {
      this._vm.filter = "used:" + t;
    },
    "assets:rename"(e, t) {
      o.rename(t);
    },
    "assets:delete"(e, t) {
      this._delete(t);
    },
  },
  selectAll(e) {
    if (e) {
      e.stopPropagation();
      e.preventDefault();
    }

    let t = r.queryShowNodes().map((e) => e.id);
    Editor.Selection.select("asset", t, true, true);
  },
  showLoaderAfter(e) {
    if (!(this._vm.loading || this._loaderID)) {
      this._loaderID = setTimeout(() => {
        this._vm.loading = true;
        this._loaderID = null;
      }, e);
    }
  },
  hideLoader() {
    this._vm.loading = false;
    clearTimeout(this._loaderID);
  },
  find(e) {},
  delete(e) {
    if (e) {
      e.stopPropagation();
      e.preventDefault();
    }

    let t = Editor.Selection.curSelection("asset");
    this._delete(t);
  },
  f2(e) {
    if (e) {
      e.stopPropagation();
      e.preventDefault();
    }

    let t = Editor.Selection.curSelection("asset");
    if (0 === t.length) {
      return;
    }
    let s = n(t);
    o.rename(s);
  },
  left(e) {
    if (e) {
      e.stopPropagation();
      e.preventDefault();
    }

    let t = Editor.Selection.curSelection("asset");
    let s = n(t);
    o.fold(s, true);
  },
  right(e) {
    if (e) {
      e.stopPropagation();
      e.preventDefault();
    }

    let t = Editor.Selection.curSelection("asset");
    let s = n(t);
    o.fold(s, false);
  },
  async copyFile(e) {
    if (e) {
      e.stopPropagation();
      e.preventDefault();
    }

    r.copyUuids = null;
    let t = [];
    let s = Editor.Selection.curSelection("asset");
    for (let e = 0; e < s.length; e++) {
      if (!(await l.isReadOnly(s[e]))) {
        t.push(s[e]);
      }
    }
    r.copyUuids = t.length > 0 ? t : null;
  },
  async pasteFile(e) {
    if (e) {
      e.stopPropagation();
      e.preventDefault();
    }

    let s = Editor.Selection.curActivate("asset");
    let i = "";

    if ("mount-assets" === s) {
      i = Editor.url("db://assets");
    } else {
      if (Editor.Utils.UuidUtils.isUuid(s)) {
        i = await l.uuid2path(s);
      }
    }

    if (!(await l.isDir(i)) && ((i = t.dirname(i)), !(await l.isDir(i)))) {
      return Editor.warn("The selected location is not a folder.");
    }
    if (r.copyUuids && (await l.exists(i))) {
      for (let e = 0; e < r.copyUuids.length; e++) {
        let s = r.copyUuids[e];
        if (await l.isReadOnly(s)) {
          return;
        }
        let a = await l.uuid2path(s);
        if (!a) {
          return Editor.warn(`File is missing - ${s}`);
        }
        let o = t.basename(a);
        let n = t.join(i, o);
        if (await l.isDir(a)) {
          let e = t.dirname(n);
          if (e === a || l.isSubDir(e, a)) {
            Editor.Dialog.messageBox({
              type: "warning",
              title: " ",
              buttons: [Editor.T("MESSAGE.sure")],
              message: Editor.T("MESSAGE.assets.paste_folder_warn", {
                filename: o,
              }),
              noLink: true,
              defaultId: 0,
            });

            return;
          }
        }
        if (!(n = await l.copy(a, n))) {
          return;
        }
        let d = t.relative(Editor.url("db://assets"), n);
        Editor.assetdb.refresh(`db://assets/${d}`);
      }
    }
  },
  shiftUp(e) {
    if (e) {
      e.stopPropagation();
      e.preventDefault();
    }

    u("up");
  },
  shiftDown(e) {
    if (e) {
      e.stopPropagation();
      e.preventDefault();
    }

    u("down");
  },
  up(e) {
    if (e) {
      e.stopPropagation();
      e.preventDefault();
    }

    d(
      "up",
      this._vm.filter ? this._vm.$refs.search.showList : r.queryShowNodes()
    );
  },
  down(e) {
    if (e) {
      e.stopPropagation();
      e.preventDefault();
    }

    d(
      "down",
      this._vm.filter ? this._vm.$refs.search.showList : r.queryShowNodes()
    );
  },
  _delete(e) {
    let t = e.map((e) => o.getRealUrl(e));
    let s = t;

    if (s.length > 3) {
      (s = s.slice(0, 3)).push("...");
    }

    s = s.join("\n");

    if (0 ===
      Editor.Dialog.messageBox({
        type: "warning",
        buttons: [Editor.T("MESSAGE.delete"), Editor.T("MESSAGE.cancel")],
        title: Editor.T("MESSAGE.assets.delete_title"),
        message: Editor.T("MESSAGE.assets.delete_message") + "\n" + s,
        detail: Editor.T("MESSAGE.assets.delete_detail"),
        defaultId: 0,
        cancelId: 1,
        noLink: true,
      })) {
      Editor.assetdb.delete(t);
    }
  },
});
