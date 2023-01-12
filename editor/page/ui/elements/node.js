"use strict";
module.exports = Editor.UI.registerElement("ui-node", {
  get value() {
    return this._value;
  },
  set value(t) {
    this._value !== t && ((this._value = t), this._update());
  },
  get values() {
    return this._values;
  },
  set values(t) {
    return (this._values = t);
  },
  get typename() {
    return this._typename;
  },
  set typename(t) {
    this._typename !== t &&
      ((this._typename = t), (this.$typeName.textContent = this._typename));
  },
  get type() {
    return this._type;
  },
  set type(t) {
    this._type !== t && ((this._type = t), this._update());
  },
  get highlighted() {
    return null !== this.getAttribute("highlighted");
  },
  set highlighted(t) {
    t
      ? this.setAttribute("highlighted", "")
      : this.removeAttribute("highlighted");
  },
  get invalid() {
    return null !== this.getAttribute("invalid");
  },
  set invalid(t) {
    t ? this.setAttribute("invalid", "") : this.removeAttribute("invalid");
  },
  get multiValues() {
    return this._multiValues;
  },
  set multiValues(t) {
    (t = !(null == t || !1 === t)),
      (this._multiValues = t),
      t
        ? this.setAttribute("multi-values", "")
        : this.removeAttribute("multi-values"),
      this._update();
  },
  get observedAttributes() {
    return ["type", "typename", "multi-values"];
  },
  attributeChangedCallback(t, e, i) {
    if (e !== i)
      switch (t) {
        case "multi-values":
        case "typename":
        case "type":
          this[
            t.replace(/\-(\w)/g, function (t, e) {
              return e.toUpperCase();
            })
          ] = i;
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
    '\n    <div class="type">\n      <span class="mark"></span>\n      <span class="type-name"></span>\n      <span class="browse">\n        <i class="icon-link-ext"></i>\n      </span>\n    </div>\n    <div class="input">\n      <div class="name"></div>\n      <span class="close">\n        <i class="icon-cancel"></i>\n      </span>\n    </div>\n  ',
  style: Editor.UI.getResource("theme://elements/node.css"),
  $: {
    typeName: ".type-name",
    name: ".name",
    input: ".input",
    browse: ".browse",
    close: ".close",
  },
  ready() {
    (this.droppable = "node,component"),
      (this.multi = !1),
      this._initFocusable([this.$name, this.$close]),
      this._initDroppable(this),
      this._initDisable(!1),
      this._initReadonly(!1),
      this._initButtonState(this.$name),
      this._initButtonState(this.$close),
      this._initButtonState(this.$browse),
      Editor.UI.installDownUpEvent(this.$close),
      (this._dummy = null !== this.getAttribute("dummy")),
      (this._name = this.getAttribute("name")),
      null === this._name && (this._name = "None"),
      (this._cachename = this._name),
      (this._type = this.getAttribute("type") || "cc.Node"),
      (this._typename = this.getAttribute("typename") || "cc.Node"),
      (this._value = this.getAttribute("value")),
      (this._cacheTypename = this._typename),
      (this._cacheID = null),
      (this.multiValues = this.getAttribute("multi-values")),
      this._initEvents(),
      this._update();
  },
  _initEvents() {
    this.addEventListener("mousedown", (t) => {
      Editor.UI.acceptEvent(t), Editor.UI.focus(this);
    }),
      this.addEventListener(
        "drop-area-enter",
        this._onDropAreaEnter.bind(this)
      ),
      this.addEventListener(
        "drop-area-leave",
        this._onDropAreaLeave.bind(this)
      ),
      this.addEventListener(
        "drop-area-accept",
        this._onDropAreaAccept.bind(this)
      ),
      this.addEventListener("drop-area-move", this._onDropAreaMove.bind(this));
  },
  _getComponentByType(t, e, i) {
    const s = i.compIDList;
    if (0 === s.length) return;
    let n;
    if ("cc.Component" === e)
      return (n = s.find((e) => e.id === t)) || (n = s[0]), n;
    let a = [];
    if (
      (a =
        "cc.Node" === e
          ? s
              .map((t) => {
                if (t.typename === e) return t;
              })
              .filter(Boolean)
          : s
              .map((t) => {
                if (t.cid === e) return t;
              })
              .filter(Boolean)).length > 0
    ) {
      if (((n = a.find((e) => e.id === t)), i.nodeID && t === i.nodeID))
        return a[0];
      n = a.find((e) => e.id === t);
    }
    return n;
  },
  _update() {
    return this._dummy
      ? ((this.$typeName.textContent = this._typename),
        (this.$name.textContent = this._name),
        (this._needUpdated = !1),
        void 0)
      : this.multiValues
      ? (this.setAttribute("empty", ""),
        (this.$name.textContent = "Difference"),
        (this._needUpdated = !1),
        void 0)
      : this.value
      ? (this.removeAttribute("empty"),
        this._requestID &&
          (Editor.Ipc.cancelRequest(this._requestID), (this._requestID = null)),
        (this._needUpdated = !0),
        (this._requestID = Editor.Ipc.sendToPanel(
          "scene",
          "scene:query-node-info",
          this.value,
          this.type,
          (t, e) => {
            if (this._needUpdated) {
              if (t) return console.log(`${t.ipc} ${t.code}`), void 0;
              if (((this._requestID = null), e.missed))
                return (
                  this.setAttribute("missing", ""),
                  (this._name = "Missing Reference..."),
                  (this.$typeName.textContent = this._typename),
                  (this.$name.textContent = this._name),
                  void 0
                );
              if ("cc.Node" !== this.type) {
                let t = this._getComponentByType(this.value, this.type, e);
                t &&
                  ((this._name = t.name),
                  t.typename.startsWith("cc.") &&
                    (this._typename = t.typename.slice(3)));
              } else (this._name = e.name), (this._nodeID = e.nodeID);
              this.hasAttribute("missing") &&
                (this.removeAttribute("missing"),
                (this.$typeName.textContent = this._typename)),
                (this.$name.textContent = this._name);
            }
          },
          5e3
        )),
        void 0)
      : ((this._name = "None"),
        this.setAttribute("empty", ""),
        (this.$typeName.textContent = this._typename),
        (this.$name.textContent = this._name),
        (this._needUpdated = !1),
        void 0);
  },
  _onButtonClick(t) {
    t === this.$name && Editor.Ipc.sendToAll("hierarchy:hint", this._nodeID),
      t === this.$browse &&
        (Editor.UI.fire(this, "filter-node"),
        Editor.Ipc.sendToPanel("hierarchy", "filter", `t:${this.type}`)),
      this.readonly ||
        (t === this.$close &&
          ((this.value = ""),
          setTimeout(() => {
            Editor.UI.fire(this, "change", {
              bubbles: !0,
              detail: { value: this.value },
            }),
              Editor.UI.fire(this, "confirm", {
                bubbles: !0,
                detail: { value: this.value },
              });
          }, 1)));
  },
  _onDropAreaMove(t) {
    t.stopPropagation(),
      this.highlighted
        ? this.invalid
          ? Editor.UI.DragDrop.updateDropEffect(t.detail.dataTransfer, "none")
          : Editor.UI.DragDrop.updateDropEffect(t.detail.dataTransfer, "copy")
        : Editor.UI.DragDrop.updateDropEffect(t.detail.dataTransfer, "none");
  },
  _onDropAreaEnter(t) {
    t.stopPropagation();
    let e = t.detail.dragItems;
    this._requestID &&
      (Editor.Ipc.cancelRequest(this._requestID), (this._requestID = null)),
      (this.invalid = !0),
      (this._requestID = Editor.Ipc.sendToPanel(
        "scene",
        "scene:query-node-info",
        e[0].id,
        this.type,
        (t, i) => {
          if (
            ((this._requestID = null),
            (this.highlighted = !0),
            "cc.Node" !== this.type)
          ) {
            let t = this._getComponentByType(e[0].id, this.type, i);
            t &&
              ((this._cacheID = t.id),
              (this._cachename = t.name),
              t.typename.startsWith("cc.") &&
                (this._cacheTypename = t.typename.slice(3)),
              (this.invalid = !1));
          } else
            i.nodeID &&
              ((this._cacheID = i.nodeID),
              (this._cachename = i.name),
              (this._cacheTypename = "Node"),
              (this.invalid = !1));
        }
      ));
  },
  _onDropAreaLeave(t) {
    t.stopPropagation(),
      this._requestID &&
        (Editor.Ipc.cancelRequest(this._requestID), (this._requestID = null)),
      (this.highlighted = !1),
      (this.invalid = !1);
  },
  _onDropAreaAccept(t) {
    t.stopPropagation(),
      this._requestID &&
        (Editor.Ipc.cancelRequest(this._requestID), (this._requestID = null)),
      (this.highlighted = !1),
      (this.invalid = !1),
      (this.value = this._cacheID),
      (this._cacheID = null),
      (this.name = this._cachename),
      (this.typename = this._cacheTypename),
      Editor.UI.fire(this, "change", {
        bubbles: !0,
        detail: { value: this.value },
      }),
      Editor.UI.fire(this, "confirm", {
        bubbles: !0,
        detail: { value: this.value },
      });
  },
  updateValue(t) {
    Editor.Ipc.sendToPanel(
      "scene",
      "scene:query-node-info",
      t,
      this.type,
      (t, e) => {
        !t &&
          e.compID &&
          ((this.value = e.compID),
          (this._cacheID = null),
          Editor.UI.fire(this, "change", {
            bubbles: !0,
            detail: { value: this.value },
          }),
          Editor.UI.fire(this, "confirm", {
            bubbles: !0,
            detail: { value: this.value },
          }));
      }
    );
  },
});
