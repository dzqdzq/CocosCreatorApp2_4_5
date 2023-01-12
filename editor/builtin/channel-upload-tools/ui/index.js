let t = require("fire-fs"),
  o = require("fire-path");
const e = Editor.require("packages://channel-upload-tools/ui/info/list.js");
Editor.Panel.extend({
  _vm: null,
  template: t.readFileSync(
    Editor.url("packages://channel-upload-tools/ui/index.html"),
    "utf8"
  ),
  style: t.readFileSync(
    Editor.url("packages://channel-upload-tools/ui/index.css"),
    "utf8"
  ),
  messages: {
    loginResult(t, o, e) {
      this._vm.$emit("loginResult", o, e);
    },
    oAuthWindowClose(t, o) {
      this._vm.$emit("oAuthWindowClose", o);
    },
  },
  run(t) {
    t &&
      ((this.args = t),
      this.args &&
        this.args.platform &&
        (this._vm.page = `${this.args.platform}-upload`));
  },
  ready() {
    (this.components = []), this.loadComponents();
    let t = this.components.map((t) => t.platform);
    this.components.push(e),
      (this._vm = new Vue({
        el: this.shadowRoot,
        components: this.components,
        data: function () {
          return { page: "upload-list", info: {}, platforms: t };
        },
        created() {},
        watch: {
          config: {
            handler(t) {
              this.save();
            },
            deep: !0,
          },
        },
        methods: {
          save() {
            this.profile.set("", this.config), this.profile.save();
          },
          t: (t) => Editor.T(`channel-upload-tools.${t}`),
        },
      }));
  },
  loadComponents() {
    try {
      let e = Editor.url("packages://channel-upload-tools/platform");
      t.readdirSync(e).forEach((t) => {
        try {
          o.join(e, t);
          let s = o.join(e, t, "upload.js");
          this.components.push(require(s));
        } catch (o) {
          Editor.error(`Load ${t} (upload.js) plugin failed`);
        }
      });
    } catch (t) {
      Editor.error("Load components failed");
    }
  },
});
