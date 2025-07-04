Editor.Panel.extend({
  style: "\n  ",
  template:
    "\n  <div class=\"wrapper\" style=\"overflow-x: hidden; overflow-y: auto; height:100%;\">\n    <ui-webview id='webview' class='fit' style='height: 100%;' id=\"online\" src='https://www.cocos.com/service'></ui-webview>\n  </div>\n  ",
  $: { webview: "#webview" },
  ready() {
    const e = document.createElement("style");
    e.innerHTML = "ui-dock-tabs#tabs {display: none;}";
    document.querySelector("ui-dock-panel").shadowRoot.appendChild(e);
    this.$webview.shadowRoot.getElementById("view").className += "fit";
    this.$webview.src = "http://baidu.com";
  },
  run(e) {
    console.log(e);
    this.$webview.src = e.url;
    document.title = e.title;
  },
  messages: {
    "vue-test:hello"(e) {
      this.$label.innerText = "Hello!";
    },
  },
});
