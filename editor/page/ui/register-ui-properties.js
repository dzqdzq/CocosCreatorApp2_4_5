(() => {
  "use strict";
  require("chroma-js");
  function t(t, i) {
    let e = {
      value: Editor.UI.parseObject,
      attrs: { step: parseFloat },
      template: "",
    };
    for (let t = 0; t < i.length; t++) {
      let u = i[t];
      e.template += `\n        <ui-prop name="${u.toUpperCase()}" id="${u}-comp" subset slidable class="fixed-label flex-1">\n          <ui-num-input class="flex-1"></ui-num-input>\n        </ui-prop>\n      `;
    }

    e.ready = function () {
      for (let t = 0; t < i.length; t++) {
        let e = i[t];
        let u = this.querySelector(`#${e}-comp`);
        let s = u.children[0];

        if (this.value) {
          s.value = this.value[e];
        }

        if (this.values) {
          s.values = this.values.map((t) => t[e]);
        }

        this.installStandardEvents(s);

        this.installSlideEvents(
          u,
          (t) => {
            s.value = s.value + t * s.step;
          },
          null,
          () => {
            s.value = this.value[e];
          }
        );

        this[`$prop${e}`] = u;
        this[`$input${e}`] = s;
      }
    };

    e.inputValue = function () {
        let t = {};
        for (let e = 0; e < i.length; e++) {
          let u = i[e];
          let s = this[`$input${u}`];
          t[u] = s.multiValues ? null : s.value;
        }
        return t;
      };

    e.valueChanged = function (t, e) {
        for (let t = 0; t < i.length; t++) {
          let u = i[t];
          this[`$input${u}`].value = e[u];
        }
      };

    e.valuesChanged = function (t, e) {
        for (let t = 0; t < i.length; t++) {
          let u = i[t];
          this[`$input${u}`].values = e.map((t) => t[u]);

          if (this.multiValues) {
            this._updateMulti(u);
          }
        }
      };

    e.multiValuesChanged = function (t, e) {
        for (let t = 0; t < i.length; t++) {
          let e = i[t];
          this._updateMulti(e);
        }
      };

    e._updateMulti = function (t) {
      let i = this[`$input${t}`];
      if (!this.multiValues || !this._values) {
        return i.removeAttribute("multi-values");
      }
      var e = this.values.map((i) => i[t]);

      if (e.every((t, i) => 0 == i || t == e[i - 1])) {
        i.removeAttribute("multi-values");
        i.value = e[0];
      } else {
        i.setAttribute("multi-values", "");
        i.values = e;
      }
    };

    Editor.UI.registerProperty(t, e);
  }
  Editor.UI.registerProperty("String", Editor.UI.getProperty("string"));
  Editor.UI.registerProperty("Float", Editor.UI.getProperty("number"));
  Editor.UI.registerProperty("Boolean", Editor.UI.getProperty("boolean"));
  Editor.UI.registerProperty("Object", Editor.UI.getProperty("object"));

  Editor.UI.registerProperty("Integer", {
    value: parseFloat,
    attrs: {
      "input-type": Editor.UI.parseString,
      slide: Editor.UI.parseBoolean,
      min: parseFloat,
      max: parseFloat,
      step: parseFloat,
      precision: parseInt,
    },
    template(t) {
      let i;
      return (i = t.slide
        ? '\n        <ui-slider class="flex-1"></ui-slider>\n        '
        : '\n        <ui-num-input class="flex-1" type="int"></ui-num-input>\n        ');
    },
    ready() {
      this.slidable = true;
      this.$input = this.children[0];
      this.$input.min = this.attrs.min;
      this.$input.max = this.attrs.max;
      this.$input.step = this.attrs.step;
      this.$input.precision = 0;
      this.$input.value = this.value;
      this.$input.values = this.values;
      this.multiValues = this.getAttribute("multi-values");
      this.installStandardEvents(this.$input);

      this.installSlideEvents(
        this,
        (t) => {
          this.$input.value = this.$input.value + t * this.$input.step;
        },
        null,
        () => {
          this.$input.value = this.value;
          this.$input.values = this.values;
        }
      );
    },
    inputValue() {
      return this.$input.value;
    },
    attrsChanged(t, i) {
      if (t.slide !== i.slide) {
        this.regen();
        return;
      }
      this.$input.min = i.min;
      this.$input.max = i.max;
      this.$input.step = i.step;
      this.$input.precision = i.precision;
    },
    valueChanged(t, i) {
      this.$input.value = i;
    },
    valuesChanged(t, i) {
      this.$input.values = i;

      if (this.multiValues) {
        this._updateMultiValue();
      }
    },
    multiValuesChanged(t, i) {
      this._updateMultiValue();
    },
    _updateMultiValue() {
      if (!this.multiValues || !this._values || this.values.length <= 1) {
        return this.$input.removeAttribute("multi-values");
      }

      if (this._values.every((t, i) => 0 == i || t == this._values[i - 1])) {
        this.$input.removeAttribute("multi-values");
      } else {
        this.$input.setAttribute("multi-values", "");
      }
    },
  });

  Editor.UI.registerProperty("Enum", {
    hasUserContent: true,
    value: parseInt,
    template: '\n      <ui-select class="flex-1"></ui-select>\n    ',
    ready(t) {
      this.$input = this.querySelector("ui-prop>ui-select");
      this.installStandardEvents(this.$input);

      if (this.attrs && this.attrs.enumList) {
        this.attrs.enumList.forEach((t) => {
              this.addItem(t.value, t.name);
            });
      } else {
        if (t) {
          t.forEach((t) => {
            this.$input.addElement(t);
          });
        }
      }

      this.$input.value = this.value;
      this.$input.values = this.values;
      this.multiValues = this.getAttribute("multi-values");
    },
    inputValue() {
      return parseInt(this.$input.value);
    },
    attrsChanged(t, i) {
      if (i.enumList !== t.enumList) {
        this.regen();
        return;
      }
    },
    addItem(t, i) {
      this.$input.addItem(t, i);
    },
    valueChanged(t, i) {
      this.$input.value = i;
    },
    valuesChanged(t, i) {
      this.$input.values = i;

      if (this.multiValues) {
        this._updateMultiValue();
      }
    },
    multiValuesChanged(t, i) {
      this._updateMultiValue();
    },
    _updateMultiValue() {
      if (!this.multiValues || !this._values || this.values.length <= 1) {
        return this.$input.removeAttribute("multi-values");
      }

      if (this._values.every((t, i) => 0 == i || t == this._values[i - 1])) {
        this.$input.removeAttribute("multi-values");
      } else {
        this.$input.setAttribute("multi-values", "");
      }
    },
  });

  Editor.UI.registerProperty("asset", {
    value: Editor.UI.parseString,
    attrs: { assetType: Editor.UI.parseString },
    template: (t) =>
      `\n        <ui-asset class="flex-1" type="${t.assetType}"></ui-asset>\n      `,
    ready() {
      this.style.paddingTop = "8px";
      this.$input = this.children[0];
      this.$input.value = this.value;
      this.$input.values = this.values;
      this.multiValues = this.getAttribute("multi-values");
      this.installStandardEvents(this.$input);
    },
    inputValue() {
      return this.$input.value;
    },
    attrsChanged(t, i) {
      if (i.assetType !== t.assetType) {
        this.regen();
        return;
      }
    },
    valueChanged(t, i) {
      this.$input.value = i;
    },
    valuesChanged(t, i) {
      this.$input.values = i;

      if (this.multiValues) {
        this._updateMultiValue();
      }
    },
    multiValuesChanged(t, i) {
      this._updateMultiValue();
    },
    _updateMultiValue() {
      if (!this.multiValues || !this.values || this.values.length <= 1) {
        return this.$input.removeAttribute("multi-values");
      }
      var t = this.values[0];

      if (this.values.every((i, e) => 0 == e || i == t)) {
        this.$input.removeAttribute("multi-values");
      } else {
        this.$input.setAttribute("multi-values", "");
      }
    },
  });

  Editor.UI.registerProperty("cc.Asset", {
    value: Editor.UI.parseString,
    attrs: { assetType: Editor.UI.parseString },
    template: (t) =>
      `\n        <ui-asset class="flex-1" type="${t.assetType}"></ui-asset>\n      `,
    ready() {
      this.style.paddingTop = "8px";
      this.$input = this.children[0];
      this.$input.value = this.value ? this.value.uuid : "";

      if (this.values) {
        this.$input.values = this.values.map((t) => t.uuid);
      } else {
        this.$input.values = null;
      }

      this.multiValues = this.getAttribute("multi-values");
      this.installStandardEvents(this.$input);
    },
    inputValue() {
      return { uuid: this.$input.value };
    },
    attrsChanged(t, i) {
      if (i.assetType !== t.assetType) {
        this.regen();
        return;
      }
    },
    valueChanged(t, i) {
      this.$input.value = i.uuid;
    },
    valuesChanged(t, i) {
      this.$input.values = i.map((t) => t.uuid);

      if (this.multiValues) {
        this._updateMultiValue();
      }
    },
    multiValuesChanged(t, i) {
      this._updateMultiValue();
    },
    _updateMultiValue() {
      if (!this.multiValues || !this.values || this.values.length <= 1) {
        return this.$input.removeAttribute("multi-values");
      }
      var t = this.values[0];

      if (this.values.every((i, e) => 0 == e || i.uuid == t.uuid)) {
        this.$input.removeAttribute("multi-values");
      } else {
        this.$input.setAttribute("multi-values", "");
      }
    },
  });

  Editor.UI.registerProperty("cc.Node", {
    value: Editor.UI.parseString,
    attrs: { typeid: Editor.UI.parseString, typename: Editor.UI.parseString },
    template: (t) =>
      `\n        <ui-node class="flex-1"\n          type="${t.typeid}"\n          typename="${t.typename}"\n        ></ui-node>\n      `,
    ready() {
      this.style.paddingTop = "8px";
      this.$input = this.children[0];
      this.$input.value = this.value ? this.value.uuid : "";

      if (this.values) {
        this.$input.values = this.values.map((t) => t.uuid);
      } else {
        this.$input.values = null;
      }

      this.multiValues = this.getAttribute("multi-values");
      this.installStandardEvents(this.$input);
    },
    inputValue() {
      return { uuid: this.$input.value };
    },
    attrsChanged(t, i) {
      if (i.typeid !== t.typeid) {
        this.regen();
        return;
      }
    },
    valueChanged(t, i) {
      this.$input.value = i.uuid;
    },
    valuesChanged(t, i) {
      this.$input.values = i.map((t) => t.uuid);

      if (this.multiValues) {
        this._updateMultiValue();
      }
    },
    multiValuesChanged(t, i) {
      this._updateMultiValue();
    },
    _updateMultiValue() {
      if (!this.multiValues || !this.values || this.values.length <= 1) {
        return this.$input.removeAttribute("multi-values");
      }
      var t = this.values[0];

      if (this.values.every((i, e) => 0 == e || i.uuid == t.uuid)) {
        this.$input.removeAttribute("multi-values");
      } else {
        this.$input.setAttribute("multi-values", "");
      }
    },
  });

  t("cc.Vec2", ["x", "y"]);
  t("cc.Vec3", ["x", "y", "z"]);

  Editor.UI.registerProperty("cc.Size", {
    value: Editor.UI.parseObject,
    attrs: { step: parseFloat },
    template:
      '\n      <ui-prop name="W" id="w-comp" subset slidable class="fixed-label flex-1">\n        <ui-num-input class="flex-1"></ui-num-input>\n      </ui-prop>\n      <ui-prop name="H" id="h-comp" subset slidable class="fixed-label flex-1">\n        <ui-num-input class="flex-1"></ui-num-input>\n      </ui-prop>\n    ',
    ready() {
      this.$propW = this.querySelector("#w-comp");
      this.$inputW = this.$propW.children[0];

      if (this.value) {
        this.$inputW.value = this.value.width;
      }

      if (this.values) {
        this.$inputW.values = this.values.map((t) => t.width);
      }

      this.installStandardEvents(this.$inputW);

      this.installSlideEvents(
        this.$propW,
        (t) => {
          this.$inputW.value = this.$inputW.value + t * this.$inputW.step;
        },
        null,
        () => {
          this.$inputW.value = this.value.width;
        }
      );

      this.$propH = this.querySelector("#h-comp");
      this.$inputH = this.$propH.children[0];

      if (this.value) {
        this.$inputH.value = this.value.height;
      }

      if (this.values) {
        this.$inputH.values = this.values.map((t) => t.height);
      }

      this.installStandardEvents(this.$inputH);

      this.installSlideEvents(
        this.$propH,
        (t) => {
          this.$inputH.value = this.$inputH.value + t * this.$inputH.step;
        },
        null,
        () => {
          this.$inputH.value = this.value.height;
        }
      );

      this.multiValues = this.getAttribute("multi-values");
      let t = this.attrs.step;

      if (t) {
        this.$inputW.step = t;
        this.$inputH.step = t;
      }
    },
    inputValue() {
      return {
        width: this.$inputW.multiValues ? null : this.$inputW.value,
        height: this.$inputH.multiValues ? null : this.$inputH.value,
      };
    },
    valueChanged(t, i) {
      this.$inputW.value = i.width;
      this.$inputH.value = i.height;
    },
    valuesChanged(t, i) {
      this.$inputW.values = i.map((t) => t.width);
      this.$inputH.values = i.map((t) => t.height);

      if (this.multiValues) {
        this._updateMultiW();
        this._updateMultiH();
      }
    },
    multiValuesChanged(t, i) {
      this._updateMultiW();
      this._updateMultiH();
    },
    _updateMultiW() {
      if (!this.multiValues || !this._values) {
        return this.$inputW.removeAttribute("multi-values");
      }
      var t = this.values.map((t) => t.width);

      if (t.every((i, e) => 0 == e || i == t[e - 1])) {
        this.$inputW.removeAttribute("multi-values");
        this.$inputW.value = t[0];
      } else {
        this.$inputW.setAttribute("multi-values", "");
        this.$inputW.values = t;
      }
    },
    _updateMultiH() {
      if (!this.multiValues || !this._values) {
        return this.$inputH.removeAttribute("multi-values");
      }
      var t = this._values.map((t) => t.height);

      if (t.every((i, e) => 0 == e || i == t[e - 1])) {
        this.$inputH.removeAttribute("multi-values");
        this.$inputH.values = t[0];
      } else {
        this.$inputH.setAttribute("multi-values", "");
        this.$inputH.values = t;
      }
    },
  });

  Editor.UI.registerProperty("cc.Color", {
    value: Editor.UI.parseObject,
    template: '\n      <ui-color class="flex-1"></ui-color>\n    ',
    ready() {
      this.$input = this.children[0];

      if (this.value) {
        this.valueChanged(null, this.value);
      }

      this.installStandardEvents(this.$input);

      this.$input.addEventListener("change", (t) => {
        t.detail.value;
      });

      this.multiValues = this.getAttribute("multi-values");
    },
    inputValue() {
      return {
        r: this.$input.value[0],
        g: this.$input.value[1],
        b: this.$input.value[2],
        a: 255 * this.$input.value[3],
      };
    },
    valueChanged(t, i) {
      this.$input.value = [i.r, i.g, i.b, i.a / 255];
    },
    valuesChanged(t, i) {
      this.$input.values = i.map((t) => [t.r, t.g, t.b, t.a / 255]);

      if (this.multiValues) {
        this._updateMultiValue();
      }
    },
    multiValuesChanged(t, i) {
      this._updateMultiValue();
    },
    _updateMultiValue() {
      if (!this.multiValues || !this._values) {
        return this.$input.removeAttribute("multi-values");
      }
      var t = this._values[0];

      if (this._values.every(
        (i, e) => 0 == e || (i.r == t.r && i.g == t.g && i.b == t.b)
      )) {
        this.$input.removeAttribute("multi-values");
      } else {
        this.$input.setAttribute("multi-values", "");
      }
    },
  });

  Editor.UI.registerProperty("cc.Rect", {
    value: Editor.UI.parseObject,
    template:
      '\n      <div class="vertical flex-1">\n        <div class="layout horizontal">\n          <ui-prop subset slidable name="X" class="fixed-label flex-1" style="min-width: 0; margin-right: 10px;">\n            <ui-num-input id="x-input" class="flex-1"></ui-num-input>\n          </ui-prop>\n          <ui-prop subset slidable name="Y" class="fixed-label flex-1" style="min-width: 0;">\n            <ui-num-input id="y-input" class="flex-1"></ui-num-input>\n          </ui-prop>\n        </div>\n        <div class="layout horizontal">\n          <ui-prop subset slidable name="W" class="fixed-label flex-1" style="min-width: 0; margin-right: 10px;">\n            <ui-num-input id="w-input" class="flex-1"></ui-num-input>\n          </ui-prop>\n          <ui-prop subset slidable name="H" class="fixed-label flex-1" style="min-width: 0;">\n            <ui-num-input id="h-input" class="flex-1"></ui-num-input>\n          </ui-prop>\n        </div>\n      </div>\n    ',
    ready() {
      this.setAttribute("auto-height", "");
      this.$inputX = this.querySelector("#x-input");

      if (this.value) {
        this.$inputX.value = this.value.x;
      }

      if (this.values) {
        this.$inputX.values = this.values.map((t) => t.x);
      }

      this.installStandardEvents(this.$inputX);
      this.$inputY = this.querySelector("#y-input");

      if (this.value) {
        this.$inputY.value = this.value.y;
      }

      if (this.values) {
        this.$inputY.values = this.values.map((t) => t.y);
      }

      this.installStandardEvents(this.$inputY);
      this.$inputW = this.querySelector("#w-input");

      if (this.value) {
        this.$inputW.value = this.value.width;
      }

      if (this.values) {
        this.$inputW.values = this.values.map((t) => t.width);
      }

      this.installStandardEvents(this.$inputW);
      this.$inputH = this.querySelector("#h-input");

      if (this.value) {
        this.$inputH.value = this.value.height;
      }

      if (this.values) {
        this.$inputH.values = this.values.map((t) => t.height);
      }

      this.installStandardEvents(this.$inputH);
      this.multiValues = this.getAttribute("multi-values");
    },
    inputValue() {
      var t = this.$inputX.multiValues;
      var i = this.$inputY.multiValues;
      var e = this.$inputW.multiValues;
      var u = this.$inputH.multiValues;
      return {
        x: t ? null : this.$inputX.value,
        y: i ? null : this.$inputY.value,
        width: e ? null : this.$inputW.value,
        height: u ? null : this.$inputH.value,
      };
    },
    valueChanged(t, i) {
      this.$inputX.value = i.x;
      this.$inputY.value = i.y;
      this.$inputW.value = i.width;
      this.$inputH.value = i.height;
    },
    valuesChanged(t, i) {
      this.$inputX.values = i.map((t) => t.x);
      this.$inputY.values = i.newVal.map((t) => t.y);
      this.$inputW.values = i.newVal.map((t) => t.width);
      this.$inputH.values = i.newVal.map((t) => t.height);

      if (this.multiValues) {
        this._updateMultiX();
        this._updateMultiY();
        this._updateMultiW();
        this._updateMultiH();
      }
    },
    multiValuesChanged(t, i) {
      this._updateMultiX();
      this._updateMultiY();
      this._updateMultiW();
      this._updateMultiH();
    },
    _updateMultiX() {
      if (!this.multiValues || !this.values || this.values.length <= 1) {
        return this.$inputX.removeAttribute("multi-values");
      }
      var t = this.values[0];

      if (this.values.every((i, e) => 0 == e || i.x == t.x)) {
        this.$inputX.removeAttribute("multi-values");
      } else {
        this.$inputX.setAttribute("multi-values", "");
      }
    },
    _updateMultiY() {
      if (!this.multiValues || !this.values || this.values.length <= 1) {
        return this.$inputY.removeAttribute("multi-values");
      }
      var t = this.values[0];

      if (this.values.every((i, e) => 0 == e || i.y == t.y)) {
        this.$inputY.removeAttribute("multi-values");
      } else {
        this.$inputY.setAttribute("multi-values", "");
      }
    },
    _updateMultiW() {
      if (!this.multiValues || !this.values || this.values.length <= 1) {
        return this.$inputW.removeAttribute("multi-values");
      }
      var t = this.values[0];

      if (this.values.every((i, e) => 0 == e || i.width == t.width)) {
        this.$inputW.removeAttribute("multi-values");
      } else {
        this.$inputW.setAttribute("multi-values", "");
      }
    },
    _updateMultiH() {
      if (!this.multiValues || !this.values || this.values.length <= 1) {
        return this.$inputH.removeAttribute("multi-values");
      }
      var t = this.values[0];

      if (this.values.every((i, e) => 0 == e || i.height == t.height)) {
        this.$inputH.removeAttribute("multi-values");
      } else {
        this.$inputH.setAttribute("multi-values", "");
      }
    },
  });

  Editor.UI.registerProperty("cc.Vec4", {
    value: Editor.UI.parseObject,
    template:
      '\n      <div class="vertical flex-1">\n        <div class="layout horizontal">\n          <ui-prop name="X" class="fixed-label flex-1" style="min-width: 0; margin-right: 10px;">\n            <ui-num-input id="x-input" class="flex-1"></ui-num-input>\n          </ui-prop>\n          <ui-prop name="Y" class="fixed-label flex-1" style="min-width: 0;">\n            <ui-num-input id="y-input" class="flex-1"></ui-num-input>\n          </ui-prop>\n        </div>\n        <div class="layout horizontal">\n          <ui-prop name="Z" class="fixed-label flex-1" style="min-width: 0; margin-right: 10px;">\n            <ui-num-input id="z-input" class="flex-1"></ui-num-input>\n          </ui-prop>\n          <ui-prop name="W" class="fixed-label flex-1" style="min-width: 0;">\n            <ui-num-input id="w-input" class="flex-1"></ui-num-input>\n          </ui-prop>\n        </div>\n      </div>\n    ',
    ready() {
      this.setAttribute("auto-height", "");
      this.$inputX = this.querySelector("#x-input");

      if (this.value) {
        this.$inputX.value = this.value.x;
      }

      if (this.values) {
        this.$inputX.values = this.values.map((t) => t.x);
      }

      this.installStandardEvents(this.$inputX);
      this.$inputY = this.querySelector("#y-input");

      if (this.value) {
        this.$inputY.value = this.value.y;
      }

      if (this.values) {
        this.$inputY.values = this.values.map((t) => t.y);
      }

      this.installStandardEvents(this.$inputY);
      this.$inputZ = this.querySelector("#z-input");

      if (this.value) {
        this.$inputZ.value = this.value.z;
      }

      if (this.values) {
        this.$inputZ.values = this.values.map((t) => t.z);
      }

      this.installStandardEvents(this.$inputZ);
      this.$inputW = this.querySelector("#w-input");

      if (this.value) {
        this.$inputW.value = this.value.w;
      }

      if (this.values) {
        this.$inputW.values = this.values.map((t) => t.w);
      }

      this.installStandardEvents(this.$inputW);
      this.multiValues = this.getAttribute("multi-values");
    },
    inputValue() {
      var t = this.$inputX.multiValues;
      var i = this.$inputY.multiValues;
      var e = this.$inputZ.multiValues;
      var u = this.$inputW.multiValues;
      return {
        x: t ? null : this.$inputX.value,
        y: i ? null : this.$inputY.value,
        z: e ? null : this.$inputZ.value,
        w: u ? null : this.$inputW.value,
      };
    },
    valueChanged(t, i) {
      this.$inputX.value = i.x;
      this.$inputY.value = i.y;
      this.$inputZ.value = i.z;
      this.$inputW.value = i.w;
    },
    valuesChanged(t, i) {
      this.$inputX.values = i.map((t) => t.x);
      this.$inputY.values = i.newVal.map((t) => t.y);
      this.$inputZ.values = i.newVal.map((t) => t.z);
      this.$inputW.values = i.newVal.map((t) => t.w);

      if (this.multiValues) {
        this._updateMultiX();
        this._updateMultiY();
        this._updateMultiZ();
        this._updateMultiW();
      }
    },
    multiValuesChanged(t, i) {
      this._updateMultiX();
      this._updateMultiY();
      this._updateMultiZ();
      this._updateMultiW();
    },
    _updateMultiX() {
      if (!this.multiValues || !this.values || this.values.length <= 1) {
        return this.$inputX.removeAttribute("multi-values");
      }
      var t = this.values[0];

      if (this.values.every((i, e) => 0 == e || i.x == t.x)) {
        this.$inputX.removeAttribute("multi-values");
      } else {
        this.$inputX.setAttribute("multi-values", "");
      }
    },
    _updateMultiY() {
      if (!this.multiValues || !this.values || this.values.length <= 1) {
        return this.$inputY.removeAttribute("multi-values");
      }
      var t = this.values[0];

      if (this.values.every((i, e) => 0 == e || i.y == t.y)) {
        this.$inputY.removeAttribute("multi-values");
      } else {
        this.$inputY.setAttribute("multi-values", "");
      }
    },
    _updateMultiZ() {
      if (!this.multiValues || !this.values || this.values.length <= 1) {
        return this.$inputZ.removeAttribute("multi-values");
      }
      var t = this.values[0];

      if (this.values.every((i, e) => 0 == e || i.z == t.z)) {
        this.$inputZ.removeAttribute("multi-values");
      } else {
        this.$inputZ.setAttribute("multi-values", "");
      }
    },
    _updateMultiW() {
      if (!this.multiValues || !this.values || this.values.length <= 1) {
        return this.$inputW.removeAttribute("multi-values");
      }
      var t = this.values[0];

      if (this.values.every((i, e) => 0 == e || i.w == t.w)) {
        this.$inputW.removeAttribute("multi-values");
      } else {
        this.$inputW.setAttribute("multi-values", "");
      }
    },
  });
})();
