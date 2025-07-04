"use strict";
let e = require("./editor");
Object.assign(e, require("../share/platform"));
Object.assign(e, require("./console"));
e.Easing = require("../share/easing");
e.IpcListener = require("../share/ipc-listener");
e.JS = require("../share/js-utils");
e.KeyCode = require("../share/keycode");
e.Math = require("../share/math");
e.Selection = require("../share/selection");
e.Undo = require("../share/undo");
e.Utils = require("../share/utils");
e.Audio = require("./audio");
e.Dialog = require("./dialog");
e.Ipc = require("./ipc");
e.MainMenu = require("./main-menu");
e.Menu = require("./menu");
e.Package = require("./package");
e.Panel = require("./panel");
e.Profile = require("../profile");
e.Protocol = require("./protocol");
e.Window = require("./window");
e.i18n = require("./i18n");
e.T = e.i18n.t;
e.UI = require("./ui");
window.unused = () => {};

window.deprecate = function (r, i, u) {
    u = void 0 !== u && u;
    let n = false;
    return function () {
      if (u) {
        e.trace("warn", i);
      } else {
        if (!n) {
          e.warn(i);
          n = true;
        }
      }

      return r.apply(this, arguments);
    };
  };

window.Editor = e;
module.exports = e;
