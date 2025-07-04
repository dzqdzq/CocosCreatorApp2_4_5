"use strict";
Vue.component("cc-meta-header", {
  style: "\n    .pixelated {\n        image-rendering: pixelated;\n      }\n  ",
  template: `\n    <div :style="cssHost">\n      <img :style="cssIcon" :class="{ pixelated: pixelated }" \n        :src="icon"\n      />\n      <div :style="cssTitle">{{ target.__name__ }}</div>\n\n      <span class="flex-1"></span>\n\n      <ui-button class="red"\n        v-disabled="!target.__dirty__"\n        @confirm="revert"\n      >\n        ${Editor.T(
    "MESSAGE.revert"
  )}\n      </ui-button>\n      <ui-button :style="btnMargin" class="green"\n        v-disabled="!target.__dirty__"\n        @confirm="apply"\n      >\n        ${Editor.T(
    "MESSAGE.apply"
  )}\n      </ui-button>\n    </div>\n  `,
  data() {
    return {
      cssHost: {
        display: "flex",
        flex: "none",
        flexDirection: "row",
        alignItems: "center",
        paddingBottom: "2px",
        margin: "5px 10px",
        marginBottom: "10px",
        borderBottom: "1px solid #666",
        height: "35px",
        overflow: "hidden",
      },
      cssIcon: { marginRight: "5px" },
      cssTitle: {
        fontWeight: "bold",
        textOverflow: "ellipsis",
        overflow: "hidden",
      },
      btnMargin: { marginLeft: "10px" },
      pixelated: this.icon && this.icon.startsWith("unpack://"),
    };
  },
  props: { icon: String, target: Object },
  methods: {
    revert() {
      Editor.UI.fire(this.$el, "meta-revert", { bubbles: true });
    },
    apply() {
      Editor.UI.fire(this.$el, "meta-apply", {
        bubbles: true,
        detail: { target: this.target },
      });
    },
  },
});
