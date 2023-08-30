"use strict";
let e = {};
module.exports = e;

e.init = function () {
  let e = window.Vue;
  if (!e) {
    return;
  }
  const t = e.component;

  e.component = function (i, l) {
    l = t.call(e, i, l);
    global.__temp_panel_proto_ = l;
    return l;
  };

  e.directive("value", {
    twoWay: true,
    bind() {
      this.handler = (e) => {
        this.set(e.detail.value);
      };

      this.el.addEventListener("change", this.handler);
    },
    unbind() {
      this.el.removeEventListener("change", this.handler);
    },
    update(e) {
      this.el.value = e;
      this.el.expression = this.expression;
    },
  });

  e.directive("values", {
    twoWay: true,
    bind() {
      this.handler = (e) => {
        if ("values" in e.detail) {
          this.set(e.detail.values);
        }
      };

      this.el.addEventListener("change", this.handler);
    },
    unbind() {
      this.el.removeEventListener("change", this.handler);
    },
    update(e) {
      this.el.values = e;
    },
  });

  e.directive("disabled", {
    update(e) {
      this.el.disabled = e;
    },
  });

  e.directive("readonly", {
    update(e) {
      this.el.readonly = e;
    },
  });

  e.directive("prop", {
    update(e, t) {
      if (void 0 === t) {
        this.el.name = e.name;
        this.el.readonly = e.attrs.readonly;
        this.el._type = e.type;
        this.el._attrs = e.attrs;
        this.el._tooltip = e.attrs.tooltip;
        let t = e.value;
        if (Array.isArray(t)) {
          this.el._value = new Array(t.length);
          for (let e = 0; e < t.length; ++e) {
            this.el._value[e] = t[e];
          }
        } else {
          this.el._value = t;
        }
        this.el._values = e.values;
        this.el.regen();
      } else {
        this.el.name = e.name;
        this.el.type = e.type;
        this.el.attrs = e.attrs;
        this.el.value = e.value;
        this.el.tooltip = e.attrs.tooltip;
        this.el.readonly = e.attrs.readonly;
      }
      this.el.expression = this.expression;
    },
  });

  e.directive("attrs", {
    twoWay: true,
    bind() {},
    unbind() {},
    update(e) {
      this.el.attrs = e;
    },
  });
};
