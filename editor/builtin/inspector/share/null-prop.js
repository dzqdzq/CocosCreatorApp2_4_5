"use strict";
Vue.component("cc-null-prop", {
  template:
    '\n    <ui-prop\n      :name="target.name"\n      :indent="indent"\n      style="padding-top: 8px;"\n    >\n      <div :style="cssWrapper">Null</div>\n      <div :style="[cssWrapper, cssType]">{{target.attrs.typename}}</div>\n      <span class="flex-1"></span>\n      <ui-button class="tiny blue" @confirm="_applyAction">{{action}}</ui-button>\n    </ui-prop>\n  ',
  data: () => ({
    cssWrapper: {
      marginRight: "5px",
      padding: "1px 6px",
      borderRadius: "3px",
      fontWeight: "bold",
      textOverflow: "ellipsis",
      overflow: "hidden",
      whitespace: "nowrap",
      minWidth: "20px",
      background: "#aaa",
      color: "#333",
    },
    cssType: { color: "#000", background: "#1fa135" },
    action: "Create",
  }),
  watch: { "target.attrs.type": "_updateAction" },
  props: {
    indent: { type: Number, default: 0 },
    target: { twoWay: true, type: Object },
  },
  methods: {
    _updateAction() {
      let t = this.target.attrs.type;
      this.action = "String" === t ||
      "Enum" === t ||
      "Boolean" === t ||
      "Float" === t ||
      "Integer" === t
        ? "Reset"
        : "Create";
    },
    _applyAction() {
      if ("Create" === this.action) {
        Editor.UI.fire(this.$el, "new-prop", {
              bubbles: true,
              detail: { path: this.target.path, type: this.target.attrs.type },
            });
      } else {
        Editor.UI.fire(this.$el, "reset-prop", {
              bubbles: true,
              detail: { path: this.target.path, type: this.target.attrs.type },
            });
      }
    },
  },
  compiled() {
    this._updateAction();
  },
});
