"use strict";
Vue.component("cc-type-error-prop", {
  template:
    '\n    <ui-prop\n      :name="target.name"\n      :indent="indent"\n      style="padding-top: 8px;"\n    >\n      <div :style="cssWrapper">Type Error</div>\n      <span class="flex-1"></span>\n      <ui-button class="tiny blue" @confirm="_onReset">Reset</ui-button>\n    </ui-prop>\n  ',
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
      background: "#900",
      color: "#aaa",
    },
    cssType: { color: "#000", background: "#1fa135" },
  }),
  props: {
    indent: { type: Number, default: 0 },
    target: { twoWay: true, type: Object },
  },
  methods: {
    _onReset() {
      Editor.UI.fire(this.$el, "reset-prop", {
        bubbles: true,
        detail: { path: this.target.path, type: this.target.attrs.type },
      });
    },
  },
});
