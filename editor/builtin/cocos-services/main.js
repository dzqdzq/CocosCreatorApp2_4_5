"use strict";
async function e(e, i) {
  let r = Editor.require("packages://cocos-services/panel/utils/ccServices.js");
  await r.execInstallNativePlatformScript(e, (e) => e && i());
  i();
}
async function i(e = false) {
  let i = Editor.require("packages://cocos-services/panel/utils/ccServices.js");
  await i.init(e);

  if (!e) {
    Editor.info("Cocos Service load base data!");
  }
}
function r() {
  i(true);
  Editor.info("Cocos Service reload base data!");
}
function s() {
  i(true);
}
let a = (e, i) => ({ status: e, msg: i });
module.exports = {
  panelStatus: {},
  load() {
    Editor.Builder.removeListener("before-change-files", e);
    Editor.Builder.on("before-change-files", e);
    Editor.User.removeListener("login", r);
    Editor.User.removeListener("logout", s);
    Editor.User.on("login", r);
    Editor.User.on("logout", s);
    i();
    this.downloadImPlugin();
  },
  unload() {
    Editor.Builder.removeListener("before-change-files", e);
    Editor.User.removeListener("login", r);
    Editor.User.removeListener("logout", s);
  },
  loadImPlugin: async (e, i) =>
    new Promise((r, s) => {
      Editor.Package.unload(`${i}/${e}`, () => {
        Editor.Package.load(`${i}/${e}`, () => r());
      });
    }),
  async downloadImPlugin() {
    try {
      let r = require("./panel/utils/utils");
      let s = require("./panel/utils/ccServices");
      let a = require("fs");
      if (a.existsSync(`${r.getCreatorHomePath()}/packages/im-plugin`) ||
      a.existsSync(`${r.getProjectPath()}/packages/im-plugin`)) {
        return;
      }
      await s.init();
      var e = await s.getIMSettings();
      var i = r.getCreatorHomePath() + "/download/im-plugin.zip";
      let o = r.getCreatorHomePath() + "/packages/";
      require("./panel/utils/network").download(
        e.data.plugin_url,
        i,
        (e, s) => {
          if (!(e || "complete" !== s.status)) {
            r.unzip(i, o, (e) => {
              if (a.existsSync(i)) {
                a.unlinkSync(i);
              }

              if (!e) {
                this.loadImPlugin("im-plugin", o);
              }
            });
          }
        }
      );
    } catch (e) {
      console.log(e);
    }
  },
  messages: {
    log(e, i) {
      Editor.log(i);
    },
    error(e, i) {
      Editor.error(i);
    },
    info(e, i) {
      Editor.info(i);
    },
    warnning(e, i) {
      Editor.warn(i);
    },
    success(e, i) {
      Editor.success(i);
    },
    failed(e, i) {
      Editor.failed(i);
    },
    open(e, i) {
      Editor.Panel.open("cocos-services");
    },
    "panel-status-changed"(e, i, r) {
      this.panelStatus[i] = r;
    },
    openBrowser(e, i) {
      Editor.Panel.open("cocos-services-browser", i);
    },
    execH5Script(e, i) {
      Editor.require(
        "packages://cocos-services/panel/utils/ccServices.js"
      ).execInstallH5PlatformScript(i.service, i.params, i.enable);
    },
    "plugin-messages"(e, i, r) {
      if (this.panelStatus["cocos-services"]) {
        Editor.Ipc.sendToPanel(
          "cocos-services",
          "plugin-messages",
          i,
          r,
          (i, r) => e.reply && e.reply(null, r)
        );
      }
    },
    async "tcb-get-temp-key"(e, i) {
      let r = Editor.require(
          "packages://cocos-services/panel/utils/ccServices.js"
        );

      let s = Editor.require(
        "packages://cocos-services/panel/utils/serviceConfig.js"
      );

      for (var a of s.readServiceList())
        if ("service-tcb" === a.service_component_name) {
          var o = s.readBindGame().appid;
          var t = await r.getTCBTempKey(a.service_id, o);

          if (e.reply) {
            e.reply(null, t);
          }

          return;
        }
    },
    "change-float-window-size"(e, i, r) {
      require("electron")
        .BrowserWindow.fromWebContents(e.sender)
        .setContentSize(i, r, true);
    },
    async "open-service"(e, i, r) {
      if (!i.match(/^service-[a-z]+/)) {
        i = `service-${i}`;
      }

      let s = Editor.require(
          "packages://cocos-services/panel/utils/ccServices.js"
        );

      let o = Editor.require(
        "packages://cocos-services/panel/utils/serviceConfig.js"
      );

      let t = Editor.require("packages://cocos-services/panel/utils/utils.js");
      let c = o.readServiceList().find((e) => e.service_component_name === i);
      if (void 0 === c) {
        return e.reply && e.reply(null, a(-1, t.t("service_name_error")));
      }
      let n = o.readBindGame();
      if ("UNKNOW" === n.appid) {
        let i = await s.createGame(t.getProjectName());
        if (0 !== i.status) {
          return e.reply && e.reply(null, a(i.status, i.msg));
        }
        n.appid = i.data.app_id;
        n.name = i.data.game_name;
        n.cid = 0;
        o.writeBindGame(n);

        t.printToCreatorConsole(
          "log",
          t
            .t("create_associate_game")
            .replace("${appid}", n.appid)
            .replace("${name}", n.name)
        );
      }
      let l = await s.getGameDetail(n.appid);

      if ("0" !== c.service_type && l.data.service.indexOf(c.service_id) < 0) {
        if (r) {
          s.openService(n.appid, c.service_id, (e, i) => {
            if (!e) {
              return t.printToCreatorConsole(
                "error",
                `Open Service Failed: code = ${i.status}, msg = ${i.msg}`
              );
            }
            o.wirteEnableService(c.service_id, true);

            t.printToCreatorConsole(
              "log",
              t.t("silence_open_service").replace("${name}", c.service_name)
            );

            Editor.Ipc.sendToMain(
              "cocos-services:plugin-messages",
              "service:refresh-panel",
              (e, i) => {}
            );
          });
        }
      } else {
        o.wirteEnableService(c.service_id, r);

        t.printToCreatorConsole(
          "log",
          t
            .t(`silence_${r ? "enable" : "disable"}_service`)
            .replace("${name}", c.service_name)
        );

        Editor.Ipc.sendToMain(
          "cocos-services:plugin-messages",
          "service:refresh-panel",
          (e, i) => {}
        );
      }

      if (e.reply) {
        e.reply(null, a(0, "success"));
      }
    },
  },
};
