"use strict";
const e = require("electron");
const t = require("fire-fs");
const r = require("vue/dist/vue");
const o = Editor.require("app://share/@base/electron-base-ipc");
const s = Editor.require("packages://store/main/utils/network.js");
let i = (t) => e.shell.openExternal(t);

let a = (e, t) =>
  `https://creator-api.cocos.com/api/account/client_signin?session_id=${e}&client_type=2&redirect_url=${encodeURIComponent(
    t
  )}`;

let n = null;
e.ipcRenderer.on("store:update", () => n && n.updateStoreList());

exports.template = t.readFileSync(
    require("path").join(__dirname, "./index.html"),
    "utf8"
  );

exports.$ = { webview: "webview", uiLoader: "ui-loader" };
exports.messages = { update: () => n && n.updateStoreList() };

exports.ready = async function () {
  document.title = Editor.T("MAIN_MENU.package.store");

  const e = this.$.webview instanceof HTMLElement
    ? this.$.webview
    : document.querySelector("webview");

  const t = this.$.uiLoader instanceof HTMLElement
    ? this.$.uiLoader
    : document.querySelector("ui-loader");

  const d = await o.send("creator-libs-user:call", "getUserData").promise();
  var l = `${
    (
      await (async () =>
        await s.post(
          "https://creator-api.cocos.com/api/service/get_store_setting",
          null
        ))()
    ).data.entry_url
  }/creator/index/#/c?language=${Editor.lang}`;
  requestAnimationFrame(() => e.setAttribute("src", a(d.session_id, l)));

  e.setAttribute(
    "preload",
    `file://${Editor.url("packages://store/panel/preload.js")}`
  );

  e.addEventListener("did-navigate-in-page", (e) => {
    console.log(`本地导航 - ${e.url}`);

    if (/(app\/|app)/.test(e.url)) {
      t.remove();
    }

    if (/order\_pay/.test(e.url)) {
      i(a(d.session_id, e.url));
      e.stopPropagation();
      e.preventDefault();
      return;
    }
  });

  e.addEventListener(
    "new-window",
    (e) => (
      e.stopPropagation(),
      e.preventDefault(),
      console.log(`打开新页面 - ${e.url}`),
      /pay/.test(e.url)
        ? (i(a(d.session_id, e.url)), void 0)
        : /\/creator\/download/.test(e.url)
        ? (Editor.Ipc.sendToPackage("store", "download", e.url),
          n && (n.show.slider = true),
          void 0)
        : /cocos\.[com|org|net]/.test(e.url)
        ? (i(a(d.session_id, e.url)), void 0)
        : /cocos\.[com|org|net]/.test(e.url)
        ? void 0
        : (i(e.url), void 0)
    )
  );

  e.addEventListener("ipc-message", (t) => {
    switch (t.channel) {
      case "__translate":
        e.send("__translate_finished", Editor.T(t.args[0]));
        break;
      case "__cocos_jump":
        i(a(d.session_id, t.args[0]));
        break;
      case "__normal_jump":
        i(t.args[0]);
    }
  });

  n = new r({
      el: document.querySelector(".content"),
      data: { show: { slider: false }, list: [] },
      components: { slider: require("./components/slider") },
      methods: {
        updateStoreList() {
          Editor.Ipc.sendToPackage(
            "store",
            "query-download-list",
            (e, t) => (this.list = t)
          );
        },
        goBack() {
          e.goBack();
        },
        goForward() {
          e.goForward();
        },
        goHome() {
          e.src = l;
        },
        reload() {
          e.reload();
        },
      },
      ready() {
        this.updateStoreList();
      },
    });
};
