"use strict";
let t = {
  callSceneScript() {
    let t = Array.prototype.shift.call(arguments);
    let e = Array.prototype.shift.call(arguments);
    Array.prototype.unshift.apply(arguments, ["scene", `${t}:${e}`]);
    Editor.Ipc.sendToPanel.apply(Editor.sendToPanel, arguments);
  },
};
module.exports = t;
