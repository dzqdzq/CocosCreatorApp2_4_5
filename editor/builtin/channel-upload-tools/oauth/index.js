let e = require("fire-fs");
let t = (require("fire-path"), Editor.require("packages://channel-upload-tools/package.json"));
Editor.Panel.extend({
  _vm: null,
  template: e.readFileSync(
    Editor.url("packages://channel-upload-tools/oauth/index.html"),
    "utf8"
  ),
  style: e.readFileSync(
    Editor.url("packages://channel-upload-tools/oauth/index.css")
  ),
  messages: {},
  $: { webview: "#webview" },
  close() {
    Editor.Ipc.sendToPanel(t.name, "oAuthWindowClose", this.platform);
  },
  run(e) {
    this.config = e;
    let a = this.$webview;
    this._vm = new Vue({
      el: this.shadowRoot,
      data: () => ({
        loading: true,
        url: e.url,
        platform: e.platform,
        redirect: e.redirect,
      }),
      methods: {
        clearCache() {
          var e = this.$webview.getWebContents();

          if (void 0 !== e) {
            e.session.clearStorageData([
              "appcache",
              "cookies",
              "filesystem",
              "indexdb",
              "localstorage",
              "shadercache",
              "websql",
              "serviceworkers",
              "cachestorage",
            ]);
          }
        },
        startLoading(e) {
          this.loading = true;
        },
        finishLoading(e) {
          if (a.src.startsWith(this.redirect)) {
            this.notifyLoginResult();
            Editor.Panel.close(`${t.name}.oauth`);
          }

          this.loading = false;
        },
        notifyLoginResult() {
          Editor.Ipc.sendToPanel(
            t.name,
            "loginResult",
            this.platform,
            "success"
          );
        },
      },
      created() {},
    });
  },
});
