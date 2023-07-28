"use strict";
const e = require("fs");
const t = require("path");
const n = (require("fire-url"), require("../utils/cache"));
const i = require("../utils/event");
const o = require("../utils/utils");
const r = require("../utils/operation");
const s = require("../utils/communication");
const l = require("../../selection");

exports.template = e.readFileSync(
  t.join(__dirname, "../template/node.html"),
  "utf-8"
);

exports.props = ["start", "node"];

exports.data = function () {
    return {
      style: {
        "padding-left": 15 * this.node.level + 10,
        transform: `translateY(${this.start * n.lineHeight}px)`,
      },
      iconUrl: this.node.iconUrl,
      oldIconUrl: null,
      lockRename: false,
    };
  };

exports.created = function () {
    this.genIcon();
  };

exports.watch = {
    "node.rename": {
      handler: function (e, t) {
        if (e && !t) {
          this.oriName = this.node.name;
        }

        if (!e && t) {
          this.nodeRename();
        }
      },
    },
    "node.level": {
      handler: function (e, t) {
        this.style["padding-left"] = 15 * e + 10;
      },
    },
    "node.iconUrl": {
      handler: function (e, t) {
        this.oldIconUrl = t;
        this.genIcon();
      },
    },
  };

exports.methods = {
    t: (e) => Editor.T(`HIERARCHY.${e}`),
    onUpdateStyle(e) {
      this.style.transform = `translateY(${e * n.lineHeight}px)`;
      return this.style;
    },
    genIcon() {
      if (this.node.iconUrl) {
        this.iconUrl = this.node.iconUrl;
        return;
      }
      let e;
      let t;
      let n = this.node.assetType;
      let i = this.node.id;
      if ("texture" === n) {
        t = 'url("' + (e = `thumbnail://${i}?32`) + '")';
        this.iconUrl = `background-image:${t}`;

        if (this.oldIconUrl === this.iconUrl) {
          t = 'url("' + (e += "&_ts=" + Date.now()) + '")';
          this.iconUrl = `background-image:${t}`;
        }

        this.node.iconUrl = this.iconUrl;
        return;
      }
      if ("sprite-frame" === n) {
        var o = this;

        Editor.assetdb.queryMetaInfoByUuid(i, (e, t) => {
          if (!t) {
            this.iconUrl = `background-image:${o._getDefaultIcon(n)}`;
            return;
          }
          var i = JSON.parse(t.json);
          this.iconUrl = `background-image:${o._getDrawFrameIcon(i)}`;
          this.node.iconUrl = this.iconUrl;
        });

        return;
      }
      this.iconUrl = `background-image:${this._getDefaultIcon(n)}`;
      this.node.iconUrl = this.iconUrl;
    },
    _getDefaultIcon(e) {
      let t;
      let n = Editor.metas[e];
      return n && n["asset-icon"]
        ? 'url("' + (t = n["asset-icon"]) + '")'
        : 'url("' + (t = "packages://assets/static/icon/" + e + ".png") + '")';
    },
    _getDrawFrameIcon(e) {
      let t;
      let n;
      let i = `thumbnail://${e.rawTextureUuid}?32`;
      let o = e.trimX;
      let r = e.trimY;
      let s = 0;

      if (e.rotated) {
        t = e.height;
        n = e.width;
        s = 270;
      } else {
        t = e.width;
        n = e.height;
      }

      let l = `&x=${o}&y=${r}&w=${t}&h=${n}`;

      if (0 !== s) {
        l += `&rotate=${s}`;
      }

      let a = 'url("' + (i += l) + '")';

      if (this.iconUrl === a) {
        a = 'url("' + (i += "&_ts=" + Date.now()) + '")';
      }

      return a;
    },
    onClick() {
      if (this.node.selected) {
        !this.node.rename;
      }
    },
    onMouseDown(e) {
      e.stopPropagation();
      l.setContext("cloud-function", this.node.id);
      this._renameCancel();
      if (2 === e.button) {
        s.popup("context", {
          x: e.clientX,
          y: e.clientY,
          id: this.node.id,
          assetType: this.node.assetType,
          allowAssign: false,
          copyEnable: !this.node.readonly && !this.node.isSubAsset,
        });

        return;
      }
    },
    onMouseEnter() {
      l.hover("cloud-function", this.node.id);
    },
    onMouseUp(e) {
      l.setContext("cloud-function");
      if ((e.ctrlKey || e.metaKey)) {
        let e = l.curSelection("cloud-function");
        let t = e.indexOf(this.node.id);

        if (-1 !== t) {
          e.splice(t, 1);
        } else {
          e.push(this.node.id);
        }

        l.select("cloud-function", e, true, true);
        return;
      }
      if (e.shiftKey) {
        let e = l.curSelection("cloud-function");
        if (!e || e.length <= 0) {
          e = this.node.id;
          l.select("cloud-function", e, true, true);
          return;
        }
        let t = n.queryShowNodes();
        let i = (n.queryNode(e[0]), t.findIndex((t) => t.id === e[0]));
        let o = t.findIndex((e) => e.id === this.node.id);
        if (-1 === i || -1 === o) {
          console.log("can find uuid");
          return;
        }
        if (e[0] === this.node.id) {
          e = this.node.id;
          l.select("cloud-function", e, true, true);
          return;
        }
        e = [];
        let r = i > o ? -1 : 1;
        for (let n = i; n !== o + r; n += r) {
          let i = t[n];
          e.push(i.id);
        }
        l.select("cloud-function", e, true, true);
        return;
      }
      let t = this.node.id;
      l.select("cloud-function", t, true, true);
    },
    onMouseLeave() {
      l.hover("cloud-function", null);
    },
    onDBClick(t) {
      t.stopPropagation();
      t.preventDefault();
      clearTimeout(this._renameTimer);
      if (1 !== t.which || this.node.rename) {
        return;
      }
      if (t.shiftKey || t.metaKey || t.ctrlKey) {
        return;
      }
      if (!e.lstatSync(this.node.id).isDirectory()) {
        return this.onOpenAsset(this.node.id);
      }
      let n = !this.node.fold;
      r.fold(this.node.id, n);
    },
    onIClick(e) {
      e.stopPropagation();
      e.preventDefault();
      this._renameCancel();
      let t = !this.node.fold;

      if (e.altKey) {
        r.recFoldNodes(this.node.id, t);
      }

      r.fold(this.node.id, t);
    },
    onIDBClick(e) {
      e.stopPropagation();
      e.preventDefault();
    },
    onIMouseDown(e) {
      e.stopPropagation();
      e.preventDefault();
    },
    onIMouseUp(e) {
      e.stopPropagation();
      e.preventDefault();
    },
    onInputBlur(e) {
      e.stopPropagation();
      if (this.lockRename) {
        this.lockRename = false;
        return;
      }
      this._renameSubmit(e.target.value);
    },
    nodeRename() {
      if (this.node.name) {
        i.emit("create-cloud-function", this.node.name, this.node.id);
      } else {
        Editor.Dialog.messageBox({
              type: "warning",
              buttons: [Editor.T("MESSAGE.ok")],
              title: Editor.T("MESSAGE.warning"),
              message: o.tr("cloud-fcuntion-name-not-empty"),
              noLink: true,
            });

        this.node.name = this.oriName;
        r.loadAssets(false);
      }

      clearTimeout(this._renameTimer);
    },
    onInputKeydown(e) {
      switch ((e.stopPropagation(), e.keyCode)) {
        case 13:
          this.lockRename = true;
          this._renameSubmit(e.target.value);
        case 27:
          this.lockRename = true;
          this._renameCancel(true);
      }
    },
    onInputMouseDown(e) {
      e.stopPropagation();
    },
    onInputClick(e) {
      e.stopPropagation();
      e.preventDefault();
    },
    onOpenAsset(e) {
      Editor.Ipc.sendToMain("cloud-function:open-text-file", e);
    },
    _renameSubmit(e) {
      this.node.name = e;
      r.rename();
      clearTimeout(this._renameTimer);
    },
    _renameCancel(e) {
      r.rename();
      clearTimeout(this._renameTimer);

      if (e) {
        i.emit("nodes_focus", true);
      }
    },
  };

exports.directives = {
    init() {
      setTimeout(() => {
        if (!this.vm || !this.vm.$el) {
          return;
        }
        let e = this.vm.$el.getElementsByTagName("input")[0];

        if (e) {
          e.focus();
          e.select();
        }
      }, 100);
    },
  };
