let t = require("fire-fs");
let i = require("fire-path");

const e = Editor.require(
    "packages://channel-upload-tools/platform/huawei/const.js"
  );

const o = Editor.require(
  "packages://channel-upload-tools/platform/huawei/lib/http.js"
);

module.exports = {
  platform: e.PLATFORM,
  name: `${e.PLATFORM}-upload`,
  template: t.readFileSync(
    Editor.url("packages://channel-upload-tools/platform/huawei/upload.html"),
    "utf8"
  ),
  props: ["info", "page"],
  computed: {
    oAuth() {
      return this.config.loginType === e.LOGIN_TYPE.oauth;
    },
    showLoginBtn() {
      return this.oAuth && this.needLogin;
    },
    isLogin() {
      return !this.needLogin && this.oAuth;
    },
  },
  watch: {
    page: function (t) {
      this.$emit("update:page", t);
    },
    info(t) {
      this.$emit("update:info", t);
    },
    async "config.loginType"(t) {
      if (t === e.LOGIN_TYPE.oauth) {
        if (this.loginChecked) {
          return;
        }
        await this.checkNeedLogin();
      }
    },
    config: {
      handler(t) {
        let i = this.profile.get(module.exports.platform) || {};
        i = Object.assign(i, t);
        this.profile.set(module.exports.platform, i);
        this.profile.save();
      },
      deep: true,
    },
  },
  data: function () {
    return {
      config: {
        loginType: e.LOGIN_TYPE.oauth,
        clientId: "",
        clientSecret: "",
        appid: "",
        version: "1.0",
        apkPath: "",
        description: "",
      },
      loginChecked: false,
      loading: false,
      needLogin: true,
      accessToken: "",
      loginType: [
        { type: e.LOGIN_TYPE.oauth, name: this.t("oauth") },
        { type: e.LOGIN_TYPE.client, name: this.t("client") },
      ],
    };
  },
  async created() {
    this._registerEvent();
    this.profile = Editor.Profile.load(e.PROFILE);
    let t = this.profile.get(module.exports.platform) || {};

    Object.keys(this.config).forEach((i) => {
      let e = t[i];

      if (e) {
        this.config[i] = e;
      }
    });

    if (this.config.loginType === e.LOGIN_TYPE.oauth) {
      (await this.checkNeedLogin());
    }
  },
  methods: {
    async checkNeedLogin() {
      if (!(await Editor.User.isLoggedIn())) {
        this.popupWarns(this.t("need_login"));
        return;
      }
      this.loading = true;
      this.needLogin = await o.needLogin();
      this.loading = false;
      this.loginChecked = true;
    },
    _registerEvent() {
      this.$root.$on("loginResult", this.updateLoginResult);
      this.$root.$on("oAuthWindowClose", this.oAuthWindowClose);
    },
    async updateLoginResult(t, i) {
      if (t === module.exports.platform &&
        "success" === i) {
        this.needLogin = await o.needLogin();
        this.accessToken = await o.getOAuthToken();
        this.loading = false;
      }
    },
    async oAuthWindowClose() {
      this.needLogin = await o.needLogin();
      this.loading = false;
    },
    _onChooseDistPathClick(t) {
      t.stopPropagation();
      let e = i.join(Editor.Project.path, "build");

      let o = Editor.Dialog.openFile({
        defaultPath: e,
        filters: [{ name: "application", extensions: ["apk", "rpk", "aab"] }],
      });

      if (o && o[0]) {
        this.config.apkPath = o[0];
      }
    },
    cancelClick() {
      Editor.Panel.close("channel-upload-tools");
    },
    popupWarns(t) {
      Editor.Dialog.messageBox({
        title: this.t("notice_title"),
        message: t,
        buttons: [this.t("confirm")],
        defaultId: 0,
        cancelId: 1,
        noLink: true,
      });
    },
    async oauthClick() {
      this.loading = true;
      if (!(await Editor.User.isLoggedIn())) {
        this.loading = false;
        this.popupWarns(this.t("need_login"));
        return;
      }
      let t = await o.getOAuthUrl();
      if (!t) {
        Editor.error("Get OAuth url fail, please retry");
        return;
      }
      Editor.Panel.open("channel-upload-tools.oauth", {
        platform: e.PLATFORM,
        url: t.url,
        redirect: t.redirect,
        method: "loginResult",
      });
    },
    async uploadClick() {
      return this.config.version
        ? this.config.appid
          ? this.config.apkPath &&
            t.existsSync(i.normalize(this.config.apkPath))
            ? this.oAuth || this.config.clientId
              ? this.oAuth || this.config.clientSecret
                ? this.oAuth && this.needLogin
                  ? (this.popupWarns(this.t("need_huawei_login")),
                    this.oauthClick(),
                    void 0)
                  : ((this.info = { config: this.config }),
                    (this.page = "upload-list"),
                    void 0)
                : (this.popupWarns(this.t("need_client_secret")), void 0)
              : (this.popupWarns(this.t("need_clientid")), void 0)
            : (this.popupWarns(this.t("need_apk")), void 0)
          : (this.popupWarns(this.t("need_appid")), void 0)
        : (this.popupWarns(this.t("need_version")), void 0);
    },
    async logoutClick() {
      this.loading = true;
      try {
        await o.logout();
        await this.checkNeedLogin();
      } catch (t) {}
      this.loading = false;
    },
    t: (t) => Editor.T(`channel-upload-tools.${t}`),
  },
};
