"use strict";
const s = require(Editor.url("app://editor/share/build-utils"));
const { BrowserWindow: t } = require("electron");

module.exports = {
  state: "idle",
  progress: 0,
  task: "",
  options: {},
  load() {},
  unload() {},
  messages: {
    open() {
      Editor.Panel.open(["builder", "cocos-services"]);
    },
    "start-task"(t, e, o) {
      this.task = e;
      this.options = o;

      if ("compile" === e) {
        Editor.Ipc.sendToMain("app:compile-project", o);
      } else {
        if ("build" === e) {
          Editor.Ipc.sendToAll(
                "editor:build-start",
                s.getCommonOptions(this.options)
              );

          Editor.Ipc.sendToMain("app:build-project", o);
        }
      }
    },
    "state-changed"(t, e, o) {
      this.state = e;
      this.progress = o;

      if (!("error" !== e && "finish" !== e)) {
        if ("build" === this.task &&
            "finish" === e) {
          Editor.Ipc.sendToAll(
            "editor:build-finished",
            s.getCommonOptions(this.options)
          );
        }

        this.task = "";
        this.options = {};
      }

      Editor.Ipc.sendToWins(
        "builder:state-changed",
        this.state,
        this.progress
      );
    },
    "query-current-state"(s) {
      if (s.reply) {
        s.reply(null, {
          task: this.task,
          state: this.state,
          progress: this.progress,
        });
      }
    },
    "query-build-options"(t) {
      if (!t.reply) {
        return;
      }
      let e = s.getCommonOptions();
      t.reply(null, e);
    },
    "update-system-progress"(s, e) {
      try {
        e = 0 === e ? -1 : e;
        let o = t.fromWebContents(s.sender);

        if (o) {
          o.setProgressBar(e);
        }
      } catch (s) {
        Editor.warn(
          "BrowserWindow not found when receiving update-system-progress"
        );
      }
    },
  },
};
