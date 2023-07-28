const t = require("fire-fs");
const e = (require("fire-path"), require("./const"));

module.exports = {
  name: Editor.T("huawei-agc.platform_name"),
  platform: "huawei-agc",
  extends: "android",
  buttons: [
    Editor.Builder.DefaultButtons.Build,
    Editor.Builder.DefaultButtons.Compile,
    Editor.Builder.DefaultButtons.Upload,
  ],
  buildStart: function (i) {
    let a = Editor.Profile.load(e.PROFILE_PATH);
    i[i.actualPlatform] = a.getSelfData();
    let o = a.get("configSelected");
    i.sdkhub = null;
    if ((t.existsSync(e.CONFIG_PATH))) {
      let a = t.readJsonSync(e.CONFIG_PATH);
      if (a.configSet) {
        let t = a.configSet.find((t) => t.id === o);

        if (t) {
          i.sdkhub = t;
        }
      }
    }
  },
  messages: {
    upload: function (t, e) {
      Editor.Panel.open("channel-upload-tools", { platform: e.actualPlatform });
    },
    "build-finished": function (t, e) {
      let i;

      if (e.orientation.landscapeLeft || e.orientation.landscapeRight) {
        i = "landscape";
      } else {
        if ((e.orientation.portrait || e.orientation.upsideDown)) {
          i = "portrait";
        }
      }

      Editor.Ipc.sendToMain("builder:notify-build-result", e, {
        packageName: e.packageName,
        resUrl: (e.android && e.android.REMOTE_SERVER_ROOT) || "",
        orientation: i,
      });

      t.reply();
    },
  },
  settings: Editor.url("packages://huawei-agc/ui/index.js"),
};
