"use strict";
let e;
const t = require("chroma-js");
const i = Editor.UI._ResMgr;
const s = Editor.UI._DomUtils;
const a = Editor.UI._FocusMgr;
const r = Editor.UI.Focusable;
const n = Editor.UI.Disable;
const o = Editor.UI.Readonly;

module.exports = Editor.UI.registerElement("ui-gradient", {
  get value() {
    const e = this.getAttribute("value");
    if (!e) {
      return e;
    }
    try {
      return JSON.parse(e);
    } catch (e) {
      console.warn(e);
      return null;
    }
  },
  set value(e) {
    if (!e) {
      this.removeAttribute("value");
      return;
    }

    if ("object" != typeof e) {
      e = { alpha: [], color: [] };
    }

    try {
      this.setAttribute("value", JSON.stringify(e));
    } catch (e) {
      console.warn(e);
      this.removeAttribute("value");
    }
  },
  behaviors: [r, n, o],
  template:
    '\n    <div class="color-wrap">\n        <div class="color"></div>\n    </div>\n    ',
  style: i.getResource("theme://elements/gradient.css"),
  $: { colorWrap: ".color-wrap", color: ".color" },
  factoryImpl(e) {
    if (e) {
      this.value = e;
    }
  },
  ready() {
    this._showing = false;
    this._initFocusable(this);
    this._initDisable(false);
    this._initReadonly(false);
    this._initEvents();

    if (!e) {
      (e = document.createElement("ui-gradient-picker")).style.position = "fixed";
      e.style.zIndex = 999;
      e.style.display = "none";
    }
  },
  detachedCallback() {
    this._showGradientPicker(false);
  },
  _initEvents() {
    this.addEventListener("mousedown", (t) => {
      if (!this.disabled) {
        s.acceptEvent(t);
        a._setFocusElement(this);

        if (!this.readonly) {
          if (this._showing) {
            this._showGradientPicker(false);
          } else {
            e.value = this.value;
            this._showGradientPicker(true);
          }
        }
      }
    });

    this.addEventListener("keydown", (t) => {
      if (!(this.readonly ||
        this.disabled || (13 !== t.keyCode && 32 !== t.keyCode))) {
        s.acceptEvent(t);
        e.value = this.value;
        this._showGradientPicker(true);
      }
    });

    this._hideFn = (e) => {
      if (this._changed) {
        this._changed = false;

        if (e.detail.confirm) {
          this._initValue = this.value;

          s.fire(this, "confirm", {
            bubbles: true,
            detail: { value: this.value },
          });
        } else {
          if (this._initValue !== this.value) {
            this.value = this._initValue;

            s.fire(this, "change", {
              bubbles: true,
              detail: { value: this.value },
            });
          }

          s.fire(this, "cancel", {
            bubbles: true,
            detail: { value: this.value },
          });
        }
      }

      this._showGradientPicker(false);
    };

    this._changeFn = (e) => {
      this._changed = true;
      this.multiValues = false;
      s.acceptEvent(e);
      this.value = e.detail.value;

      s.fire(this, "change", {
        bubbles: true,
        detail: { value: this.value },
      });
    };
  },
  get observedAttributes() {
    return ["focused", "readonly", "disabled", "invalid", "value"];
  },
  attributeChangedCallback(e, t, i) {
    if (t !== i) {
      switch (e) {
        case "invalid":
          this._updateColor();
          break;
        case "value":
          this.invalid = false;
          this._updateColor();
      }
    }
  },
  _updateColor() {
    const e = this.invalid
        ? { color: [], alpha: [] }
        : this.value || { color: [], alpha: [] };

    const t = e.alpha || [{ value: 1, progress: 0 }];
    const i = e.color || [{ value: "#ffffff", progress: 0 }];

    const s = (this._map = {
      0: { r: 255, g: 255, b: 255, a: 255 },
      1: { r: 255, g: 255, b: 255, a: 255 },
    });

    t.forEach((e, i) => {
      (s[e.progress] = s[e.progress] || {}).a = (255 * e.value) | 0;

      if (i === t.length - 1) {
        s[1].a = (255 * e.value) | 0;
      }

      if (0 === i) {
        s[0].a = (255 * e.value) | 0;
      }
    });

    i.forEach((e, t) => {
      const a = this._convertToRGB(e.value);
      const r = (s[e.progress] = s[e.progress] || {});
      r.r = a[0];
      r.g = a[1];
      r.b = a[2];

      if (t === i.length - 1) {
        s[1].r = a[0];
        s[1].g = a[1];
        s[1].b = a[2];
      }

      if (0 === t) {
        s[0].r = a[0];
        s[0].g = a[1];
        s[0].b = a[2];
      }
    });

    const a = Object.keys(s).sort();
    function r(e, t) {
      const i = a[e];
      let r;
      let n;
      let o;
      r = e;
      do {
        n = s[a[(r -= 1)]];
      } while (void 0 === n[t]);
      r = e;
      do {
        o = s[a[(r += 1)]];
      } while (void 0 === o[t]);
      const l = (i - a[e - 1]) / (a[e + 1] - a[e - 1]);
      return (o[t] - n[t]) * l + n[t];
    }
    let n = "linear-gradient(to right";

    a.forEach((e, t) => {
      const i = s[e];

      if (void 0 === i.r) {
        i.r = Math.round(r(t, "r"));
      }

      if (void 0 === i.g) {
        i.g = Math.round(r(t, "g"));
      }

      if (void 0 === i.b) {
        i.b = Math.round(r(t, "b"));
      }

      if (void 0 === i.a) {
        i.a = Math.round(r(t, "a"));
      }

      i.progress = e;
    });

    a.forEach((e, t) => {
      const i = s[e];

      n += `, rgba(${i.r}, ${i.g}, ${i.b}, ${i.a / 255}) ${
          (100 * e) | 0
        }%`;

      if (
        (this.fixed && a[t + 1])
      ) {
        const i = s[a[t + 1]];
        n += `, rgb(${i.r}, ${i.g}, ${i.b}, ${i.a / 255}) ${
          ((100 * e) | 0) - 0.01
        }%`;
      }
      i.progress = e;
    });

    n += ")";
    this.$color.style.background = n;
  },
  _convertToRGB(e) {
    let i;
    return (i = "string" == typeof e ? t(e).rgb() : [e.r, e.g, e.b]);
  },
  _emitConfirm() {
    s.fire(this, "confirm", { bubbles: true, detail: { value: this.value } });
  },
  _emitCancel() {
    s.fire(this, "cancel", { bubbles: true, detail: { value: this.value } });
  },
  _emitChange() {
    s.fire(this, "change", { bubbles: true, detail: { value: this.value } });
  },
  _showGradientPicker(t) {
    if (this._showing !== t) {
      this._showing = t;

      if (t) {
        this._initValue = this.value;
        e.addEventListener("hide", this._hideFn);
        e.addEventListener("change", this._changeFn);
        e.addEventListener("confirm", this._confirmFn);
        e.addEventListener("cancel", this._cancelFn);

        s.addHitGhost("default", 998, () => {
          e.hide(true);
        });

        document.body.appendChild(e);
        e._target = this;
        e.style.display = "block";
        this._updateGradientPickerPosition();
        a._setFocusElement(e);
      } else {
        e.removeEventListener("hide", this._hideFn);
        e.removeEventListener("change", this._changeFn);
        e.removeEventListener("confirm", this._confirmFn);
        e.removeEventListener("cancel", this._cancelFn);
        s.removeHitGhost();
        e._target = null;
        e.remove();
        e.style.display = "none";
        a._setFocusElement(this);
      }
    }
  },
  _updateGradientPickerPosition() {
    window.requestAnimationFrame(() => {
      if (!this._showing) {
        return;
      }
      let t = document.body.getBoundingClientRect();
      let i = this.getBoundingClientRect();
      let s = e.getBoundingClientRect();
      let a = e.style;
      a.left = i.right - s.width + "px";

      if (t.height - i.bottom <= s.height + 10) {
        a.top = t.bottom - s.height - 10 + "px";
      } else {
        a.top = i.bottom - t.top + 10 + "px";
      }

      if (t.width - i.left <= s.width) {
        a.left = t.right - s.width - 10 + "px";
      } else {
        a.left = i.left - t.left + "px";
      }

      this._updateGradientPickerPosition();
    });
  },
});
