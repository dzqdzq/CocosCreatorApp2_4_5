let t = require("fire-fs");
let e = require("fire-path");

const { Api: i } = Editor.require(
    "packages://channel-upload-tools/platform/huawei/lib/api.js"
  );

const { ErrorCode: a } = Editor.require(
  "packages://channel-upload-tools/platform/huawei/lib/entity.js"
);

const o = Editor.require(
  "packages://channel-upload-tools/platform/huawei/const.js"
);

const s = Editor.require(
  "packages://channel-upload-tools/platform/huawei/lib/http.js"
);

const r = {
  fail: 0,
  idle: 1,
  fetch_token: 2,
  fetch_token_fail: 3,
  fetch_url: 4,
  fetch_url_fail: 5,
  upload: 6,
  upload_fail: 7,
  update_info: 8,
  update_info_fail: 9,
  success: 10,
  cancel: 11,
};

module.exports = {
  name: `${o.PLATFORM}-info`,
  template: t.readFileSync(
    Editor.url("packages://channel-upload-tools/platform/huawei/info.html"),
    "utf8"
  ),
  props: ["info", "page"],
  data: function () {
    return {
      toggle: false,
      uploadProgress: 0,
      pause: false,
      uploadState: r.idle,
      progressTips: "",
      history: [],
      cancel: false,
    };
  },
  async created() {
    this.loadHistory();

    if (this.needUpload) {
      await this.prepareApi();
      await this.uploadApk();
    }
  },
  watch: {
    history: {
      deep: true,
      handler() {
        this.save();
      },
    },
    page: function (t) {
      this.$emit("update:page", t);
    },
  },
  computed: {
    btnStatus() {
      return this.pause ? this.t("resume") : this.t("pause");
    },
    historyTips() {
      return (this.toggle ? "▼ " : "▶ ") + this.t("history");
    },
    uploading() {
      return (
        !!this.info.config &&
        this.info.config.version &&
        this.uploadState !== r.success &&
        this.uploadState !== r.cancel
      );
    },
    needUpload() {
      return !!this.info.config && this.info.config.version;
    },
    showBtns() {
      return !this.cancel && this.uploading;
    },
  },
  methods: {
    toggleClick() {
      this.toggle = !this.toggle;
    },
    returnClick() {
      this.cancelClick();
      this.page = `${o.PLATFORM}-upload`;
    },
    cancelClick() {
      this.cancel = true;
      this.checkCancel();
    },
    loadHistory() {
      this.profile = Editor.Profile.load(o.PROFILE);
      let t = this.profile.get(o.PLATFORM) || {};
      this.history = t.history || [];
    },
    addHistory() {
      if (this.history.length >= o.MAX_HISTORY_LENGTH) {
        this.history.pop();
      }

      this.history.unshift({
        time: Date.now(),
        description: this.info.config.description,
        version: this.info.config.version,
      });
    },
    changeState(t) {
      let e = this.getStateKey(t);
      this.uploadState = t;
      this.progressTips = this.t(e);
    },
    getStateKey(t) {
      for (let e in r) if (t === r[e]) {
        return e;
      }
    },
    formatTime: (t) =>
      new Date(t).toLocaleString("zh" === Editor.lang ? "zh-cn" : "en"),
    save() {
      let t = this.profile.get(o.PLATFORM);

      if (t) {
        t.history = this.history;
        this.profile.set(o.PLATFORM, t);
        this.profile.save();
      }
    },
    checkCancel() {
      return (!!this.cancel && ((this.uploadProgress = 0), this.changeState(r.cancel), true));
    },
    async prepareApi() {
      let t;
      if (this.info.config.loginType === o.LOGIN_TYPE.oauth) {
        t = await s.getOAuthToken();
      } else {
        t = (
          await i.getAccessToken(
            this.info.config.clientId,
            this.info.config.clientSecret
          )
        ).accessToken;
      }
      this.api = new i(
        this.info.config.loginType,
        t,
        this.info.config.clientId
      );
    },
    async uploadApk() {
      this.uploadProgress = 10;
      if (this.checkCancel()) {
        return;
      }
      this.uploadProgress = 20;
      this.changeState(r.fetch_url);
      let t = await this.api.getUploadUrl(this.info.config.appid, "apk");
      if (t.code !== a.success) {
        this.changeState(r.fetch_url_fail);
        Editor.error("Fetch upload url fail,", t.errorMessage);
        return;
      }
      if (this.checkCancel()) {
        return;
      }
      this.uploadProgress = 30;
      this.changeState(r.upload);
      let i = await this.api.uploadFile(
        t.uploadUrl,
        this.info.config.apkPath,
        t.authCode
      );
      if (i.code !== a.success) {
        this.changeState(r.upload_fail);
        Editor.error("Upload fail,", i.errorMessage);
        return;
      }
      if (this.checkCancel()) {
        return;
      }
      this.uploadProgress = 90;
      let o = e.basename(this.info.config.apkPath);
      this.changeState(r.update_info);
      let s = await this.api.updateApkInfo(
        this.info.config.appid,
        o,
        i.files[0].fileDestUrl
      );
      if (s.code !== a.success) {
        this.changeState(r.update_info_fail);
        Editor.error("Update apk info fail,", s.errorMessage);
        return;
      }
      this.changeState(r.success);
      this.uploadProgress = 100;
      this.addHistory();
    },
    t: (t) => Editor.T(`channel-upload-tools.${t}`),
  },
};
