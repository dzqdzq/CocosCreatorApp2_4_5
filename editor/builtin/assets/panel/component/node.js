"use strict";
const e = require("fs");
const t = require("path");
const { promisify: i } = require("util");
const n = (require("fire-url"), require("../utils/cache"));
const o = require("../utils/event");
const s = require("../utils/operation");
const r = require("../utils/communication");
const a = Editor.require("scene://utils/animation");
const d = /(?:\.js|\.ts)+$/;

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

        if (!e && t && this.oriName !== this.node.name) {
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
      let i = this.node.assetType;
      let o = this.node.id;
      if ("sprite-frame" === i && this.node.isSubAsset && this.node.parent) {
        let e = n.queryNode(this.node.parent);
        if (e && "sprite-atlas" === e.assetType) {
          this.iconUrl = `background-image:${this._getDefaultIcon(i)}`;

          Editor.assetdb.queryMetaInfoByUuid(this.node.id, (e, t) => {
            let i = JSON.parse(t.json);

            this.iconUrl = `background-image:${
              i
                ? this._getDrawFrameIcon(i)
                : this._getDefaultIcon(t.assetType)
            }`;

            this.node.iconUrl = this.iconUrl;
          });

          return;
        }
      }
      if ("texture" === i) {
        t = 'url("' + (e = `thumbnail://${o}?32`) + '")';
        this.iconUrl = `background-image:${t}`;

        if (this.oldIconUrl === this.iconUrl) {
          t = 'url("' + (e += "&_ts=" + Date.now()) + '")';
          this.iconUrl = `background-image:${t}`;
        }

        this.node.iconUrl = this.iconUrl;
        return;
      }
      this.iconUrl = `background-image:${this._getDefaultIcon(i)}`;
      this.node.iconUrl = this.iconUrl;
    },
    _getDefaultIcon(e) {
      let t;
      let i = Editor.metas[e];
      return i && i["asset-icon"]
        ? 'url("' + (t = i["asset-icon"]) + '")'
        : 'url("' + (t = "packages://assets/static/icon/" + e + ".png") + '")';
    },
    _getDrawFrameIcon(e) {
      let t;
      let i;
      let n = `thumbnail://${e.rawTextureUuid}?32`;
      let o = e.trimX;
      let s = e.trimY;
      let r = 0;

      if (e.rotated) {
        t = e.height;
        i = e.width;
        r = 270;
      } else {
        t = e.width;
        i = e.height;
      }

      let a = `&x=${o}&y=${s}&w=${t}&h=${i}`;

      if (0 !== r) {
        a += `&rotate=${r}`;
      }

      let d = 'url("' + (n += a) + '")';

      if (this.iconUrl === d) {
        d = 'url("' + (n += "&_ts=" + Date.now()) + '")';
      }

      return d;
    },
    onClick() {
      if (this.node.selected &&
        !this.node.rename) {
        this._renameTimer = setTimeout(() => {
            s.rename(this.node.id);
          }, 300);
      }
    },
    onMouseDown(e) {
      e.stopPropagation();
      Editor.Selection.setContext("asset", this.node.id);
      this._renameCancel();
      if (2 === e.button) {
        r.popup("context", {
          x: e.clientX,
          y: e.clientY,
          id: this.node.id,
          assetType: this.node.assetType,
          allowAssign: false,
          copyEnable: !this.node.readonly && !this.node.isSubAsset,
          isSubAsset: this.node.isSubAsset,
          allowPaste: n.copyUuids && n.copyUuids.length > 0,
        });

        return;
      }
    },
    onMouseEnter() {
      Editor.Selection.hover("asset", this.node.id);
    },
    onMouseUp(e) {
      if (2 !== e.button) {
        Editor.Selection.setContext("asset");
      }

      if (
        (e.ctrlKey || e.metaKey)
      ) {
        let e = Editor.Selection.curSelection("asset");
        let t = e.indexOf(this.node.id);

        if (-1 !== t) {
          e.splice(t, 1);
        } else {
          e.push(this.node.id);
        }

        Editor.Selection.select("asset", e, true, true);
        return;
      }
      if (e.shiftKey) {
        let e = Editor.Selection.curSelection("asset");
        if (!e || e.length <= 0) {
          e = this.node.id;
          Editor.Selection.select("asset", e, true, true);
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
          Editor.Selection.select("asset", e, true, true);
          return;
        }
        e = [];
        let s = i > o ? -1 : 1;
        for (let n = i; n !== o + s; n += s) {
          let i = t[n];
          e.push(i.id);
        }
        Editor.Selection.select("asset", e, true, true);
        return;
      }
      let t = this.node.id;
      Editor.Selection.select("asset", t, true, true);
    },
    onMouseLeave() {
      Editor.Selection.hover("node", null);
    },
    onDBClick(e) {
      e.stopPropagation();
      e.preventDefault();
      clearTimeout(this._renameTimer);

      if (!(1 !== e.which ||
        this.node.rename ||
        e.shiftKey ||
        e.metaKey || e.ctrlKey)) {
        this.onOpenAsset(this.node.id);
      }
    },
    onIClick(e) {
      e.stopPropagation();
      e.preventDefault();
      this._renameCancel();
      let t = !this.node.fold;

      if (e.altKey) {
        s.recFoldNodes(this.node.id, t);
      }

      s.fold(this.node.id, t);
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
    async nodeRename() {
      if (a.STATE.RECORD && "animation-clip" === this.node.assetType) {
        if (await i(Editor.Ipc.sendToPanel)(
          "timeline",
          "timeline:exists-clip",
          this.node.id
        )) {
          this.node.name = this.oriName;
          o.emit("nodes_focus", true);
          Editor.warn("Cannot rename while currently animation edit.");
          return;
        }
      }
      let e = "";
      if ("javascript" === this.node.assetType ||
      "typescript" === this.node.assetType) {
        this.node.name = this.node.name.replace(d, "");
        if (this.node.name === this.oriName) {
          return;
        }
        e = s.getRealUrl(this.node.id);
        e = await s.getUniqueUrl(e, ["typescript", "javascript"]);
      } else {
        e = s.getRealUrl(this.node.id);
      }
      let t = s.getRealUrl(this.node.id, this.oriName);

      if (this.node.name) {
        Editor.assetdb.move(t, e, true, (e, t) => {
          if (e) {
            this.node.name = this.oriName;
          }
        });
      } else {
        Editor.Dialog.messageBox({
              type: "warning",
              buttons: [Editor.T("MESSAGE.ok")],
              title: Editor.T("MESSAGE.warning"),
              message: Editor.T("MESSAGE.assets.failed_to_move", {
                srcUrl: t,
                destUrl: e,
              }),
              detail: "Can not use empty name",
              noLink: true,
            });

        this.node.name = this.oriName;
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
      Editor.assetdb.queryInfoByUuid(e, (t, i) => {
        switch (i.type) {
          case "effect":
          case "javascript":
          case "typescript":
          case "markdown":
          case "bitmap-font":
          case "text":
          case "json":
            Editor.Ipc.sendToMain("assets:open-text-file", e);
            break;
          case "scene":
            Editor.Ipc.sendToMain("scene:open-by-uuid", e);
            break;
          case "sprite-frame":
            Editor.Panel.open("sprite-editor", { uuid: e });
            break;
          case "texture":
            Editor.Ipc.sendToMain("assets:open-texture-file", e);
            break;
          case "prefab":
            Editor.Ipc.sendToAll("scene:enter-prefab-edit-mode", e);
            break;
          case "folder":
            let t = n.queryNode(e);
            s.fold(t.id, !t.fold);
        }
      });
    },
    _renameSubmit(e) {
      this.node.name = e;
      s.rename();
      clearTimeout(this._renameTimer);
    },
    _renameCancel(e) {
      s.rename();
      clearTimeout(this._renameTimer);

      if (e) {
        o.emit("nodes_focus", true);
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
