window.CocosServices = {};
window.ccServices = {};
let e = Editor.require("packages://cocos-services/panel/utils/ccServices.js");
let i = Editor.require("packages://cocos-services/panel/utils/utils.js");
let s = Editor.require("packages://cocos-services/panel/utils/serviceConfig.js");
Editor.require("packages://cocos-services/panel/utils/ccServicesAnalytics.js");
let t = Editor.require("packages://cocos-services/panel/bindGame/bindGame.js");

let r = Editor.require(
  "packages://cocos-services/panel/serviceList/serviceList.js"
);

let a = Editor.require(
  "packages://cocos-services/panel/serviceDetail/serviceDetail.js"
);

let c = Editor.require("packages://cocos-services/panel/toast/toast.js");
let n = require("fs");
window.fs = n;
window.ccServices = e;
const o = i.getProjectID();
let d = async () => {
  await e.init();
};
Editor.Panel.extend({
  style: n.readFileSync(
    Editor.url("packages://cocos-services/panel/assets/style.css", "utf8")
  ),
  template: `\n  <body class='body'>\n    <div id="loader-wrapper">\n      <div id="loader"></div>\n      <div class="loader-section section-left"></div>\n      <div class="loader-section section-right"></div>\n      <br>\n      <div class="load_title">\n        <br>\n        ${i.t(
    "load_cocos_services"
  )}\n        <br>\n        <span> V${e.getCreatorVersion()}</span>\n      </div>\n    </div>\n    <div v-if="refresh" style="overflow-x: hidden; overflow-y: auto; height:100%;">\n      <toast v-show="visible" :message="message" :visible="visible" :status="status"></toast>\n      <bind-game v-if="isShowBindGame" :islogin="isLogin" @back-home="backHome" @bind-game="bindGameLogic"></bind-game>\n      <service-list v-if="isShowHome" :isCompanyGame="isCompanyGame" :game="game" :services="services" @service-item-click="serviceItemClick" @bind-game="bindGame" @unbind-game="unbindGame"></service-list>\n      <service-detail v-if="isShowService" @back-home="backHome" @enable-service="enableService" :service="service"></service-detail>\n      <ui-loader class="massive" v-if="isDownloadServicePackage"><div style="margin-top:10px; font-size: 14px;">{{ downloadTip }}</div></ui-loader>\n    </div>\n  </body>\n  `,
  $: { loader_wrapper: "#loader-wrapper", loader_service: "ui-loader" },
  async ready() {
    this.$loader_service.hidden = true;
    await d();
    t.init();
    r.init();
    a.init();
    c.init();
    Editor.User.on("login", d);
    Editor.User.on("logout", d);
    e.registerServiceComponent();

    Editor.Ipc.sendToMain(
      "cocos-services:panel-status-changed",
      "cocos-services",
      true
    );

    if (
      (0 !== this.clientHeight)
    ) {
      var v = s.readBindGame();

      if (!v) {
        v = { app_id: "UNKNOW" };
      }

      if (window.ccServicesAnalytics) {
        window.ccServicesAnalytics.init(e.getUserData().cocos_uid, v, {});
      }

      if (window.ccServicesAnalytics) {
        window.ccServicesAnalytics.openServicePanel();
      }
    }

    this._vm = (function (t) {
      return new window.Vue({
        el: t.shadowRoot,
        data: {
          message: "123",
          visible: false,
          refresh: true,
          status: 2,
          isLogin: false,
          isBindGame: false,
          isShowBindGame: false,
          isShowHome: true,
          isShowService: false,
          isCompanyUser: false,
          isCompanyGame: false,
          isItemClickToBindGame: false,
          isUpdate: false,
          isDownloadServicePackage: false,
          downloadTip: i.t("installing"),
          service: {},
          game: { name: i.t("unknow_game"), appid: "UNKNOW" },
          user: {},
          services: [],
        },
        watch: {
          async game(i, t) {
            var r = s.readEnableService();
            for (var a of this.services) {
              Vue.set(a, "enable", -1 !== r.indexOf(a.service_id));

              if ("UNKNOW" === i.appid) {
                a.service_type;
              } else {
                "0" === i.cid;
                a.service_type;
              }

              Vue.set(a, "hovered", true);
            }

            if (e.getUserIsLogin()) {
              (await e.getGameDetail(this.game.appid));
            }
          },
        },
        created() {
          t.$loader_wrapper.hidden = true;
          t.$loader_service.hidden = false;
          var r = s.readBindGame();

          if (r && "UNKNOW" != r.appid && this.checkGameOwner(r)) {
            this.game = r;
            this.isBindGame = true;
            this.isCompanyGame = "0" !== r.cid;
          } else {
            this.game = { name: i.t("unknow_game"), appid: "UNKNOW" };
            this.isBindGame = false;
            this.isCompanyGame = false;
            s.writeBindGame(this.game);
          }

          this.services = s
              .readServiceList()
              .map((e) =>
                Object.assign(e, {
                  service_price: i.replaceTagAtoUILink(e.service_price),
                  service_protocol: i.replaceTagAtoUILink(e.service_protocol),
                  service_desc: i.replaceTagAtoUILink(e.service_desc),
                })
              );

          this.user = e.getUserData();
          this.isCompanyUser = 0 !== this.user.corporation_id;
          this.isLogin = e.getUserIsLogin();
          this.readEnableService();
          var a = i.getCreatorHomePath() + "/services";

          if (!n.existsSync(a)) {
            i.mkdirs(a);
          }

          this.watchFiles(a, (s, t, r) => {
            if (s &&
              !e.CocosServicesUpdate) {
              this.enableService(t, false);

              i.printToCreatorConsole(
                "warn",
                r + " - " + i.t("service_delete_accident")
              );

              this.isShowHome = false;
              this.isShowService = false;
              this.isShowBindGame = true;

              this.$nextTick(() => {
                this.isShowHome = true;
                this.isShowService = false;
                this.isShowBindGame = false;
              });
            }
          });

          e.removeAll("service:query-service-enable");

          e.on("service:query-service-enable", (e, i) => {
            if (!this.isBindGame) {
              return i && i(null, false);
            }
            for (var s of this.services)
              if (s.service_component_name === e.service_component_name) {
                return i && i(null, s.enable);
              }

            if (i) {
              i(null, "test");
            }
          });

          e.removeAll("service:refresh-panel");

          e.on("service:refresh-panel", (e, i) => {
            this.game = s.readBindGame();

            if ("UNKNOW" != this.game.appid) {
              this.isBindGame = true;
            }

            this.refresh = false;
            this.$nextTick(() => (this.refresh = true));

            if (i) {
              i(null, "");
            }
          });

          e.removeAll("service:goto-service");

          e.on("service:goto-service", (e, i) => {
            if (!e.service_name) {
              return;
            }
            let s = e.service_name;

            if (!s.match(/^service-[a-z]+/)) {
              s = `service-${s}`;
            }

            let t = this.services.find((e) => e.service_component_name === s);
            return void 0 === t
              ? i && i(new Error("Service name not extits!"), "")
              : 0 !== t.service_type && "UNKNOW" === this.game.appid
              ? i && i(new Error("Cannot find binds game!"), "")
              : (this.serviceItemClick(t),
                (this.refresh = false),
                this.$nextTick(() => (this.refresh = true)),
                i && i(null, ""),
                void 0);
          });
        },
        methods: {
          showTips: function (e, i, s = 1500) {
            this.visible = true;
            this.status = e;
            this.message = i;

            if (-1 !== s) {
              setTimeout(() => (this.visible = false), s);
            }
          },
          utils_t: function (e, ...s) {
            return i.t(e, ...s);
          },
          backHome: function () {
            this.isShowHome = true;
            this.isShowService = false;
            this.isShowBindGame = false;
          },
          serviceItemClick: function (e) {
            if ("UNKNOW" != this.game.appid) {
              if (this.isCompanyUser) {
                if (this.isCompanyGame) {
                  if ("1" === e.service_type) {
                    i.printToCreatorConsole(
                      "warn",
                      this.utils_t("select_person_service")
                    );

                    return;
                  }
                } else {
                  if ("2" === e.service_type) {
                    i.printToCreatorConsole(
                      "warn",
                      this.utils_t("select_company_service")
                    );

                    return;
                  }
                }
              } else {
                if ("2" === e.service_type) {
                  i.printToCreatorConsole(
                    "warn",
                    this.utils_t("select_company_service")
                  );

                  return;
                }
              }
            }
            this.isShowHome = false;

            if (window.ccServicesAnalytics) {
              window.ccServicesAnalytics.init(
                this.user.cocos_uid,
                this.game,
                e
              );
            }

            if ("0" === e.service_type || this.isBindGame) {
              this.isShowService = true;
              this.isShowBindGame = false;

              if (window.ccServicesAnalytics) {
                window.ccServicesAnalytics.enterService();
              }
            } else {
              this.isShowService = false;
              this.isShowBindGame = true;
              this.isItemClickToBindGame = true;

              if (window.ccServicesAnalytics) {
                window.ccServicesAnalytics.enterBindCocosAppID();
              }
            }

            var s = e.service_dev_url;

            if (s.match(/<app_id>/)) {
              s = s.replace("<app_id>", this.game.appid);
            } else {
              if (s.match(/app_id=\d+/)) {
                s = s.replace(/app_id=\d+/, `app_id=${this.game.appid}`);
              }
            }

            e.service_dev_url = s;
            this.service = e;
          },
          checkGameOwner: function (s) {
            var t = e.getGameLists();
            if (!t) {
              return false;
            }
            for (var r of t.data) if (r.app_id === s.appid) {
              return true;
            }
            i.printToCreatorConsole("warn", this.utils_t("not_owner"));
            return false;
          },
          bindGameLogic: async function (t) {
            this.game = t;
            if (("" !== o)) {
              var r = await e.associateProjectID(this.game.appid, o, 1);
              if (0 !== r.status) {
                i.printToCreatorConsole(
                  "warn",
                  i.validateString(r.msg)
                    ? `${r.msg} err_code: ${r.status}`
                    : `${this.utils_t("bind_game_failed")} err_code: ${
                        r.status
                      }`
                );

                return;
              }
            }
            s.writeBindGame(this.game);

            if ("UNKNOW" != t.appid) {
              this.isBindGame = true;
            }

            if (window.ccServicesAnalytics) {
              window.ccServicesAnalytics.init(
                this.user.cocos_uid,
                this.game,
                this.service
              );
            }

            if (window.ccServicesAnalytics) {
              window.ccServicesAnalytics.associateAppID();
            }

            if (this.isItemClickToBindGame) {
              this.isShowHome = false;
              this.isShowService = true;

              if ("0" === this.game.cid && "2" === this.service.service_type) {
                i.printToCreatorConsole(
                      "warn",
                      this.utils_t("select_company_service")
                    );

                setTimeout(() => {
                  Editor.Dialog.messageBox({
                    title: this.utils_t("dialog_title"),
                    message: this.utils_t("select_company_service"),
                    buttons: [this.utils_t("btn_ok")],
                    defaultId: 0,
                    noLink: true,
                  });

                  this.isShowHome = true;
                  this.isShowService = false;
                }, 1e3);
              } else {
                if ("0" !== this.game.cid &&
                    "1" === this.service.service_type) {
                  i.printToCreatorConsole(
                        "warn",
                        this.utils_t("select_person_service")
                      );

                  setTimeout(() => {
                    Editor.Dialog.messageBox({
                      title: this.utils_t("dialog_title"),
                      message: this.utils_t("select_person_service"),
                      buttons: [this.utils_t("btn_ok")],
                      defaultId: 0,
                      noLink: true,
                    });

                    this.isShowHome = true;
                    this.isShowService = false;
                  }, 1e3);
                }
              }

              if (this.isShowService &&
                window.ccServicesAnalytics) {
                window.ccServicesAnalytics.enterService();
              }
            } else {
              this.isShowHome = true;
              this.isShowService = false;
            }

            this.isShowBindGame = false;
            this.isCompanyGame = "0" !== this.game.cid;
            this.readEnableService();
          },
          readEnableService: function () {
            var t = s.readEnableService();
            for (var r of this.services) {
              Vue.set(r, "enable", t.indexOf(r.service_id) >= 0);

              if (r.enable) {
                if (!e.serviceExists(r.service_component_name)) {
                  i.printToCreatorConsole(
                        "warn",
                        r.service_name + this.utils_t("service_not_install")
                      );

                  this.isDownloadServicePackage = true;

                  e.installServicePackage(
                    r.package_download_url,
                    r.service_component_name,
                    (e) => {
                      this.downloadTip = e.text;
                      this.isDownloadServicePackage = false;

                      this.$nextTick(
                        () => (this.isDownloadServicePackage = true)
                      );

                      if (e.complete) {
                        if ("failed" === e.text) {
                          i.printToCreatorConsole(
                            "warn",
                            this.utils_t("download_failed")
                          );
                        }

                        this.isDownloadServicePackage = true;

                        this.$nextTick(
                          () => (this.isDownloadServicePackage = false)
                        );
                      }
                    }
                  );
                }
              }
            }
          },
          unbindGame: async function () {
            this.isBindGame = false;
            if (("" !== o)) {
              var t = await e.associateProjectID(this.game.appid, o, 0);
              if (0 !== t.status) {
                i.printToCreatorConsole(
                  "warn",
                  i.validateString(t.msg)
                    ? `${t.msg} err_code: ${t.status}`
                    : `${this.utils_t("unbind_game_failed")} err_code: ${
                        t.status
                      }`
                );

                return;
              }
            }
            this.game = { name: i.t("unknow_game"), appid: "UNKNOW" };
            s.writeBindGame(this.game);
            this.readEnableService();
            e.emit("service:refresh-panel");

            if (window.ccServicesAnalytics) {
              window.ccServicesAnalytics.unassociateAppID();
            }

            if (window.ccServicesAnalytics) {
              window.ccServicesAnalytics.init(
                this.user.cocos_uid,
                this.game,
                this.service
              );
            }
          },
          bindGame: function () {
            this.isShowHome = false;
            this.isShowBindGame = true;
            this.isItemClickToBindGame = false;

            if (window.ccServicesAnalytics) {
              window.ccServicesAnalytics.enterBindCocosAppID();
            }
          },
          enableService: function (e, i) {
            for (var t of this.services) if (t.service_id === e) {
              t.enable = i;
              s.wirteEnableService(e, t.enable);
            }
          },
          watchFiles: function (e, s) {
            var t = this.services;
            i.watch.createMonitor(e, (i) => {
              i.on("removed", (i, r) => {
                var a = i.substr(e.length + 1);
                if (a.indexOf("/") <= -1) {
                  for (var c of t)
                    if (c.service_component_name.indexOf(a) >= 0) {
                      if (s) {
                        s(true, c.service_id, c.service_name);
                      }

                      return;
                    }
                }
              });
            });
          },
        },
      });
    })(this);

    window.CocosServices = this._vm;

    if (this.argv) {
      e.emit("service:goto-service", this.argv, (e, i) => {});
    }
  },
  run(i) {
    this.argv = i;

    if (this.argv) {
      e.emit("service:goto-service", this.argv, (e, i) => {});
    }
  },
  close() {
    Editor.User.removeListener("login", d);
    Editor.User.removeListener("logout", d);

    Editor.Ipc.sendToMain(
      "cocos-services:panel-status-changed",
      "cocos-services",
      false
    );
  },
  listeners: {
    "panel-show"() {
      try {
        var i = s.readBindGame();

        if (!i) {
          i = { app_id: "UNKNOW" };
        }

        if (window.ccServicesAnalytics) {
          window.ccServicesAnalytics.init(e.getUserData().cocos_uid, i, {});
        }

        if (window.ccServicesAnalytics) {
          window.ccServicesAnalytics.openServicePanel();
        }
      } catch (e) {}
    },
  },
  messages: {
    "before-change-files"(i, s) {
      e.execInstallNativePlatformScript(s, (e) => {
        1;

        if (i.reply) {
          i.reply(null, "Cocos Service install successfully");
        }
      });
    },
    "plugin-messages"(i, s, t) {
      e.emit(s, t, (e, s) => i.reply && i.reply(e, s));
    },
  },
});
