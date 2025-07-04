let e = require("fire-fs");
let t = (require("fire-path"), Editor.require("packages://channel-upload-tools/ui/info/item.js"), require("../../package.json"));
const a = 1;

module.exports = {
  name: "upload-list",
  template: e.readFileSync(
    Editor.url("packages://channel-upload-tools/ui/info/list.html"),
    "utf8"
  ),
  props: ["info", "page", "platforms"],
  data: function () {
    return { uploadProgress: 0, pause: false, uploadState: a, progressTips: "" };
  },
  watch: {
    info(e) {
      this.$emit("update:info", e);
    },
  },
  async created() {},
  computed: {
    btnStatus() {
      return this.pause ? this.t("resume") : this.t("pause");
    },
  },
  methods: {
    openBuilder() {
      Editor.Panel.close(t.name);
    },
    t: (e) => Editor.T(`channel-upload-tools.${e}`),
  },
};
