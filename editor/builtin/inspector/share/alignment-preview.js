"use strict";
Vue.component("cc-alignment-preview", {
  template:
    '\n    <style>\n      .arrow {\n        position: absolute;\n      }\n      .arrow.left {\n        left: -2.5px;\n        top: -2px;\n      }\n      .arrow.left:after {\n        border: 2.5px solid transparent;\n        border-right: 4px solid #ccc;\n        position: absolute;\n        content: \' \'\n      }\n      .arrow.right {\n        right: 4px;\n        top: -2px;\n      }\n      .arrow.right:before {\n        border: 2.5px solid transparent;\n        border-left: 4px solid #ccc;\n        position: absolute;\n        content: \' \'\n      }\n      .arrow.up {\n        top: -3px;\n        left: -2px;\n      }\n      .arrow.up:after {\n        border: 2.5px solid transparent;\n        border-bottom: 4px solid #ccc;\n        position: absolute;\n        content: \' \'\n      }\n      .arrow.down {\n        bottom: 4px;\n        left: -2px;\n      }\n      .arrow.down:before {\n        border: 2.5px solid transparent;\n        border-top: 4px solid #ccc;\n        position: absolute;\n        content: \' \'\n      }\n\n      .h-arrow-line {\n        width: 4px;\n        margin: 0 4px 0 4px;\n        border-top: 1px solid #ccc;\n      }\n      .v-arrow-line {\n        height: 4px;\n        margin: 4px 0 4px 0;\n        border-left: 1px solid #ccc;\n      }\n      #left-arrow {\n        position: absolute;\n        top: 50%;\n        left: -13px;\n      }\n      #right-arrow {\n        position: absolute;\n        top: 50%;\n        right: -13px;\n      }\n      #top-arrow {\n        position: absolute;\n        top: -13px;\n        left: 50%;\n      }\n      #bottom-arrow {\n        position: absolute;\n        left: 50%;\n        bottom: -13px;\n      }\n    </style>\n\n    <div :style="cssContainer">\n      <div :style="cssContainerSize"></div>\n\n      <div :style="[cssLine, cssLineH, cssTopLine]" v-show="target.isAlignTop.value"></div>\n      <div :style="[cssLine, cssLineV, cssLeftLine]" v-show="target.isAlignLeft.value"></div>\n      <div :style="[cssLine, cssLineV, cssRightLine]" v-show="target.isAlignRight.value"></div>\n      <div :style="[cssLine, cssLineH, cssBottomLine]" v-show="target.isAlignBottom.value"></div>\n      <div :style="[cssLine, cssLineV, cssHCLine]" v-show="target.isAlignHorizontalCenter.value"></div>\n      <div :style="[cssLine, cssLineH, cssVCLine]" v-show="target.isAlignVerticalCenter.value"></div>\n\n      <div :style="[cssWidget, _alignStyle()]">\n        <div id="left-arrow" v-show="target.isAlignLeft.value">\n          <div class="h-arrow-line"></div>\n          <div class="arrow left"></div>\n          <div class="arrow right"></div>\n        </div>\n        <div id="right-arrow" v-show="target.isAlignRight.value">\n          <div class="h-arrow-line"></div>\n          <div class="arrow left"></div>\n          <div class="arrow right"></div>\n        </div>\n        <div id="top-arrow" v-show="target.isAlignTop.value">\n          <div class="v-arrow-line"></div>\n          <div class="arrow up"></div>\n          <div class="arrow down"></div>\n        </div>\n        <div id="bottom-arrow" v-show="target.isAlignBottom.value">\n          <div class="v-arrow-line"></div>\n          <div class="arrow up"></div>\n          <div class="arrow down"></div>\n        </div>\n      </div>\n    </div>\n  ',
  data: () => ({
    cssContainer: {
      margin: "3px 8px",
      backgroundColor: "#555556",
      border: "1px solid #2a2a2a",
      boxShadow: "0px 0px 4px #333",
      boxSizing: "content-box",
      position: "relative",
      width: "84px",
      height: "84px",
    },
    cssContainerSize: { width: "84px", height: "84px", visibility: "hidden" },
    cssWidget: {
      width: "80px",
      height: "80px",
      margin: "20px 20px 20px 20px",
      backgroundColor: "#7d7d7d",
      border: "1px solid #2a2a2a",
      borderRadius: "5px",
      boxSizing: "border-box",
      position: "absolute",
      left: "0",
      top: "0",
    },
    cssLine: {
      border: "dashed 0px #a5a5a5",
      width: "0",
      height: "0",
      position: "absolute",
    },
    cssLineH: { width: "84px", borderTopWidth: "1px" },
    cssLineV: { height: "84px", borderLeftWidth: "1px" },
    cssTopLine: { top: "12px", left: "0" },
    cssLeftLine: { left: "12px", top: "0" },
    cssRightLine: { right: "12px", top: "0" },
    cssBottomLine: { bottom: "12px", left: "0" },
    cssHCLine: { top: "0", left: "50%", zIndex: "1" },
    cssVCLine: { top: "50%", left: "0", zIndex: "1" },
  }),
  props: { target: { twoWay: true, type: Object } },
  methods: {
    T: Editor.T,
    _alignStyle() {
      let n = this.target.isAlignTop.value;
      let i = this.target.isAlignLeft.value;
      let t = this.target.isAlignRight.value;
      let o = this.target.isAlignBottom.value;
      const e = 12;
      const s = 84 - e - 42;
      const r = 21;
      function a(n, i) {
        return n ? e : i ? s : r;
      }
      let d = a(n, o);
      let l = a(o, n);
      let p = a(i, t);
      let v = a(t, i);
      return {
        width: `${84 - p - v}px`,
        height: `${84 - d - l}px`,
        marginRight: `${v}px`,
        marginLeft: `${p}px`,
        marginTop: `${d}px`,
        marginBottom: `${l}px`,
      };
    },
  },
});
