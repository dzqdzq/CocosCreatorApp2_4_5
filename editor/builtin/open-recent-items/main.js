require("electron").ipcMain;
const e = 100;
const t = 20;
function i(t) {
  let i = Editor.Profile.load("local://local.json");
  let l = i.get("recent-items");
  let o = l.indexOf(t);

  if (!(l.length > 0 && l.length - 1 === o)) {
    if (o >= 0) {
      l.splice(o, 1);
    } else {
      if (l.length + 1 > e) {
        l.splice(0, l.length + 1 - e);
      }
    }

    l.push(t);
    i.set("recent-items", l);
    i.save();
    n(l);
  }
}
function n(e) {
  let i = [];
  for (let n = e.length - 1; n >= 0; n--) {
    let l = Editor.assetdb.assetInfoByUuid(e[n]);
    if (l &&
    (i.push({
      label: l.url,
      click() {
        switch (l.type) {
          case "scene":
            Editor.Ipc.sendToMain("scene:open-by-uuid", l.uuid);
            break;
          case "prefab":
            Editor.Ipc.sendToAll("scene:enter-prefab-edit-mode", l.uuid);
        }
      },
    }),
    i.length >= t)) {
      break;
    }
  }
  Editor.MainMenu.update(
    `${Editor.T("MAIN_MENU.file.title")}/${Editor.T(
      "MAIN_MENU.file.open_recent_items"
    )}`,
    i
  );
}
function l() {
  n(Editor.Profile.load("local://local.json").get("recent-items"));
}

module.exports = {
  messages: {
    "editor:ready": () => {
      l();
    },
    "scene:open-by-uuid": (e, t) => {
      i(t);
    },
    "scene:enter-prefab-edit-mode": (e, t) => {
      i(t);
    },
    "assets:delete": (e, t) => {
      l();
    },
  },
};
