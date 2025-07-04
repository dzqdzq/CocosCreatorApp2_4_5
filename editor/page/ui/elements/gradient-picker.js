"use strict";
const t = require("chroma-js");
const e = Editor.UI._ResMgr;
const o = Editor.UI._DomUtils;
const r = Editor.UI.Focusable;

module.exports = Editor.UI.registerElement("ui-gradient-picker", {
  get value() {
    return this._value;
  },
  set value(t) {
    if (!t) {
      this.removeAttribute("value");
      return;
    }

    if ("object" != typeof t) {
      t = { alpha: [], color: [] };
    }

    try {
      this.setAttribute("value", JSON.stringify(t));
    } catch (t) {
      console.warn(t);
      this.removeAttribute("value");
    }
  },
  get fixed() {
    return null !== this.getAttribute("fixed");
  },
  set fixed(t) {
    if (t) {
      this.setAttribute("fixed", "");
    } else {
      this.removeAttribute("fixed");
    }

    this._updateAlpha();
    this._updateAlphaKeys();
    this._updateColor();
    this._updateColorKeys();
    this._updateHybrid();
  },
  behaviors: [r],
  template:
    '\n        <section>\n            <div class="preview">\n                <div class="alpha">\n                    <div class="keys"></div>\n                    <div class="background"></div>\n                </div>\n                <div class="hybrid">\n                    <div class="background"></div>\n                </div>\n                <div class="color">\n                    <div class="keys"></div>\n                    <div class="background"></div>\n                </div>\n            </div>\n\n            <div class="operation">\n                <div class="global">\n                    <div>\n                        <strong>Mode</strong>\n                        <ui-select disabled value="0">\n                            <option value="0">Blend</option>\n                            <option value="1">Fixed</option>\n                        </ui-select>\n                    </div>\n                </div>\n                <div class="key">\n                    <div>\n                        <strong>Location</strong>\n                        <ui-num-input unit="%" class="location" min="0" max="100"></ui-num-input>\n                    </div>\n                </div>\n            </div>\n\n            <div class="operation">\n                <ui-color-picker class="color" row disabled-color disabled-alpha></ui-color-picker>\n            </div>\n        </section>\n    ',
  style: e.getResource("theme://elements/gradient-picker.css"),
  $: {
    preview: ".preview",
    previewHybrid: ".preview .hybrid .background",
    previewAlpha: ".preview .alpha .background",
    previewColor: ".preview .color .background",
    alphas: ".preview .alpha .keys",
    colors: ".preview .color .keys",
    location: ".location",
    color: ".operation .color",
  },
  factoryImpl(t) {
    if (t) {
      this.value = t;
    }
  },
  ready() {
    this._map = {};
    this._value = {};
    this.activeOrbital = null;
    this.activeProgress = null;

    this.$color.$root = this.$previewAlpha.$root =
    this.$previewColor.$root =
    this.$location.$root =
    this.$preview.$root =
      this;

    this._initFocusable(this);
    this._initEvents();
  },
  hide(t) {
    o.fire(this, "hide", { bubbles: false, detail: { confirm: t } });
  },
  _initEvents() {
    this.addEventListener("focus", this._onFocus);
    this.addEventListener("blur", this._onBlur);
    this.$preview.addEventListener("mouseup", this._onPreviewMouseDown, true);
    this.$location.addEventListener("change", this._onLocationChange);
    this.$color.addEventListener("change", this._onColorChange);
    this.$previewAlpha.addEventListener("click", this._onAlphaClick);
    this.$previewColor.addEventListener("click", this._onColorClick);
  },
  get observedAttributes() {
    return [
      "disabled",
      "value",
      "invalid",
      "placeholder",
      "readonly",
      "password",
    ];
  },
  attributeChangedCallback(t, e, o) {
    switch (t) {
      case "invalid":
        requestAnimationFrame(() => {
          this._updateHybrid();
        });
        break;
      case "value":
        this.invalid = false;
        if (o) {
          try {
            this._value = JSON.parse(o);
          } catch (t) {
            console.warn(t);
            this.value = null;
          }
        } else {
          this._value = {};
        }
        requestAnimationFrame(() => {
          this._updateAlpha();
          this._updateAlphaKeys();
          this._updateColor();
          this._updateColorKeys();
          this._updateHybrid();
        });
    }
  },
  _onFocus() {},
  _onBlur() {
    this._emitConfirm();
  },
  _onPreviewMouseDown(t) {
    let e = t.offsetX;
    let o = t.target;
    for (; o !== this.$root.$preview; ) {
      e += o.offsetLeft;
      o = o.offsetParent;
    }

    this.$root._location = Math.min(
      Math.max((e - 20) / (this.$root.$preview.clientWidth - 40), 0),
      1
    );
  },
  _onLocationChange(t) {
    if ("alpha" === this.$root.activeOrbital) {
      this.$root._value.alpha.some((e) => {
            if (e.progress !== this.$root.activeProgress) {
              return false;
            }
            this.$root.activeProgress = e.progress = t.target.value / 100;
          });

      this.$root._value.alpha.sort((t, e) => t.progress - e.progress);
      this.$root._updateAlpha();
      this.$root._updateAlphaKeys();
      this.$root._updateHybrid();
    } else {
      if ("color" === this.$root.activeOrbital) {
        this.$root._value.color.some((e) => {
              if (e.progress !== this.$root.activeProgress) {
                return false;
              }
              this.$root.activeProgress = e.progress = t.target.value / 100;
            });

        this.$root._value.color.sort((t, e) => t.progress - e.progress);
        this.$root._updateColor();
        this.$root._updateColorKeys();
        this.$root._updateHybrid();
      }
    }
  },
  _onColorChange(e) {
    e.stopPropagation();

    if ("color" === this.$root.activeOrbital) {
      this.$root._value.color.some((o) => {
            if (o.progress !== this.$root.activeProgress) {
              return false;
            }
            o.value = t(e.target.value, "rgb").hex();
          });

      this.$root._updateColor();
      this.$root._updateColorKeys();
    } else {
      if ("alpha" === this.$root.activeOrbital) {
        this.$root._value.alpha.some((t) => {
              if (t.progress !== this.$root.activeProgress) {
                return false;
              }
              t.value = e.target.value[3] / 255;
            });

        this.$root._updateAlpha();
        this.$root._updateAlphaKeys();
      }
    }

    this.$root._updateHybrid();
  },
  _onAlphaClick(t) {
    const e = { value: 1, progress: this.$root._location };
    this.$root._value.alpha = this.$root._value.alpha || [];
    this.$root._value.alpha.push(e);
    this.$root._value.alpha.sort((t, e) => t.progress - e.progress);
    this.$root.setAttribute("value", JSON.stringify(this.$root._value));
    this.$root._updateActive("alpha", e);
  },
  _onColorClick(t) {
    const e = {
      value: { r: 255, g: 255, b: 255 },
      progress: this.$root._location,
    };
    this.$root._value.color = this.$root._value.color || [];
    this.$root._value.color.push(e);
    this.$root._value.color.sort((t, e) => t.progress - e.progress);
    this.$root.setAttribute("value", JSON.stringify(this.$root._value));
    this.$root._updateActive("color", e);
  },
  _onAlphaKeyMouseDown(t) {
    const e = t.pageX;
    const o = t.pageY;
    const r = this.getAttribute("index");
    const i = this.$root._value.alpha[r];
    const s = "SPAN" === t.target.tagName ? t.target.parentElement : t.target;
    const a = parseInt(s.style.left);
    const l = i.progress;
    this.$root._updateActive("alpha", i);

    const h = (t) => {
      const r = (t.pageX - e) / (this.$root.$preview.clientWidth - 40);
      i.progress = Math.min(Math.max(l + r, 0), 1);

      s.style.left = Math.min(
        Math.max(a + (t.pageX - e), 0),
        this.$root.$preview.clientWidth - 40
      ) + "px";

      const h = this.$root._value.alpha.indexOf(i);

      if (Math.abs(t.pageY - o) > 20) {
        if (-1 !== h) {
          this.$root._value.alpha.splice(h, 1);
          s.hidden = true;
          this.$root._updateActive("", null);
        }
      } else {
        if (-1 === h) {
          this.$root._value.alpha.push(i);
          s.hidden = false;
          this.$root._updateActive("alpha", i);
        }
      }

      this.$root._value.alpha.sort((t, e) => t.progress - e.progress);
      this.$root._updateAlpha();
      this.$root._updateHybrid();
    };

    const n = (t) => {
      document.removeEventListener("mousemove", h);
      document.removeEventListener("mouseup", n);
      const r = this.$root._value.alpha.indexOf(i);
      this.$root.setAttribute("value", JSON.stringify(this.$root._value));

      if (t.pageX - e == 0 &&
        t.pageY - o == 0 &&
        -1 !== r) {
        this.$root._updateActive("alpha", i);
      }
    };

    document.addEventListener("mousemove", h);
    document.addEventListener("mouseup", n);
  },
  _onColorKeyMouseDown(t) {
    const e = t.pageX;
    const o = t.pageY;
    const r = this.getAttribute("index");
    const i = this.$root._value.color[r];
    const s = "SPAN" === t.target.tagName ? t.target.parentElement : t.target;
    const a = parseInt(s.style.left);
    const l = i.progress;
    this.$root._updateActive("color", i);

    const h = (t) => {
      const r = (t.pageX - e) / (this.$root.$preview.clientWidth - 40);
      i.progress = Math.min(Math.max(l + r, 0), 1);

      s.style.left = Math.min(
        Math.max(a + (t.pageX - e), 0),
        this.$root.$preview.clientWidth - 40
      ) + "px";

      const h = this.$root._value.color.indexOf(i);

      if (Math.abs(t.pageY - o) > 20) {
        if (-1 !== h) {
          this.$root._value.color.splice(h, 1);
          s.hidden = true;
          this.$root._updateActive("", null);
        }
      } else {
        if (-1 === h) {
          this.$root._value.color.push(i);
          s.hidden = false;
          this.$root._updateActive("color", i);
        }
      }

      this.$root._value.color.sort((t, e) => t.progress - e.progress);
      this.$root._updateColor();
      this.$root._updateHybrid();
    };

    const n = () => {
      document.removeEventListener("mousemove", h);
      document.removeEventListener("mouseup", n);
      const r = this.$root._value.color.indexOf(i);
      this.$root.setAttribute("value", JSON.stringify(this.$root._value));

      if (t.pageX - e == 0 &&
        t.pageY - o == 0 &&
        -1 !== r) {
        this.$root._updateActive("color", i);
      }
    };

    document.addEventListener("mousemove", h);
    document.addEventListener("mouseup", n);
  },
  _mountAlphaKeysEvent() {
    this.$alphas.querySelectorAll("div").forEach((t) => {
      t.$root = this;
      t.addEventListener("mousedown", this._onAlphaKeyMouseDown);
    });
  },
  _mountColorKeysEvent() {
    this.$colors.querySelectorAll("div").forEach((t) => {
      t.$root = this;
      t.addEventListener("mousedown", this._onColorKeyMouseDown);
    });
  },
  _updateColor() {
    const t = this.invalid
      ? { color: [], alpha: [] }
      : this.value || { color: [], alpha: [] };
    let e = "";

    if (t.color &&
      t.color.length) {
      e = "linear-gradient(to right";

      t.color.forEach((o, r) => {
        let i = this._convertToRGB(o.value);

        if (0 === r &&
            0 !== o.progress) {
          e += `, rgb(${i[0]}, ${i[1]}, ${i[2]}) 0%`;
        }

        e += `, rgb(${i[0]}, ${i[1]}, ${i[2]}) ${(100 * o.progress) | 0}%`;
        if (
          (this.fixed && t.color[r + 1])
        ) {
          const i = this._convertToRGB(t.color[r + 1].value);
          e += `, rgb(${i[0]}, ${i[1]}, ${i[2]}) ${
            ((100 * o.progress) | 0) - 0.01
          }%`;
        }

        if (r === t.color.length - 1 &&
          1 !== o.progress) {
          e += `, rgb(${i[0]}, ${i[1]}, ${i[2]}) 100%`;
        }
      });

      e += ")";
    }

    this.$previewColor.style.background = e;
  },
  _updateColorKeys() {
    const t = this.invalid
      ? { color: [], alpha: [] }
      : this.value || { color: [], alpha: [] };
    let e = "";

    if (t.color) {
      t.color.forEach((t, o) => {
        const r = this._convertToRGB(t.value);

        const i = "color" === this.activeOrbital &&
        this.activeProgress === t.progress;

        e += `<div index="${o}" ${i ? "focused" : ""} style="left: ${
          t.progress * this.$colors.clientWidth
        }px;"><span style="background: rgb(${r[0]}, ${r[1]}, ${
          r[2]
        })"></span></div>`;
      });
    }

    this.$colors.innerHTML = e;
    this._mountColorKeysEvent();
  },
  _updateAlpha() {
    const t = this.invalid
      ? { color: [], alpha: [] }
      : this.value || { color: [], alpha: [] };
    let e = "";

    if (t.alpha &&
      t.alpha.length) {
      e = "linear-gradient(to right";

      t.alpha.forEach((o, r) => {
        if (0 === r &&
          0 !== o.progress) {
          e += `, rgba(255,255,255,${o.value}) 0%`;
        }

        e += `, rgba(255,255,255,${o.value}) ${(100 * o.progress) | 0}%`;

        if (this.fixed &&
          t.alpha[r + 1]) {
          e += `, rgba(255,255,255,${t.alpha[r + 1].value}) ${
              ((100 * o.progress) | 0) - 0.01
            }%`;
        }

        if (r === t.alpha.length - 1 &&
          1 !== o.progress) {
          e += `, rgba(255,255,255,${o.value}) 100%`;
        }
      });

      e += ")";
    }

    this.$previewAlpha.style.background = e;
  },
  _updateAlphaKeys() {
    const t = this.invalid
      ? { color: [], alpha: [] }
      : this.value || { color: [], alpha: [] };
    let e = "";

    if (t.alpha) {
      t.alpha.forEach((t, o) => {
        const r = 255 * t.value;

        const i = "alpha" === this.activeOrbital &&
        this.activeProgress === t.progress;

        e += `<div index="${o}" ${i ? "focused" : ""} style="left: ${
          t.progress * this.$alphas.clientWidth
        }px;"><span style="background: rgb(${r}, ${r}, ${r})"></span></div>`;
      });
    }

    this.$alphas.innerHTML = e;
    this._mountAlphaKeysEvent();
  },
  _updateHybrid() {
    const t = this.invalid
        ? { color: [], alpha: [] }
        : this.value || { color: [], alpha: [] };

    const e = t.alpha || [{ value: 1, progress: 0 }];
    const o = t.color || [{ value: "#ffffff", progress: 0 }];

    const r = (this._map = {
      0: { r: 255, g: 255, b: 255, a: 255 },
      1: { r: 255, g: 255, b: 255, a: 255 },
    });

    e.forEach((t, o) => {
      (r[t.progress] = r[t.progress] || {}).a = (255 * t.value) | 0;

      if (o === e.length - 1) {
        r[1].a = (255 * t.value) | 0;
      }

      if (0 === o) {
        r[0].a = (255 * t.value) | 0;
      }
    });

    o.forEach((t, e) => {
      const i = this._convertToRGB(t.value);
      const s = (r[t.progress] = r[t.progress] || {});
      s.r = i[0];
      s.g = i[1];
      s.b = i[2];

      if (e === o.length - 1) {
        r[1].r = i[0];
        r[1].g = i[1];
        r[1].b = i[2];
      }

      if (0 === e) {
        r[0].r = i[0];
        r[0].g = i[1];
        r[0].b = i[2];
      }
    });

    const i = Object.keys(r).sort();
    function s(t, e) {
      const o = i[t];
      let s;
      let a;
      let l;
      s = t;
      do {
        a = r[i[(s -= 1)]];
      } while (void 0 === a[e]);
      s = t;
      do {
        l = r[i[(s += 1)]];
      } while (void 0 === l[e]);
      const h = (o - i[t - 1]) / (i[t + 1] - i[t - 1]);
      return (l[e] - a[e]) * h + a[e];
    }
    let a = "linear-gradient(to right";

    i.forEach((t, e) => {
      const o = r[t];

      if (void 0 === o.r) {
        o.r = Math.round(s(e, "r"));
      }

      if (void 0 === o.g) {
        o.g = Math.round(s(e, "g"));
      }

      if (void 0 === o.b) {
        o.b = Math.round(s(e, "b"));
      }

      if (void 0 === o.a) {
        o.a = Math.round(s(e, "a"));
      }

      o.progress = t;
    });

    i.forEach((t, e) => {
      const o = r[t];

      a += `, rgba(${o.r}, ${o.g}, ${o.b}, ${o.a / 255}) ${
          (100 * t) | 0
        }%`;

      if (
        (this.fixed && i[e + 1])
      ) {
        const o = r[i[e + 1]];
        a += `, rgb(${o.r}, ${o.g}, ${o.b}, ${o.a / 255}) ${
          ((100 * t) | 0) - 0.01
        }%`;
      }
      o.progress = t;
    });

    a += ")";
    this.$previewHybrid.style.background = a;
    this._emitChange();
  },
  _updateActive(e, o) {
    this.activeOrbital = e;
    this.activeProgress = o ? o.progress : 0;
    this.$location.parentElement.disabled = !this.activeOrbital;

    if ("color" === this.activeOrbital) {
      this.$color.removeAttribute("disabled-color");
      this.$color.setAttribute("disabled-alpha", "");
    } else {
      if ("alpha" === this.activeOrbital) {
        this.$color.setAttribute("disabled-color", "");
        this.$color.removeAttribute("disabled-alpha");
      } else {
        this.$color.setAttribute("disabled-color", "");
        this.$color.setAttribute("disabled-alpha", "");
      }
    }

    if ("alpha" === e) {
      this.$location.value = (100 * o.progress).toFixed(2);
      this.$color.value = [255, 255, 255, o.value];
    } else {
      if ("color" === e) {
        let e;
        this.$location.value = (100 * o.progress).toFixed(2);

        e = "string" == typeof o.value
          ? t(o.value).rgba()
          : [o.value.r, o.value.g, o.value.b, 1];

        this.$color.value = e;
      } else {
        this.$location.value = 0;
        this.$color.value = [255, 255, 255, 255];
      }
    }
  },
  _convertToRGB(e) {
    let o;
    return (o = "string" == typeof e ? t(e).rgb() : [e.r, e.g, e.b]);
  },
  _emitConfirm() {
    o.fire(this, "confirm", { bubbles: true, detail: { value: this.value } });
  },
  _emitChange() {
    o.fire(this, "change", { bubbles: true, detail: { value: this.value } });
  },
});
