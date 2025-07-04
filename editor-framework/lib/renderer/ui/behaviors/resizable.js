"use strict";
const t = require("../../console");
const i = require("../utils/dom-utils");
let e = {
  _resizable: true,
  get row() {
    return null !== this.getAttribute("row");
  },
  set row(t) {
    if (t) {
      this.setAttribute("row", "");
    } else {
      this.removeAttribute("row");
    }
  },
  _initResizable() {
    [
      { name: "width", prop: "_initWidth", defaultValue: "auto" },
      { name: "height", prop: "_initHeight", defaultValue: "auto" },
      { name: "min-width", prop: "_initMinWidth", defaultValue: 0 },
      { name: "min-height", prop: "_initMinHeight", defaultValue: 0 },
      { name: "max-width", prop: "_initMaxWidth", defaultValue: "auto" },
      { name: "max-height", prop: "_initMaxHeight", defaultValue: "auto" },
    ].forEach((t) => {
      let i = this.getAttribute(t.name);
      return "auto" === i
        ? ((this[t.prop] = t.defaultValue), void 0)
        : ((i = parseInt(i)),
          isNaN(i)
            ? ((this[t.prop] = t.defaultValue), void 0)
            : ((this[t.prop] = i), void 0));
    });

    if ("auto" !== this._initMaxWidth &&
      this._initMaxWidth < this._initMinWidth) {
      t.warn(
          `"max-width" is less than "min-width". "max-width"=${this._initMaxWidth}, "min-width"=${this._initMinWidth}`
        );

      this._initMaxWidth = this._initMinWidth;
    }

    if ("auto" !== this._initMaxHeight &&
      this._initMaxHeight < this._initMinHeight) {
      t.warn(
          `"max-height" is less than "min-height". "max-height"=${this._initMaxHeight}, "min-height"=${this._initMinHeight}`
        );

      this._initMaxHeight = this._initMinHeight;
    }

    this._needEvaluateSize = false;
    this._preferredWidth = this._initWidth;
    this._preferredHeight = this._initHeight;
    this._computedMinWidth = this._initMinWidth;
    this._computedMaxWidth = this._initMaxWidth;
    this._computedMinHeight = this._initMinHeight;
    this._computedMaxHeight = this._initMaxHeight;
    this.style.minWidth = `${this._initMinWidth}px`;
    this.style.minHeight = `${this._initMinHeight}px`;
    this.style.maxWidth = "auto" !== this._initMaxWidth ? `${this._initMaxWidth}px` : "auto";
    this.style.maxHeight = "auto" !== this._initMaxHeight ? `${this._initMaxHeight}px` : "auto";
  },
  _notifyResize() {
    i.fire(this, "resize");
    for (let t = 0; t < this.children.length; ++t) {
      let i = this.children[t];

      if (i._resizable) {
        i._notifyResize();
      }
    }
  },
  calcWidth(t) {
    return t < this._computedMinWidth
      ? this._computedMinWidth
      : "auto" !== this._computedMaxWidth && t > this._computedMaxWidth
      ? this._computedMaxWidth
      : t;
  },
  calcHeight(t) {
    return t < this._computedMinHeight
      ? this._computedMinHeight
      : "auto" !== this._computedMaxHeight && t > this._computedMaxHeight
      ? this._computedMaxHeight
      : t;
  },
  _finalizePreferredSizeRecursively() {
    for (let t = 0; t < this.children.length; ++t) {
      let i = this.children[t];

      if (i._resizable) {
        i._finalizePreferredSizeRecursively();
      }
    }
    this._finalizePreferredSize();
  },
  _finalizeMinMaxRecursively() {
    for (let t = 0; t < this.children.length; ++t) {
      let i = this.children[t];

      if (i._resizable) {
        i._finalizeMinMaxRecursively();
      }
    }
    this._finalizeMinMax();
  },
  _finalizeStyleRecursively() {
    this._finalizeStyle();
    for (let t = 0; t < this.children.length; ++t) {
      let i = this.children[t];

      if (i._resizable) {
        i._finalizeStyleRecursively();
      }
    }
  },
  _reflowRecursively() {
    this._reflow();
    for (let t = 0; t < this.children.length; ++t) {
      let i = this.children[t];

      if (i._resizable) {
        i._reflowRecursively();
      }
    }
  },
  _finalizeMinMax() {
    if (!this._needEvaluateSize) {
      return;
    }
    let t = [];
    for (let i = 0; i < this.children.length; ++i) {
      let e = this.children[i];

      if (e._resizable) {
        t.push(e);
      }
    }
    if (this.row) {
      this._computedMinWidth = t.length > 0 ? 3 * (t.length - 1) : 0;
      this._computedMinHeight = 0;
      this._computedMaxWidth = "auto";
      this._computedMaxHeight = "auto";
      let i = false;
      let e = false;
      for (let h = 0; h < t.length; ++h) {
        let d = t[h];
        this._computedMinWidth += d._computedMinWidth;

        if (this._computedMinHeight < d._computedMinHeight) {
          this._computedMinHeight = d._computedMinHeight;
        }

        if (i || "auto" === d._computedMaxWidth) {
          i = true;
          this._computedMaxWidth = "auto";
        } else {
          this._computedMaxWidth += d._computedMaxWidth;
        }

        if (e || "auto" === d._computedMaxHeight) {
          e = true;
          this._computedMaxHeight = "auto";
        } else {
          if (this._computedMaxHeight < d._computedMaxHeight) {
            this._computedMaxHeight = d._computedMaxHeight;
          }
        }
      }
    } else {
      this._computedMinWidth = 0;
      this._computedMinHeight = t.length > 0 ? 3 * (t.length - 1) : 0;
      this._computedMaxWidth = "auto";
      this._computedMaxHeight = "auto";
      let i = false;
      let e = false;
      for (let h = 0; h < t.length; ++h) {
        let d = t[h];

        if (this._computedMinWidth < d._computedMinWidth) {
          this._computedMinWidth = d._computedMinWidth;
        }

        this._computedMinHeight += d._computedMinHeight;

        if (i || "auto" === d._computedMaxWidth) {
          i = true;
          this._computedMaxWidth = "auto";
        } else {
          if (this._computedMaxWidth < d._computedMaxWidth) {
            this._computedMaxWidth = d._computedMaxWidth;
          }
        }

        if (e || "auto" === d._computedMaxHeight) {
          e = true;
          this._computedMaxHeight = "auto";
        } else {
          this._computedMaxHeight += d._computedMaxHeight;
        }
      }
    }

    if (this._initMinWidth > this._computedMinWidth) {
      this._computedMinWidth = this._initMinWidth;
    }

    if (this._initMinHeight > this._computedMinHeight) {
      this._computedMinHeight = this._initMinHeight;
    }
  },
  _finalizePreferredSize() {
    if (!this._needEvaluateSize) {
      return;
    }
    let t = [];
    for (let i = 0; i < this.children.length; ++i) {
      let e = this.children[i];

      if (e._resizable) {
        t.push(e);
      }
    }
    if ("auto" === this._preferredWidth) {
      let i = false;
      if (this.row) {
        this._preferredWidth = t.length > 0 ? 3 * (t.length - 1) : 0;
        for (let e = 0; e < t.length; ++e) {
          let h = t[e];

          if (i || "auto" === h._preferredWidth) {
            i = true;
            this._preferredWidth = "auto";
          } else {
            this._preferredWidth += h._preferredWidth;
          }
        }
      } else {
        this._preferredWidth = 0;
        for (let e = 0; e < t.length; ++e) {
          let h = t[e];

          if (i || "auto" === h._preferredWidth) {
            i = true;
            this._preferredWidth = "auto";
          } else {
            if (h._preferredWidth > this._preferredWidth) {
              this._preferredWidth = h._preferredWidth;
            }
          }
        }
      }
    }
    if ("auto" === this._preferredHeight) {
      let i = false;
      if (this.row) {
        this._preferredHeight = 0;
        for (let e = 0; e < t.length; ++e) {
          let h = t[e];

          if (i || "auto" === h._preferredHeight) {
            i = true;
            this._preferredHeight = "auto";
          } else {
            if (h._preferredHeight > this._preferredHeight) {
              this._preferredHeight = h._preferredHeight;
            }
          }
        }
      } else {
        this._preferredHeight = t.length > 0 ? 3 * (t.length - 1) : 0;
        for (let e = 0; e < t.length; ++e) {
          let h = t[e];

          if (i || "auto" === h._preferredHeight) {
            i = true;
            this._preferredHeight = "auto";
          } else {
            this._preferredHeight += h._preferredHeight;
          }
        }
      }
    }
  },
  _finalizeStyle() {
    this.style.minWidth = `${this._computedMinWidth}px`;
    this.style.minHeight = `${this._computedMinHeight}px`;

    if ("auto" !== this._computedMaxWidth) {
      this.style.maxWidth = `${this._computedMaxWidth}px`;
    } else {
      this.style.maxWidth = "auto";
    }

    if ("auto" !== this._computedMaxHeight) {
      this.style.maxHeight = `${this._computedMaxHeight}px`;
    } else {
      this.style.maxHeight = "auto";
    }

    if (this._needEvaluateSize) {
      if (1 === this.children.length) {
        this.children[0].style.flex = "1 1 auto";
      } else {
        for (let t = 0; t < this.children.length; ++t) {
          let i = this.children[t];
          if (i._resizable) {
            let t = this.row ? i._preferredWidth : i._preferredHeight;
            i.style.flex = "auto" === t ? "1 1 auto" : `0 0 ${t}px`;
          }
        }
      }
    }
  },
  _reflow() {
    let t = this.children.length;
    let i = new Array(t);
    let e = 0;
    for (let h = 0; h < t; ++h) {
      let t = this.children[h];
      let d = this.row ? t.offsetWidth : t.offsetHeight;
      i[h] = d;

      if (t._resizable) {
        e += d;
      }
    }
    for (let t = 0; t < this.children.length; ++t) {
      let h = this.children[t];
      if (h._resizable) {
        let d = i[t] / e;
        h.style.flex = `${d} ${d} 0px`;
      }
    }
  },
};
module.exports = e;
