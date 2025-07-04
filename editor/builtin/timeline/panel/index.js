"use strict";
const e = require("fire-path");
const t = require("fire-fs");
let i = "timeline";
const a = Editor.require(`packages://${i}/panel/grid`);
window.customElements.define("timeline-grid", a);
const o = Editor.require(`packages://${i}/panel/component/home`);

const r = {
  tools: Editor.require(`packages://${i}/panel/component/tools`),
  events: Editor.require(`packages://${i}/panel/component/events`),
  nodes: Editor.require(`packages://${i}/panel/component/nodes`),
  props: Editor.require(`packages://${i}/panel/component/props`),
  "preview-list": Editor.require(
    `packages://${i}/panel/component/preview-list`
  ),
  "prop-list": Editor.require(`packages://${i}/panel/component/prop-list`),
  "edit-event": Editor.require(`packages://${i}/panel/component/edit-event`),
  "edit-line": Editor.require(`packages://${i}/panel/component/edit-line`),
};

const s = Editor.require(`packages://${i}/panel/libs/manager`);
const p = Editor.require(`packages://${i}/panel/libs/advice`);
Editor.Panel.extend({
  style: t.readFileSync(
    Editor.url(`packages://${i}/panel/style/index.css`),
    "utf-8"
  ),
  template: o.template,
  listeners: {
    "panel-resize"(e) {
      e.target;

      if (this.vm) {
        this.vm.width = e.target.clientWidth;
        this.vm.height = e.target.clientHeight;
      }
    },
    "panel-show"(e) {
      e.target;

      if (this.vm) {
        this.vm.width = e.target.clientWidth;
        this.vm.height = e.target.clientHeight;
      }
    },
  },
  messages: Editor.require(`packages://${i}/panel/message`),
  ready() {
    this.vm = (function (e, t) {
      return new Vue({
        el: e,
        watch: o.watch,
        data: o.data(),
        methods: o.methods,
        components: r,
        created: o.created,
        compiled: o.compiled,
      });
    })(this.shadowRoot);

    let e = document.createElement("canvas");
    e.id = "game";
    e.style.display = "none";
    this.appendChild(e);
    this.vm.width = this.clientWidth;
    this.vm.height = this.clientHeight;
  },
  close() {
    p.removeAllListeners();
  },
  deleteTheSelectedKeys() {
    let e = this.vm.selected;
    if (!e || !e.length) {
      return;
    }
    let t = [];

    e.forEach((e) => {
      if (-1 === t.indexOf(e.path)) {
        t.push(e.path);
      }
    });

    t = t.map(
        (e) => (e.length > 40 && (e = "..." + e.substr(e.length - 37, 37)), e)
      );

    if (
      (0 !==
      Editor.Dialog.messageBox({
        type: "question",
        buttons: [
          Editor.T("timeline.shortcuts.cancel"),
          Editor.T("timeline.shortcuts.confirm_and_delete"),
        ],
        title: "",
        message: Editor.T("timeline.shortcuts.delete_keys_info"),
        detail: t.join("\n") + Editor.T("timeline.shortcuts.delete_keys_ask"),
        defaultId: 1,
        cancelId: 0,
        noLink: true,
      }))
    ) {
      for (e.forEach((e) => {
             s.Clip.deleteKey(e.id, e.path, e.component, e.property, e.frame);
           });
           e.length;
      )
      {
        e.pop();
      }
      p.emit("clip-data-update");
    }
  },
  jumpPrevFrame() {
    let e = this.vm.frame - 1;
    p.emit("select-frame", e >= 0 ? e : 0);
  },
  jumpNextFrame() {
    let e = this.vm.frame;
    p.emit("select-frame", e + 1);
  },
  jumpFirstFrame() {
    p.emit("select-frame", 0);
  },
  jumpLastFrame() {
    let e = Math.round(this.vm.duration * this.vm.sample);
    p.emit("select-frame", e);
  },
  copyTheSelectedKeys() {
    this._copyCache = [];
    let e = 1 / 0;

    this.vm.selected.forEach((t) => {
      let i = s.Clip.queryKey(t.id, t.path, t.component, t.property, t.frame);

      if (i) {
        e = Math.min(e, t.frame);

        this._copyCache.push({
          id: t.id,
          path: t.path,
          component: t.component,
          property: t.property,
          frame: t.frame,
          data: Editor.serialize(i),
        });
      }
    });

    this._copyCache.forEach((t) => {
      t.offset = t.frame - e;
    });
  },
  pasteTheCopiedKeys() {
    if (!this.vm.clip || !this._copyCache || 0 === this._copyCache.length) {
      return;
    }
    let t = this.vm.frame;
    let i = this.vm.clip.id;

    let a = this._copyCache.some(
      (e, t) => t > 0 && e.path !== this._copyCache[t - 1].path
    );

    let o = this._copyCache[0];
    if (!this._copyCache.some((t, i) => !(i < 0) && !e.contains(o.path, t.path))) {
      let t = this.vm.node.path;
      this._copyCache.forEach((i) => {
        let a = i.path.replace(o.path, "");
        i._path = e.join(t, a).replace(/\\/g, "/");
      });
    } else {
      this._copyCache.forEach((e) => {
        e._path = e.path;
      });
    }
    let r = a ? "" : this.vm.node.path;
    let n = [];

    this._copyCache.forEach((e, a) => {
      if (s.Clip.queryKey(
        i,
        r || e._path,
        e.component,
        e.property,
        e.offset + t
      )) {
        n.push(e);
      }
    });

    if (
      (n.length)
    ) {
      let e = n.map((e) => {
        let i = e.path;

        if (e.path.length > 35) {
          i = "..." + e.path.substr(e.path.length - 32, 32);
        }

        return `path: ${i}\nproperty: ${
          e.component ? e.component + "." + e.property : e.property
        } frame: ${e.offset + t}`;
      });

      if (e.length > 5) {
        e.length = 4;
        e.push("...");
      }

      if (0 ===
        Editor.Dialog.messageBox({
          type: "question",
          buttons: [
            Editor.T("timeline.shortcuts.cancel"),
            Editor.T("timeline.shortcuts.confirm_and_cover"),
          ],
          title: "",
          message: Editor.T("timeline.shortcuts.paste_keys_info"),
          detail:
            e.join("\n\n") + Editor.T("timeline.shortcuts.paste_keys_ask"),
          defaultId: 0,
          cancelId: 0,
          noLink: true,
        })) {
        return;
      }
    }
    n.forEach((e) => {
      s.Clip.deleteKey(i, r || e.path, e.component, e.property, e.offset + t);
    });
    let h = null;
    this._copyCache.forEach((e) => {
      cc.assetManager.editorExtend.loadJson(e.data, (a, o) => {
        let n = o.value;

        s.Clip.addKey(
          i,
          r || e._path,
          e.component,
          e.property,
          e.offset + t,
          n
        );

        if (o.curve) {
          s.Clip.mountCurveToKey(
            i,
            r || e._path,
            e.component,
            e.property,
            e.offset + t,
            o.curve
          );
        }

        clearTimeout(h);

        h = setTimeout(() => {
            p.emit("clip-data-update");
          }, 400);
      });
    });
  },
});
