let e = require("fire-fs"),
  o = require("fire-path");
(module.exports = {
  name: "upload-item",
  template: e.readFileSync(
    Editor.url("packages://channel-upload-tools/ui/info/item.html"),
    "utf8"
  ),
  components: (function () {
    let r = [],
      t = Editor.url("packages://channel-upload-tools/platform");
    return (
      e.readdirSync(t).forEach((e) => {
        o.join(t, e);
        let a = o.join(t, e, "info.js");
        try {
          r.push(require(a));
        } catch (o) {
          Editor.error(`Load ${e} (info.js) failed`);
        }
      }),
      r
    );
  })(),
  props: ["info", "platform", "page"],
  data: function () {
    return {};
  },
  computed: {
    compName() {
      return `${this.platform}-info`;
    },
  },
  methods: {},
}),
  Vue.component(module.exports.name, module.exports);
