Editor.Panel.extend({
  style: "\n    :host { margin: 5px; }\n    h2 { color: #f90; }\n  ",
  template:
    '\n    <h2>构建 rpk 信息</h2>\n    <hr />\n    <div><span id="label" style="color:red;font-size:16px;"></span></div>\n  ',
  $: { label: "#label" },
  run(n) {
    this.$label.innerText = n;
  },
});
