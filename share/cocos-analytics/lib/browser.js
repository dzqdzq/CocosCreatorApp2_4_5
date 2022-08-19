const e = require("electron").app,
  t = require("electron").ipcMain,
  a = require("http"),
  o = require("https"),
  n = require("node-uuid"),
  s = require("./encrypt"),
  { caAppID: r, caURL: i, caEncryptURL: l } = require("./config"),
  { EventEmitter: c } = require("events");
(module.exports = new (class extends c {
  constructor() {
    super(),
      (this._openTime = Date.now()),
      (this._showLog = !1),
      (this._defaultParams = {
        appVersion: `CocosCreator_${e.getVersion()}`,
        versionCode: "v1",
        uniqueID: this.user.userId + "",
        appID: r,
        platform: "darwin" === process.platform ? "Mac" : "Windows",
        engine: "electron",
        userID: this.user.userId + "",
        packageName: "",
        osVersion: require("os").release(),
        store: "",
        confinfo: "creator.cocos.com",
      }),
      this.loadLogStatus();
  }
  loadLogStatus() {
    let e = Editor.Profile.load("global://features.json");
    this._showLog = !!e.get("debug-analytics");
  }
  init() {}
  get openTime() {
    return this._openTime;
  }
  updateOpenTime() {
    this._openTime = Date.now();
  }
  get user() {
    let e = Editor.Profile.load("global://user_token.json");
    return {
      userName: e.get("nickname"),
      email: e.get("email"),
      userId: e.get("cocos_uid"),
    };
  }
  _genMsgID() {
    return n.v4();
  }
  trackCocosEvent(t, a) {
    if (!t || !a || !a.projectId) return;
    let o = this.defaultParams;
    a.store && ((o.store = a.store), delete a.store),
      a.packageName && ((o.packageName = a.packageName), delete a.packageName),
      (o.language = e.getLocale() || "unknown"),
      (o.eventID = t),
      (o.eventValue = a),
      (o.eventTag = "succeed"),
      this._showLog && console.log("send analytics --\x3e", JSON.stringify(o));
    let n = l + encodeURIComponent(s.encryptPostData(JSON.stringify(o)));
    this._get(n);
  }
  trackEvent(t) {
    let a = { action: t.action };
    t.label && (a.label = t.label), t.value && (a = Object.assign(a, t.value));
    let o = "succeed";
    t.value && t.value.eventTag && ((o = t.value.eventTag), delete a.eventTag);
    let n = this.defaultParams;
    (n.language = e.getLocale() || "unknown"),
      (n.eventID = t.category),
      (n.eventValue = a),
      (n.eventTag = o),
      t.exitTag && ((n.exitTag = t.exitTag), (n.eventTag = t.exitTag)),
      t.onlineDuration && (n.onlineDuration = t.onlineDuration);
    let s = i + encodeURIComponent(JSON.stringify(n));
    this._get(s);
  }
  _get(e) {
    (e.startsWith("https://") ? o : a)
      .get(e, (e) => {
        e.on("data", (e) => {
          this._showLog &&
            console.log("receive analytics data --\x3e", e.toString());
        });
      })
      .on("error", (e) => {
        this._showLog && console.error("send analytics data fail", e);
      });
  }
  trackException(e) {
    let t = this.defaultParams;
    (t.eventID = "exception"),
      (t.eventValue = { desc: e }),
      (t.eventTag = "succeed");
    let a = i + encodeURIComponent(JSON.stringify(t));
    this._get(a);
  }
  get defaultParams() {
    return (
      (this._defaultParams.eventID = void 0),
      (this._defaultParams.eventValue = void 0),
      (this._defaultParams.eventTag = void 0),
      (this._defaultParams.msgID = this._genMsgID()),
      (this._defaultParams.chargeTime = String(Date.now())),
      this._defaultParams
    );
  }
})()),
  t.on("cocos-metrics:track-event", (e, t) => {
    module.exports.trackEvent(t, null);
  }),
  t.on("cocos-metrics:track-cocos-event", (e, t) => {
    module.exports.trackCocosEvent(t, null);
  }),
  t.on("cocos-metrics:track-exception", (e, t) => {
    module.exports.trackException(t, null);
  });
