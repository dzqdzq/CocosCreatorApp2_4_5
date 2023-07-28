"use strict";
const e = false;
const t = require("svg.js");
require("svg.filter.js");
let s = Editor.require("app://editor/page/gizmos/utils/transform-tool-data");

module.exports = class extends window.HTMLElement {
  get scale() {
    return s.scale2D;
  }
  set scale(e) {
    s.scale2D = e;
  }
  get transformTool() {
    return s.toolName;
  }
  set transformTool(e) {
    s.toolName = e;

    if (this.svg.transform) {
      this.edit(this.svg.transform.target);
    }
  }
  get coordinate() {
    return s.coordinate;
  }
  set coordinate(e) {
    if (this.svg.transform) {
      this.edit(this.svg.transform.target);
    }

    s.coordinate = e;
  }
  get pivot() {
    return s.pivot;
  }
  set pivot(e) {
    if (this.svg.transform) {
      this.edit(this.svg.transform.target);
    }

    s.pivot = e;
  }
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    let e = document.createElement("style");
    e.type = "text/css";

    e.textContent = require("fs").readFileSync(
        require("path").join(__dirname, "./gizmo.css"),
        "utf-8"
      );

    let i = document.createElement("div");
    i.id = "svg";

    this.svg = {
        painter: t(i),
        design: null,
        transform: null,
        select: null,
      };

    this.shadowRoot.appendChild(e);
    this.shadowRoot.appendChild(i);
    cc.engine.getDesignResolutionSize();

    this.addEventListener("keydown", (e) => {
      if (this.svg.transform) {
        this.svg.transform.onKeyDown(e);
      }
    });

    this.addEventListener("keyup", (e) => {
      if (this.svg.transform) {
        this.svg.transform.onKeyUp(e);
      }
    });

    this.designSize = [0, 0];
    this._gizmoToolMap = {};
    this._gizmosPool = {};
    s.is2D = true;
  }
  onSceneLaunched() {
    this.clearAllGizmos();
  }
  getGizmoToolByName(e) {
    let t = this._gizmoToolMap[e];
    if (null == t) {
      let s;
      switch (e) {
        case "position":
          s = _Scene.gizmos.position;
          break;
        case "rotation":
          s = _Scene.gizmos.rotate;
          break;
        case "scale":
          s = _Scene.gizmos.scale;
          break;
        case "rect":
          s = _Scene.gizmos.rect;
      }

      if (null != s) {
        this._gizmoToolMap[e] = this.createGizmo(e, s);
        t = this._gizmoToolMap[e];
      } else {
        Editor.error("Unknown transform tool %s", e);
        this.repaintHost();
      }
    }
    return t;
  }
  clearAllGizmos() {
    Object.keys(this._gizmosPool).forEach((e) => {
      this._gizmosPool[e].forEach((e) => {
        if (e) {
          e.remove();
          this.destoryGizmo(e);
        }
      });
    });
  }
  createGizmo(e, t, s) {
    if (null == t) {
      return;
    }
    let i = this._gizmosPool[e];

    if (i && i[0] && i[0].constructor !== t) {
      i = null;
    }

    let o = null;
    if (null == i) {
      i = [];
      o = new t(this, s);
      i.push(o);
      this._gizmosPool[e] = i;
    } else {
      for (let e = 0; e < i.length; e++) {
        if (i[e]._hidden) {
          (o = i[e]).target = s;
          break;
        }
      }

      if (!o) {
        o = new t(this, s);
        i.push(o);
      }
    }
    return o;
  }
  destoryGizmo(e) {
    if (e) {
      e.hide();
    }
  }
  showNodeGizmo(e) {
    if (!e) {
      return;
    }
    let t = null;
    let s = null;

    e._components.forEach((i) => {
      if (i.gizmo) {
        i.gizmo.remove();
        i.gizmo.hide();
        i.gizmo = null;
      }

      if (
        (e.active && i.enabled)
      ) {
        t = null;
        s = null;
        let o = cc.js.getClassName(i);
        let n = Editor.gizmos[o];
        if (n) {
          try {
            t = Editor.require(n);
          } catch (e) {
            Editor.error(e);
          }
        }

        if (!t) {
          t = _Scene.gizmos.components[o];
        }

        if (null != t) {
          (s = this.createGizmo(o, t, i)).show();
          i.gizmo = s;

          if (e.gizmo) {
            i.gizmo.selecting = e.gizmo.selecting;
            i.gizmo.editing = e.gizmo.editing;
          }
        }
      }
    });

    this.repaintHost();
  }
  hideNodeGizmo(e) {
    if (e) {
      e._components.forEach((e) => {
        if (e.gizmo) {
          this.destoryGizmo(e.gizmo);
          e.gizmo = null;
        }
      });
    }
  }
  onComponentEnable(e) {
    let t = cc.engine.getInstanceById(e);

    if (-1 !== this.svg.selection.indexOf(t.node.uuid)) {
      this.showNodeGizmo(t.node);
    }
  }
  onComponentDisable(e) {
    let t = cc.engine.getInstanceById(e);

    if (t && t.gizmo) {
      t.gizmo.remove();
      t.gizmo.hide();
      t.gizmo = null;
    }

    this.repaintHost();
  }
  connectedCallback() {
    this.svg.selection = [];
    this.background = this.svg.painter.group();
    this.scene = this.svg.painter.group();
    this.foreground = this.svg.painter.group();
    this.tabIndex = -1;
  }
  resize(t, s) {
    if (t <= 0) {
      console.warn("The SVG width should not be less than 0.");
      t = 0;
    }

    if (s <= 0) {
      console.warn("The SVG height should not be less than 0.");
      s = 0;
    }

    if (
      (!t || !s)
    ) {
      let e = this.getBoundingClientRect();
      t = Math.round(t || e.width);
      s = Math.round(s || e.height);
    }

    if (e) {
      console.log(`resize: ${t} ${s}`);
    }

    this.svg.painter.size(t, s);
    this.svg.painter.spof();
  }
  update() {
    if (this.svg.transform) {
      this.svg.transform.update();
    }
  }
  repaintHost() {
    if (cc.engine) {
      cc.engine.repaintInEditMode();
    }
  }
  sceneToPixel(e) {
    return e;
  }
  worldToPixel(e) {
    return e;
  }
  pixelToScene(e) {
    return e;
  }
  pixelToWorld(e) {
    return e;
  }
  updateSelectRect(e, t, s, i) {
    if (!this.svg.select) {
      this.svg.select = this.foreground.rect().front();
    }

    this.svg.select
      .move(Editor.GizmosUtils.snapPixel(e), Editor.GizmosUtils.snapPixel(t))
      .size(s, i)
      .fill({ color: "rgba(0,128,255,0.4)" })
      .stroke({ width: 1, color: "#09f", opacity: 1 });
  }
  fadeoutSelectRect() {
    if (!this.select) {
      return;
    }
    let e = this.svg.select;

    e
      .animate(200, "-")
      .opacity(0)
      .after(() => {
        e.remove();
      });

    this.svg.select = null;
  }
  rectHitTest(e, t, s, i) {
    let o = this.svg.painter.node.createSVGRect();
    o.x = e;
    o.y = t;
    o.width = s;
    o.height = i;
    return this.svg.painter
      .getIntersectionList(o, null)
      .filter((e) => {
        let t = e.instance;
        return t && t.selectable;
      })
      .map((e) => e.node);
  }
  reset() {
    this.svg.selection = [];

    if (this.svg.transform) {
      this.svg.transform.remove();
      this.svg.transform = null;
    }

    if (this.svg.select) {
      this.svg.select.remove();
      this.svg.select = null;
    }

    this.background.clear();
    this.scene.clear();
    this.foreground.clear();
  }
  updateGizmosState(e, t) {
    if (!e) {
      return;
    }
    let s = e._components;

    Object.keys(t).forEach((i) => {
      if (e.gizmo) {
        e.gizmo[i] = t[i];
      }

      s.forEach((e) => {
        if (e.gizmo) {
          e.gizmo[i] = t[i];
        }
      });
    });

    this.repaintHost();
  }
  select(e) {
    e.forEach((e) => {
      this.svg.selection.push(e);
      let t = cc.engine.getInstanceById(e);

      if (t) {
        this.showNodeGizmo(t);
      }
    });
    let t = [];

    this.svg.selection.forEach((e) => {
      let s = cc.engine.getInstanceById(e);

      if (s) {
        this.updateGizmosState(s, { selecting: true, editing: false });
        t.push(s);
      }
    });

    this.edit(t);
  }
  unselect(e) {
    e.forEach((e) => {
      let t = this.svg.selection.indexOf(e);

      if (-1 !== t) {
        this.svg.selection.splice(t, 1);
      }

      let s = cc.engine.getInstanceById(e);
      this.updateGizmosState(s, { selecting: false, editing: false });
      this.hideNodeGizmo(s);
    });
    let t = this.svg.selection.map((e) => cc.engine.getInstanceById(e));
    this.edit(t.filter((e) => !!e));
  }
  edit(e) {
    if (0 === e.length) {
      if (this.svg.transform) {
        this.svg.transform.target = [];
      }

      this.repaintHost();
      return;
    }

    if (1 === e.length) {
      this.updateGizmosState(e[0], { selecting: false, editing: true });
    }

    let t = this.getGizmoToolByName(this.transformTool);

    if (null != t) {
      if (t !== this.svg.transform) {
        if (null != this.svg.transform) {
          this.svg.transform.hide();
        }

        this.svg.transform = t;
      }

      this.svg.transform.target = e;
      this.svg.transform.show();
      this.repaintHost();
    }
  }
  hoverin(e) {
    let t = cc.engine.getInstanceById(e);
    this.updateGizmosState(t, { hovering: true });
  }
  hoverout(e) {
    let t = cc.engine.getInstanceById(e);
    this.updateGizmosState(t, { hovering: false });
  }
  checkNodeGizmoState(e) {
    if (-1 !== this.svg.selection.indexOf(e.uuid) &&
      e.gizmo) {
      e.gizmo.editing = true;
    }
  }
};
