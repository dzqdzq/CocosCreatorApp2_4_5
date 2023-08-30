"use strict";
const e = require("../utils/dom-utils");
const t = require("../utils/dock-utils");
const i = require("../utils/focus-mgr");
const r = require("../../../share/platform");
function s(e, t) {
  return t < e._computedMinWidth
    ? e._computedMinWidth
    : void 0 !== e._computedMaxWidth &&
      "auto" !== e._computedMaxWidth &&
      t > e._computedMaxWidth
    ? e._computedMaxWidth
    : t;
}
function n(e, t) {
  return t < e._computedMinHeight
    ? e._computedMinHeight
    : void 0 !== e._computedMaxHeight &&
      "auto" !== e._computedMaxHeight &&
      t > e._computedMaxHeight
    ? e._computedMaxHeight
    : t;
}

module.exports = class extends window.HTMLElement {
  static get tagName() {
    return "ui-dock-resizer";
  }
  constructor() {
    super();
    let t = this.attachShadow({ mode: "open" });
    t.innerHTML = '\n      <div class="bar"></div>\n    ';

    t.insertBefore(
      e.createStyleElement("theme://elements/resizer.css"),
      t.firstChild
    );

    this.addEventListener("mousedown", this._onMouseDown.bind(this));
  }
  connectedCallback() {
    if (r.isWin32) {
      this.classList.add("platform-win");
    }
  }
  get vertical() {
    return null !== this.getAttribute("vertical");
  }
  set vertical(e) {
    if (e) {
      this.setAttribute("vertical", "");
    } else {
      this.removeAttribute("vertical");
    }
  }
  get active() {
    return null !== this.getAttribute("active");
  }
  set active(e) {
    if (e) {
      this.setAttribute("active", "");
    } else {
      this.removeAttribute("active");
    }
  }
  _snapshot() {
    let e = this.parentNode;
    let t = [];
    let i = -1;
    for (let r = 0; r < e.children.length; ++r) {
      let s = e.children[r];

      if (s === this) {
        i = r;
      }

      t.push(this.vertical ? s.offsetWidth : s.offsetHeight);
    }
    let r = 0;
    let s = 0;
    let n = 0;
    let o = 0;
    let l = 0;
    let h = 0;
    for (let o = 0; o < i; o += 2) {
      r += t[o];

      s += this.vertical
          ? e.children[o]._computedMinWidth
          : e.children[o]._computedMinHeight;

      n += this.vertical
          ? e.children[o]._computedMaxWidth
          : e.children[o]._computedMaxHeight;
    }
    for (let r = i + 1; r < e.children.length; r += 2) {
      o += t[r];

      l += this.vertical
          ? e.children[r]._computedMinWidth
          : e.children[r]._computedMinHeight;

      h += this.vertical
          ? e.children[r]._computedMaxWidth
          : e.children[r]._computedMaxHeight;
    }
    return {
      sizeList: t,
      resizerIndex: i,
      prevTotalSize: r,
      prevMinSize: s,
      prevMaxSize: n,
      nextTotalSize: o,
      nextMinSize: l,
      nextMaxSize: h,
    };
  }
  _onMouseDown(o) {
    o.stopPropagation();
    let l = this.parentNode;
    this.active = true;
    let h = this._snapshot();
    let d = 0;
    let c = this.getBoundingClientRect();
    let a = Math.round(c.left + c.width / 2);
    let u = Math.round(c.top + c.height / 2);
    for (let e = 0; e < l.children.length; ++e) {
      let i = l.children[e];

      if (!t.isResizer(i)) {
        i.style.flex = `0 0 ${h.sizeList[e]}px`;
      }
    }

    let p = (e) => {
      let i;
      e.stopPropagation();
      if (
        (0 != (i = this.vertical ? e.clientX - a : e.clientY - u))
      ) {
        let r;
        let o = this.getBoundingClientRect();
        let c = Math.round(o.left + o.width / 2);
        let p = Math.round(o.top + o.height / 2);
        r = this.vertical ? e.clientX - c : e.clientY - p;
        let v = Math.sign(r);

        if (0 !== d &&
          d !== v) {
          h = this._snapshot();
          a = c;
          u = p;
          i = r;
        }

        d = v;

        (function (e, i, r, o, l, h, d, c, a, u, p) {
          let v;
          let m;
          let g;
          let M;
          let f;
          let _;
          let x;
          unused(c);
          unused(p);
          let z = Math.sign(r);

          if (z > 0) {
            _ = l - 1;
            x = l + 1;
          } else {
            _ = l + 1;
            x = l - 1;
          }

          M = r;
          let S = e[_];
          let w = o[_];
          v = w + M * z;
          m = i ? s(S, v) : n(S, v);
          M = (m - w) * z;
          let y = e[x];
          let H = o[x];
          for (
            ;
            (v = H - M * z),
              (g = i ? s(y, v) : n(y, v)),
              (f = (g - H) * z),
              (y.style.flex = `0 0 ${g}px`),
              g - v != 0;

          ) {
            M += f;
            if (z > 0) {
              if ((x += 2) >= e.length) {
                break;
              }
            } else {
              if ((x -= 2) < 0) {
                break;
              }
            }
            y = e[x];
            H = o[x];
          }

          if (z > 0) {
            if (a - r * z <= u) {
              m = w + (M = (a - u) * z) * z;
            }
          } else {
            if (h - r * z <= d) {
              m = w + (M = (h - d) * z) * z;
            }
          }

          S.style.flex = `0 0 ${m}px`;
          for (let i = 0; i < e.length; ++i) {
            let r = e[i];

            if (!t.isResizer(r)) {
              if (r._notifyResize) {
                r._notifyResize();
              }
            }
          }
        })(
          l.children,
          this.vertical,
          i,
          h.sizeList,
          h.resizerIndex,
          h.prevTotalSize,
          h.prevMinSize,
          h.prevMaxSize,
          h.nextTotalSize,
          h.nextMinSize,
          h.nextMaxSize
        );
      }
    };

    let v = (r) => {
      r.stopPropagation();
      document.removeEventListener("mousemove", p);
      document.removeEventListener("mouseup", v);
      e.removeDragGhost();
      this.active = false;
      let s = this.parentNode;

      if (s._reflowRecursively) {
        s._reflowRecursively();
      }

      if (s._updatePreferredSizeRecursively) {
        s._updatePreferredSizeRecursively();
      }

      for (let e = 0; e < s.children.length; ++e) {
        let i = s.children[e];

        if (!t.isResizer(i)) {
          if (i._notifyResize) {
            i._notifyResize();
          }
        }
      }
      t.saveLayout();
      i._refocus();
    };

    if (r.isWin32) {
      e.addDragGhost(this.vertical ? "ew-resize" : "ns-resize");
    } else {
      e.addDragGhost(this.vertical ? "col-resize" : "row-resize");
    }

    document.addEventListener("mousemove", p);
    document.addEventListener("mouseup", v);
  }
};
