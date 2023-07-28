"use strict";
const t = require("fs");
const e = require("fire-path");
const i = require("async");
const { promisify: s } = require("util");
const r = require("../utils/cache");
const o = require("../utils/operation");
const h = require("../utils/event");
const l = require("../utils/utils");

exports.template = t.readFileSync(
  e.join(__dirname, "../template/search.html"),
  "utf-8"
);

exports.components = { node: require("./node") };
exports.props = ["filter", "length"];

exports.data = function () {
    return {
      nodes: r.queryNodes(),
      filterNodes: [],
      type: null,
      text: "",
      uuids: [],
      uh: { height: 0 },
      showList: [],
      start: 0,
    };
  };

exports.watch = {
    start() {
      this.reset();
    },
    length() {
      this.reset();
    },
    filterNodes() {
      this.reset();
    },
    nodes() {
      if (this.filter) {
        l.emptyFilter();
      }
    },
    filter() {
      let t = this.filter;
      if (!t) {
        return;
      }
      let r = [];
      let l = "";
      let d = "";
      let n = t.split(" ");
      t = "";
      for (let e = 0, i = n.length; e < i; e++) {
        let i = n[e];
        if (i) {
          if (/^t:.*/.test(i)) {
            let t = i
              .substring(2)
              .split(",")
              .map((t) => t.trim());
            r = r.concat(t);
          } else {
            if (/^u:.*/.test(i)) {
              l = i.substring(2);
            } else {
              if (/^used:.*/.test(i)) {
                d = i.substring(5);
              } else {
                t = i;
              }
            }
          }
        }
      }
      clearTimeout(this._searchID);
      h.emit("start-loading", 100);
      this.uuids = [];
      this._searchID = null;
      let u = setTimeout(async () => {
        h.emit("finish-loading");
        if ((r.includes("asset-bundle"))) {
          let t = [];
          try {
            t = await s(Editor.assetdb.queryAssets)(null, "folder");
          } catch (t) {
            Editor.error(t);
            return;
          }

          t.forEach((t) => {
            if (Editor.remote.assetdb.loadMeta(t.url).isBundle) {
              this.uuids.push(t.uuid);
            }
          });

          r = r.filter((t) => "asset-bundle" !== t);
        }
        let n = [];
        try {
          if ((r.length > 0 || l || d || t)) {
            n = await s(Editor.assetdb.queryAssets)(null, r);
          }
        } catch (t) {
          Editor.error(t);
          return;
        }

        if (u === this._searchID) {
          this.text = t.toLowerCase();
          l = l.toLowerCase();
          d = d.toLowerCase();

          i.waterfall(
            [
              (t) => {
                if (!d || !Editor.Utils.UuidUtils.isUuid(d)) {
                  t();
                  return;
                }
                Editor.assetdb.queryInfoByUuid(d, (e, i) => {
                  if (e) {
                    Editor.error(e);
                  } else {
                    if (i &&
                        this.isScript(i.type)) {
                      d = Editor.Utils.UuidUtils.compressUuid(d);
                    }
                  }

                  t();
                });
              },
              (t) => {
                n.forEach((t) => {
                  if (t.hidden) {
                    return;
                  }
                  let i = e.basenameNoExt(t.path);
                  e.extname(t.path);

                  if (this.validate(i, this.text) &&
                    this.validate(t.uuid, l) &&
                    this.findUsages(t, d)) {
                    this.uuids.push(t.uuid);
                  }
                });

                t();
              },
              (t) => {
                this.filterNodes = this.nodes.filter((t) => {
                  if (this.uuids && -1 === this.uuids.indexOf(t.id)) {
                    return false;
                  }
                  if (this.text) {
                    let e = t.name.toLowerCase();
                    this.text = this.text.toLowerCase();
                    if (-1 === e.indexOf(this.text)) {
                      return false;
                    }
                  }
                  return true;
                });

                t();
              },
            ],
            () => {
              Editor.Selection.curSelection("asset").forEach((t) => {
                o.select(t, true);
              });
            }
          );
        }
      }, 200);
      this._searchID = u;
    },
  };

exports.methods = {
    isScript: (t) => "javascript" === t || "typescript" === t,
    reset() {
      if (!this._updateLock) {
        this._updateLock = true;

        requestAnimationFrame(() => {
          this._updateLock = false;
          this.showNodeFilter();
        });
      }
    },
    sortShowNode() {
      r.sortAssetsTree(this.filterNodes);
    },
    showNodeFilter: function () {
      this.uh.height = 0;
      this.showList = [];
      let t = this.filterNodes;
      let e = this.start + Math.ceil(this.length);
      e = e > t.length ? t.length : e;
      for (let i = this.start; i < e; i++) {
        this.showList.push(t[i]);
      }
      this.uh.height = t.length * r.lineHeight + 4;
    },
    scrollIfNeeded(t) {
      let e = r.queryNode(t);
      if (!e) {
        return;
      }
      let i = this.filterNodes.indexOf(e);
      if (-1 === i) {
        return;
      }
      let s = i * r.lineHeight;
      let o = this.$el.scrollTop + this.$el.clientHeight - r.lineHeight - 2;

      if (s < this.$el.scrollTop - 2) {
        this.$el.scrollTop -= this.$el.scrollTop - 2 - s;
      } else {
        if (s >= o) {
          this.$el.scrollTop += s - o;
        }
      }
    },
    validate: (t, e) => t.toLowerCase().indexOf(e.toLowerCase()) > -1,
    addShowList(t) {
      if (-1 === this.showList.indexOf(t)) {
        this.showList.push(t);
      }
    },
    removeShowList(t) {
      let e = this.showList.indexOf(t);

      if (-1 !== e) {
        this.showList.splice(e, 1);
      }
    },
    findUsages(e, i) {
      if (!i) {
        return true;
      }
      if (i === e.uuid) {
        return false;
      }
      if (!e.destPath) {
        return false;
      }
      return t.readFileSync(e.destPath).indexOf(i) >= 0;
    },
    onUpdateFilter(t, e) {
      if (this.uuids && -1 === this.uuids.indexOf(t.id)) {
        return false;
      }
      if (e) {
        let i = t.name.toLowerCase();
        e = e.toLowerCase();
        let s = -1 !== i.indexOf(e);

        if (s) {
          this.addShowList(t);
        } else {
          this.removeShowList(t);
        }

        return s;
      }
      this.addShowList(t);
      return true;
    },
    onScroll(t) {
      let e = t.target.scrollTop;
      this.start = (e / r.lineHeight) | 0;
    },
    onDragStart: l.onDragStart,
    onDragOver: l.onDragOver,
    onDragEnd: l.onDragEnd,
  };

exports.created = function () {
    h.on("search:sort", this.sortShowNode);
  };
