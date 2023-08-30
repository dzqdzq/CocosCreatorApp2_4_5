"use strict";
require("fs-extra");
const e = require("electron");
const r = e.BrowserWindow;
const l = e.ipcMain;
const o = Editor.require("app://editor/core/vscode-workflow");
function t(e, r) {
  let l =
    Editor.Selection.contexts("node")[0] ||
    Editor.Selection.curActivate("node");
  Editor.Ipc.sendToPanel(
    "scene",
    "scene:create-node-by-prefab",
    e,
    Editor.assetdb.urlToUuid(r),
    l
  );
}
function a() {
  const e = [
    {
      label: Editor.T("MAIN_MENU.node.create_empty"),
      message: "scene:create-node-by-classid",
      panel: "scene",
      params: ["New Node", ""],
    },
    {
      label: Editor.T("MAIN_MENU.node.renderers"),
      submenu: [
        {
          label: Editor.T("MAIN_MENU.node.sprite"),
          click() {
            t("New Sprite", "db://internal/prefab/sprite.prefab");
          },
        },
        {
          label: Editor.T("MAIN_MENU.node.sprite_splash"),
          click() {
            t(
              "New Sprite(Splash)",
              "db://internal/prefab/sprite_splash.prefab"
            );
          },
        },
        {
          label: Editor.T("MAIN_MENU.node.label"),
          click() {
            t("New Label", "db://internal/prefab/label.prefab");
          },
        },
        {
          label: Editor.T("MAIN_MENU.node.richtext"),
          click() {
            t("New RichText", "db://internal/prefab/richtext.prefab");
          },
        },
        {
          label: Editor.T("MAIN_MENU.node.particle"),
          click() {
            t("New Particle", "db://internal/prefab/particlesystem.prefab");
          },
        },
        {
          label: Editor.T("MAIN_MENU.node.tiledmap"),
          click() {
            t("New TiledMap", "db://internal/prefab/tiledmap.prefab");
          },
        },
        {
          label: Editor.T("MAIN_MENU.node.tiledtile"),
          click() {
            t("New TiledTile", "db://internal/prefab/tiledtile.prefab");
          },
        },
      ],
    },
    {
      label: Editor.T("MAIN_MENU.node.ui"),
      submenu: [
        {
          label: Editor.T("MAIN_MENU.node.layout"),
          click() {
            t("New Layout", "db://internal/prefab/layout.prefab");
          },
        },
        {
          label: Editor.T("MAIN_MENU.node.button"),
          click() {
            t("New Button", "db://internal/prefab/button.prefab");
          },
        },
        {
          label: Editor.T("MAIN_MENU.node.canvas"),
          click() {
            t("New Canvas", "db://internal/prefab/canvas.prefab");
          },
        },
        {
          label: Editor.T("MAIN_MENU.node.scrollview"),
          click() {
            t("New ScrollView", "db://internal/prefab/scrollview.prefab");
          },
        },
        {
          label: Editor.T("MAIN_MENU.node.slider"),
          click() {
            t("New Slider", "db://internal/prefab/slider.prefab");
          },
        },
        {
          label: Editor.T("MAIN_MENU.node.pageview"),
          click() {
            t("New PageView", "db://internal/prefab/pageview.prefab");
          },
        },
        {
          label: Editor.T("MAIN_MENU.node.progressbar"),
          click() {
            t("New ProgressBar", "db://internal/prefab/progressBar.prefab");
          },
        },
        {
          label: Editor.T("MAIN_MENU.node.toggle"),
          click() {
            t("New Toggle", "db://internal/prefab/toggle.prefab");
          },
        },
        {
          label: Editor.T("MAIN_MENU.node.toggleContainer"),
          click() {
            t(
              "New ToggleContainer",
              "db://internal/prefab/toggleContainer.prefab"
            );
          },
        },
        {
          label: Editor.T("MAIN_MENU.node.toggleGroup"),
          click() {
            t("New ToggleGroup", "db://internal/prefab/toggleGroup.prefab");
          },
        },
        {
          label: Editor.T("MAIN_MENU.node.editbox"),
          click() {
            t("New EditBox", "db://internal/prefab/editbox.prefab");
          },
        },
        {
          label: Editor.T("MAIN_MENU.node.videoplayer"),
          click() {
            t("New VideoPlayer", "db://internal/prefab/videoplayer.prefab");
          },
        },
        {
          label: Editor.T("MAIN_MENU.node.webview"),
          click() {
            t("New WebView", "db://internal/prefab/webview.prefab");
          },
        },
      ],
    },
    {
      label: Editor.T("MAIN_MENU.node.create_3d"),
      submenu: [
        {
          label: "3D Stage",
          click() {
            t("New 3D Stage", "db://internal/prefab/3d-stage.prefab");
          },
        },
        {
          label: "3D Particle",
          click() {
            t("New 3D Particle", "db://internal/prefab/3d-particle.prefab");
          },
        },
        { type: "separator" },
        {
          label: Editor.T("MAIN_MENU.node.box"),
          click() {
            t("New Box", "db://internal/model/prefab/box.prefab");
          },
        },
        {
          label: Editor.T("MAIN_MENU.node.capsule"),
          click() {
            t("New Capsule", "db://internal/model/prefab/capsule.prefab");
          },
        },
        {
          label: Editor.T("MAIN_MENU.node.cone"),
          click() {
            t("New Cone", "db://internal/model/prefab/cone.prefab");
          },
        },
        {
          label: Editor.T("MAIN_MENU.node.cylinder"),
          click() {
            t("New Cylinder", "db://internal/model/prefab/cylinder.prefab");
          },
        },
        {
          label: Editor.T("MAIN_MENU.node.plane"),
          click() {
            t("New Plane", "db://internal/model/prefab/plane.prefab");
          },
        },
        {
          label: Editor.T("MAIN_MENU.node.quad"),
          click() {
            t("New Quad", "db://internal/model/prefab/quad.prefab");
          },
        },
        {
          label: Editor.T("MAIN_MENU.node.sphere"),
          click() {
            t("New Sphere", "db://internal/model/prefab/sphere.prefab");
          },
        },
        {
          label: Editor.T("MAIN_MENU.node.torus"),
          click() {
            t("New Torus", "db://internal/model/prefab/torus.prefab");
          },
        },
      ],
    },
    {
      label: Editor.T("MAIN_MENU.node.create_camera"),
      submenu: [
        {
          label: "2D " + Editor.T("MAIN_MENU.node.camera"),
          click() {
            t("New 2D Camera", "db://internal/prefab/2d-camera.prefab");
          },
        },
        {
          label: "3D " + Editor.T("MAIN_MENU.node.camera"),
          click() {
            t("New 3D Camera", "db://internal/prefab/3d-camera.prefab");
          },
        },
      ],
    },
    {
      label: Editor.T("MAIN_MENU.node.create_light"),
      submenu: [
        {
          label: "Directional",
          click() {
            t(
              "New Directional Light",
              "db://internal/prefab/light/directional.prefab"
            );
          },
        },
        {
          label: "Spot",
          click() {
            t("New Spot Light", "db://internal/prefab/light/spot.prefab");
          },
        },
        {
          label: "Point",
          click() {
            t("New Point Light", "db://internal/prefab/light/point.prefab");
          },
        },
        {
          label: "Ambient",
          click() {
            t("New Ambient Light", "db://internal/prefab/light/ambient.prefab");
          },
        },
      ],
    },
  ];
  if (Editor.Profile.load("global://features.json").get("cloud-function")) {
    try {
      const r = Editor.url("packages://node-library/panel/utils/prefab.js");
      if (r) {
        const l = require(r).query(1);
        if (l && l.length > 0) {
          const r = {
            label: Editor.T("MAIN_MENU.node.cloud_component"),
            submenu: [],
            visible: true,
          };

          l.forEach((e) => {
            if (e.prefab) {
              e.prefab.forEach((e) => {
                r.submenu.push({
                  label: e.name,
                  click() {
                    Editor.Ipc.sendToMain(
                      "node-library:import-cloud-component",
                      e.component,
                      (r, l) => {
                        let o =
                          Editor.Selection.contexts("node")[0] ||
                          Editor.Selection.curActivate("node");
                        Editor.Ipc.sendToPanel(
                          "scene",
                          "scene:create-node-by-prefab",
                          e.name,
                          l,
                          o
                        );
                      }
                    );
                  },
                });
              });
            }
          });

          e.push(r);
        }
      }
    } catch (e) {
      Editor.warn(e);
    }
  }
  return e;
}
function i() {
  return [
    {
      label: Editor.T("MAIN_MENU.node.align_with_view"),
      accelerator: "CmdOrCtrl+Shift+F",
      panel: "scene",
      message: "scene:copy-editor-camera-data-to-nodes",
    },
    {
      label: Editor.T("MAIN_MENU.node.break_prefab_instance"),
      panel: "scene",
      message: "scene:break-prefab-instance",
    },
    {
      label: Editor.T("MAIN_MENU.node.link_prefab"),
      panel: "scene",
      message: "scene:link-prefab",
    },
    { type: "separator" },
  ].concat(a());
}
function d() {
  Editor.Window.main.nativeWin.webContents.send("reload-page");
}
function n(e) {
  Editor.stashedScene = null;
  let l = Editor.Window.main.nativeWin;
  let o = r.getFocusedWindow();
  let t = o === l;

  if ((t || e)) {
    l.webContents.off("did-finish-load", d);
    l.webContents.once("did-finish-load", d);
  }

  if (!t && e) {
    l.reload();
  } else {
    if (o) {
      o.reload();
    }
  }
}
Editor.Menu.register("create-node", a);
Editor.Menu.register("node-menu", i);

module.exports = function () {
  let l = [
      {
        label: Editor.T("MAIN_MENU.edit.title"),
        submenu: [
          {
            label: Editor.T("MAIN_MENU.edit.undo"),
            accelerator: "CmdOrCtrl+Z",
            click() {
              Editor.Ipc.sendToPanel("scene", "scene:undo");
            },
          },
          {
            label: Editor.T("MAIN_MENU.edit.redo"),
            accelerator: "Shift+CmdOrCtrl+Z",
            click() {
              Editor.Ipc.sendToPanel("scene", "scene:redo");
            },
          },
          { type: "separator" },
          {
            label: Editor.T("MAIN_MENU.edit.copy"),
            accelerator: "CmdOrCtrl+C",
            role: "copy",
          },
          {
            label: Editor.T("MAIN_MENU.edit.paste"),
            accelerator: "CmdOrCtrl+V",
            role: "paste",
          },
          {
            label: Editor.T("MAIN_MENU.edit.selectall"),
            accelerator: "CmdOrCtrl+A",
            role: "selectall",
          },
        ],
      },
      { label: Editor.T("MAIN_MENU.node.title"), id: "node", submenu: i() },
      {
        label: Editor.T("MAIN_MENU.component.title"),
        id: "component",
        submenu: [],
      },
      {
        label: Editor.T("MAIN_MENU.project.title"),
        id: "project",
        submenu: [
          {
            label: Editor.T("MAIN_MENU.project.play"),
            accelerator: "CmdOrCtrl+P",
            click() {
              Editor.Ipc.sendToWins("scene:play-on-device");
            },
          },
          {
            label: Editor.T("MAIN_MENU.project.reload"),
            accelerator: "CmdOrCtrl+Shift+P",
            click() {
              Editor.Ipc.sendToWins("scene:reload-on-device");
            },
          },
        ],
      },
      { label: Editor.T("MAIN_MENU.panel.title"), id: "panel", submenu: [] },
      {
        label: Editor.T("MAIN_MENU.layout.title"),
        id: "layout",
        submenu: [
          {
            label: Editor.T("MAIN_MENU.layout.default"),
            click() {
              Editor.Window.main.resetLayout(
                Editor.Window.defaultLayoutUrl,
                () => {
                  n(true);
                }
              );
            },
          },
          {
            label: Editor.T("MAIN_MENU.layout.portrait"),
            click() {
              Editor.Window.main.resetLayout(
                "unpack://static/layout/portrait.json",
                () => {
                  n(true);
                }
              );
            },
          },
          {
            label: Editor.T("MAIN_MENU.layout.classical"),
            click() {
              Editor.Window.main.resetLayout(
                "unpack://static/layout/classical.json",
                () => {
                  n(true);
                }
              );
            },
          },
        ],
      },
      {
        label: Editor.T("MAIN_MENU.package.title"),
        id: "package",
        submenu: [
          {
            label: Editor.T("MAIN_MENU.package.create.title"),
            submenu: [
              {
                label: Editor.T("MAIN_MENU.package.create.global"),
                click() {
                  Editor.Ipc.sendToMain("editor:create-package", "global");
                },
              },
              {
                label: Editor.T("MAIN_MENU.package.create.project"),
                click() {
                  Editor.Ipc.sendToMain("editor:create-package", "project");
                },
              },
            ],
          },
        ],
      },
      {
        label: Editor.T("MAIN_MENU.developer.title"),
        id: "developer",
        submenu: [
          {
            label: Editor.T("MAIN_MENU.developer.vscode.title"),
            submenu: [
              {
                label: Editor.T("MAIN_MENU.developer.vscode.get_tsd"),
                click() {
                  o.updateAPIData();
                },
              },
              {
                label: Editor.T("MAIN_MENU.developer.vscode.copy_extension"),
                click() {
                  o.updateDebugger();
                },
              },
              {
                label: Editor.T("MAIN_MENU.developer.vscode.copy_tsconfig"),
                click() {
                  o.updateTypeScriptConf();
                },
              },
              {
                label: Editor.T(
                  "MAIN_MENU.developer.vscode.copy_debug_setting"
                ),
                click() {
                  o.updateDebugSetting();
                },
              },
              {
                label: Editor.T(
                  "MAIN_MENU.developer.vscode.copy_compile_task"
                ),
                click() {
                  o.updateCompileTask();
                },
              },
            ],
          },
          {
            label: Editor.T("MAIN_MENU.developer.command_palette"),
            enabled: false,
            accelerator: "CmdOrCtrl+:",
            click() {
              Editor.Window.main.focus();
              Editor.Ipc.sendToMainWin("cmdp:show");
            },
          },
          { type: "separator" },
          {
            label: Editor.T("MAIN_MENU.developer.reload"),
            accelerator: "CmdOrCtrl+R",
            click() {
              n();
            },
          },
          {
            label: Editor.T("MAIN_MENU.developer.compile"),
            accelerator: "F7",
            click() {
              Editor.ProjectCompiler.compileAndReload();
            },
          },
          {
            label: Editor.T("MAIN_MENU.developer.compile_engine"),
            accelerator: "CmdOrCtrl+F7",
            click() {
              Editor.Ipc.sendToMain(
                "app:rebuild-editor-engine",
                (e) => {
                  if (e) {
                    Editor.error("rebuild engine failed: " + e);
                  } else {
                    Editor.log("Compile engine finished");
                  }
                },
                -1
              );
            },
          },
          { type: "separator", dev: true },
          {
            label: Editor.T("MAIN_MENU.developer.inspect"),
            accelerator: "CmdOrCtrl+Shift+C",
            click() {
              let e = r.getFocusedWindow();
              let l = Editor.Window.find(e);

              if (l) {
                l.send("editor:window-inspect");
              }
            },
          },
          {
            label: Editor.T("MAIN_MENU.developer.devtools"),
            accelerator: "CmdOrCtrl+Alt+I",
            click() {
              let e = r.getFocusedWindow();
              let l = Editor.Window.find(e);
              if (l) {
                l.openDevTools();
                return;
              }
              e.openDevTools();

              if (e.devToolsWebContents) {
                e.devToolsWebContents.focus();
              }
            },
          },
          {
            label: Editor.T("MAIN_MENU.developer.toggle_node_inspector"),
            type: "checkbox",
            checked: false,
            dev: true,
            click() {
              Editor.Debugger.toggleNodeInspector();
            },
          },
          { type: "separator", dev: true },
          {
            label: "Generate UUID",
            dev: true,
            click() {
              let e = require("node-uuid");
              Editor.log(e.v4());
            },
          },
          {
            label: "Remove All Meta Files",
            dev: true,
            async click() {
              await Editor.assetdb._rmMetas();
              Editor.success("Meta files removed");
            },
          },
          { type: "separator", dev: true },
          {
            label: "Human Tests",
            dev: true,
            submenu: [
              {
                label: "Reload Scene",
                accelerator: "Alt+F7",
                click() {
                  var e = require("./compiler");
                  Editor.Ipc.sendToWins(
                    "scene:soft-reload",
                    "failed" !== e.state
                  );
                },
              },
              {
                label: "Throw an Uncaught Exception",
                click() {
                  throw new Error("editor-framework Unknown Error");
                },
              },
              {
                label: "send2panel 'foo:bar' foobar.panel",
                click() {
                  Editor.Ipc.sendToPanel("foobar.panel", "foo:bar");
                },
              },
              {
                label: "Enable Build Worker Devtools",
                click() {
                  Editor.Builder.debugWorker = !Editor.Builder.debugWorker;
                },
              },
              {
                label: "Enable Compile Worker Devtools",
                click() {
                  Editor.Compiler.debugWorker = !Editor.Compiler.debugWorker;
                },
              },
            ],
          },
          { type: "separator", dev: true },
        ],
      },
    ];

  let t = function () {
    let e = new Editor.Window("about", {
        title: Editor.T("MAIN_MENU.about", {
          product: Editor.T("SHARED.product_name"),
        }),
        width: 500,
        height: 215,
        alwaysOnTop: true,
        show: false,
        resizable: false,
      });

    let r = Editor.Window.main;
    let l = r.nativeWin.getPosition();
    let o = r.nativeWin.getSize();
    let t = l[0] + o[0] / 2 - 200;
    let a = l[1] + o[1] / 2 - 90;
    e.load("app://editor/page/app-about.html");
    e.nativeWin.setPosition(Math.floor(t), Math.floor(a));
    e.nativeWin.setMenuBarVisibility(false);

    e.nativeWin.setTitle(
      Editor.T("MAIN_MENU.about", {
        product: Editor.T("SHARED.product_name"),
      })
    );

    e.show();
  };

  let a = {
    label: Editor.T("SHARED.product_name"),
    position: "before=help",
    submenu: [
      {
        label: Editor.T("MAIN_MENU.about", {
          product: Editor.T("SHARED.product_name"),
        }),
        id: 0,
        click: t,
      },
      { type: "separator" },
      {
        label: Editor.T("MAIN_MENU.panel.preferences"),
        click() {
          Editor.Ipc.sendToMain("preferences:open");
        },
      },
      { type: "separator" },
      {
        label: Editor.T("MAIN_MENU.window.hide", {
          product: Editor.T("SHARED.product_name"),
        }),
        id: 2,
        accelerator: "CmdOrCtrl+H",
        visible: Editor.isDarwin,
        role: "hide",
      },
      {
        label: Editor.T("MAIN_MENU.window.hide_others"),
        accelerator: "CmdOrCtrl+Shift+H",
        visible: Editor.isDarwin,
        role: "hideothers",
      },
      {
        label: Editor.T("MAIN_MENU.window.show_all"),
        role: "unhide",
        visible: Editor.isDarwin,
      },
      {
        label: Editor.T("MAIN_MENU.window.minimize"),
        accelerator: "CmdOrCtrl+M",
        role: "minimize",
      },
      {
        label: Editor.T("MAIN_MENU.window.bring_all_front"),
        visible: Editor.isDarwin,
        role: "front",
      },
      { type: "separator" },
      {
        label: Editor.T("MAIN_MENU.window.close"),
        accelerator: "CmdOrCtrl+W",
        role: "close",
      },
      {
        label: Editor.T("MAIN_MENU.window.quit"),
        accelerator: "CmdOrCtrl+Q",
        role: "close",
      },
    ],
  };

  let d = {
    label: Editor.T("MAIN_MENU.file.title"),
    submenu: [
      {
        label: Editor.T("MAIN_MENU.file.open_project"),
        click() {
          Editor.App.runDashboard();
        },
      },
      {
        label: Editor.T("MAIN_MENU.file.open_dashboard"),
        click() {
          if (process.send) {
            process.send({ channel: "show-dashboard" });
          }
        },
      },
      { type: "separator" },
      { label: Editor.T("MAIN_MENU.file.open_recent_items"), submenu: [] },
      { type: "separator" },
      {
        label: Editor.T("MAIN_MENU.file.new_scene"),
        accelerator: "CmdOrCtrl+N",
        click() {
          Editor.Ipc.sendToPanel("scene", "scene:new-scene");
        },
      },
      {
        label: Editor.T("MAIN_MENU.file.save_scene"),
        accelerator: "CmdOrCtrl+S",
        click() {
          Editor.Ipc.sendToPanel("scene", "scene:stash-and-save");
        },
      },
      { type: "separator" },
      {
        label: Editor.T("MAIN_MENU.file.import_asset"),
        click() {
          Editor.Ipc.sendToMain("package-asset:import");
        },
      },
      {
        label: Editor.T("MAIN_MENU.file.export_asset"),
        click() {
          Editor.Ipc.sendToMain("package-asset:export");
        },
      },
    ],
  };

  let c = {
    label: Editor.T("SHARED.help"),
    id: "help",
    role: "help",
    submenu: [
      {
        label: Editor.T("MAIN_MENU.help.docs"),
        click() {
          require("../../share/manual").openManual("home");
        },
      },
      {
        label: Editor.T("MAIN_MENU.help.api"),
        click() {
          require("../../share/manual").openAPI("home");
        },
      },
      {
        label: Editor.T("MAIN_MENU.help.forum"),
        click() {
          let r =
            "zh" === Editor.lang
              ? "https://forum.cocos.org/c/Creator"
              : "https://discuss.cocos2d-x.org/c/creator";
          e.shell.openExternal(r);
          e.shell.beep();
        },
      },
      { type: "separator" },
      {
        label: Editor.T("MAIN_MENU.help.release_notes"),
        click() {
          e.shell.openExternal("https://www.cocos.com/creator");
          e.shell.beep();
        },
      },
      {
        label: Editor.T("MAIN_MENU.help.engine_repo"),
        click() {
          e.shell.openExternal("https://github.com/cocos-creator/engine");
          e.shell.beep();
        },
      },
      { type: "separator" },
      { label: Editor.T("MAIN_MENU.account.none"), enabled: false },
    ],
  };

  l.unshift(d);
  l.push(c);
  if (Editor.isDarwin) {
    l.unshift(a);
  } else {
    let e = [
      { type: "separator" },
      {
        label: Editor.T("MAIN_MENU.panel.preferences"),
        click() {
          Editor.Ipc.sendToMain("preferences:open");
        },
      },
      { type: "separator" },
      {
        label: Editor.T("MAIN_MENU.window.quit"),
        accelerator: "CmdOrCtrl+Q",
        role: "close",
      },
    ];
    d.submenu = d.submenu.concat(e);
    let r = [
      {
        label: Editor.T("MAIN_MENU.about", {
          product: Editor.T("SHARED.product_name"),
        }),
        id: 0,
        click: t,
      },
      { type: "separator" },
    ];
    c.submenu.splice(7, 0, ...r);
  }
  return l;
};

l.on("scene:animation-record-changed", (e, r, l) => {
  let o = i();

  Editor.Menu.walk(o, (e) => {
    e.enabled = !r;
  });

  Editor.MainMenu.update(Editor.T("MAIN_MENU.node.title"), o);
});

l.on("node-library:update-menu", (e, r) => {
  Editor.Menu.unregister("create-node");
  Editor.Menu.register("create-node", a);
  let l = i();

  Editor.Menu.walk(l, (e) => {
    if (e.label === Editor.T("MAIN_MENU.node.cloud_component")) {
      e.visible = r;
    }
  });

  Editor.MainMenu.update(Editor.T("MAIN_MENU.node.title"), l);
});
