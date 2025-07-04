"use strict";
module.exports = Editor.UI.registerElement("ui-asset", {
  get value() {
    return this._value;
  },
  set value(t) {
    if (this._value !== t) {
      this._value = t;
      this._update();
    }
  },
  get type() {
    return this._type;
  },
  set type(t) {
    let e = Editor.assettype2name[t];

    if (!e) {
      e = t;
    }

    if (this._type !== e) {
      this._type = e;
      this._update();
    }
  },
  get highlighted() {
    return null !== this.getAttribute("highlighted");
  },
  set highlighted(t) {
    if (t) {
      this.setAttribute("highlighted", "");
    } else {
      this.removeAttribute("highlighted");
    }
  },
  get invalid() {
    return null !== this.getAttribute("invalid");
  },
  set invalid(t) {
    if (t) {
      this.setAttribute("invalid", "");
    } else {
      this.removeAttribute("invalid");
    }
  },
  get multiValues() {
    return this._multiValues;
  },
  set multiValues(t) {
    t = !(null == t || false === t);
    this._multiValues = t;
    this._update();

    if (t) {
      this.setAttribute("multi-values", "");
    } else {
      this.removeAttribute("multi-values");
    }
  },
  get observedAttributes() {
    return ["type", "multi-values"];
  },
  attributeChangedCallback(t, e, i) {
    if (e !== i) {
      switch (t) {
        case "multi-values":
        case "type":
          this[
            t.replace(/\-(\w)/g, function (t, e) {
              return e.toUpperCase();
            })
          ] = i;
      }
    }
  },
  behaviors: [
    Editor.UI.Focusable,
    Editor.UI.Disable,
    Editor.UI.Readonly,
    Editor.UI.Droppable,
    Editor.UI.ButtonState,
  ],
  template:
    '\n    <div class="type">\n      <span class="type-name"></span>\n      <span class="browse">\n        <i class="icon-link-ext"></i>\n      </span>\n    </div>\n    <div class="input">\n      <div class="name"></div>\n      <span class="close">\n        <i class="icon-cancel"></i>\n      </span>\n    </div>\n  ',
  style: Editor.UI.getResource("theme://elements/asset.css"),
  $: {
    typeName: ".type-name",
    name: ".name",
    input: ".input",
    browse: ".browse",
    close: ".close",
  },
  ready() {
    this.droppable = "asset";
    this.multi = false;
    this._initFocusable([this.$name, this.$close]);
    this._initDroppable(this);
    this._initDisable(false);
    this._initReadonly(false);
    this._initButtonState(this.$name);
    this._initButtonState(this.$close);
    this._initButtonState(this.$browse);
    Editor.UI.installDownUpEvent(this.$close);
    this._dummy = null !== this.getAttribute("dummy");
    this._name = this.getAttribute("name");

    if (null === this._name) {
      this._name = "None";
    }

    this._type = this.getAttribute("type") || "asset";
    let t = Editor.assettype2name[this._type];

    if (t) {
      this._type = t;
    }

    this._value = this.getAttribute("value");
    this.multiValues = this.getAttribute("multi-values");
    this._initEvents();
    this._update();
  },
  _initEvents() {
    this.addEventListener("mousedown", (t) => {
      Editor.UI.acceptEvent(t);
      Editor.UI.focus(this);
    });

    this.addEventListener(
      "drop-area-enter",
      this._onDropAreaEnter.bind(this)
    );

    this.addEventListener(
      "drop-area-leave",
      this._onDropAreaLeave.bind(this)
    );

    this.addEventListener(
      "drop-area-accept",
      this._onDropAreaAccept.bind(this)
    );

    this.addEventListener("drop-area-move", this._onDropAreaMove.bind(this));
  },
  _update() {
    return this._dummy
      ? ((this.$typeName.textContent = this._type),
        (this.$name.textContent = this._name),
        (this._needUpdated = false),
        void 0)
      : this._multiValues
      ? (this.setAttribute("empty", ""),
        (this.$name.textContent = "Difference"),
        (this._needUpdated = false),
        void 0)
      : this.value
      ? (this.removeAttribute("empty"),
        (this._needUpdated = true),
        Editor.assetdb.queryUrlByUuid(this.value, (t, e) => {
          if (!this._needUpdated) {
            return;
          }
          const i = require("fire-url");
          if (!e) {
            this.setAttribute("missing", "");
            this._name = "Missing Reference...";
            this.$typeName.textContent = this._type;
            this.$name.textContent = this._name;
            return;
          }
          this._name = i.basenameNoExt(e);
          this.removeAttribute("missing");
          this.$typeName.textContent = this._type;
          this.$name.textContent = this._name;
        }),
        void 0)
      : ((this._name = "None"),
        this.setAttribute("empty", ""),
        (this.$typeName.textContent = this._type),
        (this.$name.textContent = this._name),
        (this._needUpdated = false),
        void 0);
  },
  _onButtonClick(t) {
    if (t === this.$name) {
      Editor.Ipc.sendToAll("assets:hint", this.value);
    }

    if (
      (t === this.$browse)
    ) {
      let t = this.type;

      if ("script" === t) {
        t = "javascript,typescript";
      }

      Editor.UI.fire(this, "search-asset");
      Editor.Ipc.sendToPanel("assets", "assets:search", `t:${t}`);
    }

    if (!this.readonly) {
      if (t === this.$close) {
        this.value = "";

        setTimeout(() => {
          Editor.UI.fire(this, "change", {
            bubbles: true,
            detail: { value: this.value },
          });

          Editor.UI.fire(this, "confirm", {
            bubbles: true,
            detail: { value: this.value },
          });
        }, 1);
      }
    }
  },
  _isTypeValid(t) {
    return (
      t === this.type ||
      cc.js.isChildClassOf(Editor.assets[t], Editor.assets[this.type])
    );
  },
  _onDropAreaMove(t) {
    t.stopPropagation();

    if (this.highlighted) {
      if (this.invalid) {
        Editor.UI.DragDrop.updateDropEffect(t.detail.dataTransfer, "none");
      } else {
        Editor.UI.DragDrop.updateDropEffect(t.detail.dataTransfer, "copy");
      }
    } else {
      Editor.UI.DragDrop.updateDropEffect(t.detail.dataTransfer, "none");
    }
  },
  _onDropAreaEnter(t) {
    t.stopPropagation();
    let e = t.detail.dragItems;

    if (this._requestID) {
      Editor.Ipc.cancelRequest(this._requestID);
      this._requestID = null;
    }

    let i = e[0].id;
    this.invalid = true;

    this._requestID = Editor.assetdb.queryMetaInfoByUuid(i, (t, e) => {
      this._requestID = null;
      this.highlighted = true;
      this._cacheUuid = i;
      this.invalid = !this._isTypeValid(e.assetType);
      if (!this.invalid) {
        return;
      }
      let s = JSON.parse(e.json);
      let a = Object.keys(s.subMetas);
      if (1 !== a.length) {
        return;
      }
      let n = s.subMetas[a[0]].uuid;

      this._requestID = Editor.assetdb.queryInfoByUuid(n, (t, e) => {
        this._cacheUuid = n;
        this.invalid = !this._isTypeValid(e.type);
      });
    });
  },
  _onDropAreaLeave(t) {
    t.stopPropagation();

    if (this._requestID) {
      Editor.Ipc.cancelRequest(this._requestID);
      this._requestID = null;
    }

    this.highlighted = false;
    this.invalid = false;
  },
  _onDropAreaAccept(t) {
    t.stopPropagation();

    if (this._requestID) {
      Editor.Ipc.cancelRequest(this._requestID);
      this._requestID = null;
    }

    this.highlighted = false;
    this.invalid = false;
    this.updateValue(this._cacheUuid);
  },
  updateValue(t) {
    this.value = t;
    this._cacheUuid = t;
    Editor.UI.fire(this, "change", { bubbles: true, detail: { value: t } });
    Editor.UI.fire(this, "confirm", { bubbles: true, detail: { value: t } });
  },
});
