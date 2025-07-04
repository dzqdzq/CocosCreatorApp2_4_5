const e = require("fire-fs");
const { promisify: t } = require("util");
require("fire-path");

exports.trackModuleEvent = function () {
  let t = Editor.Profile.load("project://project.json");

  if (!(Date.now() - t.get("last-module-event-record-time") < 6048e5)) {
    (function (e) {
        e.forEach((e) => {
          Editor.Ipc.sendToMain("metrics:track-event", {
            category: "Project",
            action: "Modules",
            label: e.name,
          });
        });
      })(
        (function () {
          let t = Editor.url("unpack://engine/modules.json");
          return e.readJsonSync(t);
        })().filter((e) => -1 === t.get("excluded-modules").indexOf(e.name))
      );

    (function (e) {
      e.set("last-module-event-record-time", Date.now());
      e.save();
    })(t);
  }
};
