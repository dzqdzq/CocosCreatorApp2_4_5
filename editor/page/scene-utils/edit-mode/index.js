"use strict";
const e = require("../lib/sandbox");
const n = require("../lib/tasks");
const t = require("../utils/prefab");

const o = {
  scene: require("./modes/scene"),
  animation: require("./modes/animation"),
  prefab: require("./modes/prefab"),
};

const r = [o.scene];

let s = function () {
    return r[r.length - 1];
  };

let i = function (o, i, l) {
  i = i || {};
  n.push(
    {
      name: `pop-edit-mode:[${o}]`,
      run: async function (l) {
        let u = true;

        if (void 0 !== i.closeResult) {
          u = false;
        }

        if (1 === r.length) {
          return l();
        }
        if (e.reloading) {
          return l(
            new Error(
              "Can not change editmode when scripts are reloading, try again please."
            )
          );
        }
        let a = s();
        return o && o !== a.name
          ? l(new Error(`Pop mode [${o}] not match current mode [${a.name}]`))
          : (await t.confirmEditingPrefabSynced(),
            u && (i.closeResult = a.confirmClose()),
            1 === i.closeResult
              ? (n.kill(), l(null, 1))
              : (a.close(i.closeResult, (e) => {
              if (1 === r.length) {
                return;
              }
              r.pop();
              let n = r[r.length - 1];

              Editor.Ipc.sendToPanel("scene", "scene:update-edit-mode", {
                title: n.title,
                name: n.name,
              });

              l(e, i.closeResult);
            }),
                void 0));
      },
    },
    l
  );
};

let l = function () {
  for (let e = r.length - 1; e > 0; e--) {
    i(r[e].name);
  }
};

let u = function (e, t) {
  e = e || {};
  n.push(
    {
      name: "close-scene",
      run: function (n) {
        let t = true;

        if (void 0 !== e.closeResult) {
          t = false;
        } else {
          e.closeResult = 2;
        }

        if (t) {
          e.closeResult = o.scene.confirmClose();
        }

        o.scene.close(e.closeResult, (e, t) => {
          if (e) {
            Editor.error(e);
          }

          if (n) {
            n(e, t);
          }
        });
      },
    },
    (e, n) => {
      if (1 !== n && t) {
        t(e, n);
      }
    }
  );
};

module.exports = {
  push: function (e, t, i) {
    n.push(
      {
        name: `push-edit-mode:[${e}]`,
        run: function (l) {
          let u = o[e];
          if (!u) {
            return cb(new Error(`Can't find register for mode name [${e}]`));
          }
          t = t || [];
          i = i || function () {};

          if (!Array.isArray(t)) {
            t = [t];
          }

          let a = s();
          n.stash();

          if (a.beforePushOther) {
            a.beforePushOther(u, ...t);
          }

          n.push(
            {
              name: `open-edit-mode:[${u.name}]`,
              run(e) {
                u.open(...t, () => {
                  r.push(u);

                  Editor.Ipc.sendToPanel(
                    "scene",
                    "scene:update-edit-mode",
                    { title: u.title, name: u.name }
                  );

                  e();
                });
              },
            },
            i
          );

          n.unshiftStash();
          l();
        },
      },
      i
    );
  },
  pop: i,
  popAll: l,
  close: function (e) {
    l();
    u({}, e);
  },
  closeScene: u,
  softReload: function () {
    for (let e = r.length - 1; e >= 0; e--) {
      let n = r[e];
      if (n && n.softReload && false === n.softReload()) {
        break;
      }
    }
  },
  title: function () {
    let e = s();
    return e === o.scene ? "" : e.title;
  },
  curMode: s,
  save: function (e) {
    let t = s();
    n.push(
      {
        name: `save-editor-mode:[${t.name}]`,
        run: function (e) {
          t.save((n) => {
            if (n) {
              Editor.error(n.message);
              return e(n);
            }
            _Scene.stashScene(() => {
              if (Editor.Profile.load("global://settings.json").get(
                "auto-refresh"
              )) {
                Editor.Ipc.sendToMain("app:reload-on-device");
              }

              e();
            });
          });
        },
      },
      e
    );
  },
  dirtyMode: function () {
    for (let e = r.length - 1; e >= 0; e--) {
      let n = r[e];
      if (n.dirty()) {
        return n;
      }
    }
    return null;
  },
};
