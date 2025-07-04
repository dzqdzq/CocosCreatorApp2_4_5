"use strict";
let e = {};
module.exports = e;
const o = require("electron");
const n = require("util");
const r = require("winston");
const s = require("./ipc");
let l = false;
let t = [];

e.trace = function (e, ...o) {
  let i = n.format.apply(n, o);
  let a = new Error("dummy").stack.split("\n");
  a.shift();
  a[0] = i;
  i = a.join("\n");

  if (l) {
    t.push({ type: e, message: i });
  }

  r[e](i);
  s.sendToWins(`editor:console-${e}`, i);
};

e.log = function (...e) {
  let o = n.format.apply(n, e);

  if (l) {
    t.push({ type: "log", message: o });
  }

  r.normal(o);
  s.sendToWins("editor:console-log", o);
};

e.success = function (...e) {
  let o = n.format.apply(n, e);

  if (l) {
    t.push({ type: "success", message: o });
  }

  r.success(o);
  s.sendToWins("editor:console-success", o);
};

e.failed = function (...e) {
  let o = n.format.apply(n, e);
  t.push({ type: "failed", message: o });
  r.failed(o);
  s.sendToWins("editor:console-failed", o);
};

e.info = function (...e) {
  let o = n.format.apply(n, e);

  if (l) {
    t.push({ type: "info", message: o });
  }

  r.info(o);
  s.sendToWins("editor:console-info", o);
};

e.warn = function (...e) {
  let o = n.format.apply(n, e);
  t.push({ type: "warn", message: o });
  r.warn(o);
  s.sendToWins("editor:console-warn", o);
};

e.error = function (...e) {
  let o = n.format.apply(n, e);
  let l = new Error("dummy").stack.split("\n");
  l.shift();
  l[0] = o;
  o = l.join("\n");
  t.push({ type: "error", message: o });
  r.error(o);
  s.sendToWins("editor:console-error", o);
};

e.fatal = function (...e) {
  let o = n.format.apply(n, e);
  let s = new Error("dummy").stack.split("\n");
  s.shift();
  s[0] = o;
  o = s.join("\n");

  if (l) {
    t.push({ type: "fatal", message: o });
  }

  r.fatal(o);
};

let i = l;

e._temporaryConnent = function () {
  i = l;
  l = true;
};

e._restoreConnect = function () {
    l = i;
  };

e.connectToConsole = function () {
  l = true;
  i = true;
};

e.clearLog = function (e, o) {
    if (e) {
      let n;
      if (o) {
        try {
          n = new RegExp(e);
        } catch (e) {
          n = new RegExp("");
        }
      } else {
        n = e;
      }
      for (let e = t.length - 1; e >= 0; e--) {
        let r = t[e];

        if (o) {
          if (n.exec(r.message)) {
            t.splice(e, 1);
          }
        } else {
          if (-1 !== r.message.indexOf(n)) {
            t.splice(e, 1);
          }
        }
      }
    } else {
      t = [];
    }
    s.sendToAll("editor:console-clear", e, o);
  };

const a = o.ipcMain;
function c(e, o, ...i) {
  o = n.format.apply(n, [o, ...i]);

  if (l) {
    t.push({ type: e, message: o });
  }

  if ("log" === e) {
    r.normal(o);
  } else {
    r[e](o);
  }

  s.sendToWins(`editor:console-${e}`, o);
}

a.on("editor:renderer-console-log", (e, ...o) => {
  c.apply(null, ["log", ...o]);
});

a.on("editor:renderer-console-success", (e, ...o) => {
  c.apply(null, ["success", ...o]);
});

a.on("editor:renderer-console-failed", (e, ...o) => {
  c.apply(null, ["failed", ...o]);
});

a.on("editor:renderer-console-info", (e, ...o) => {
  c.apply(null, ["info", ...o]);
});

a.on("editor:renderer-console-warn", (e, ...o) => {
  c.apply(null, ["warn", ...o]);
});

a.on("editor:renderer-console-error", (e, ...o) => {
  c.apply(null, ["error", ...o]);
});

a.on("editor:renderer-console-trace", (e, o, ...n) => {
  c.apply(null, [o, ...n]);
});

a.on("editor:console-query", (e) => {
  e.reply(null, t);
});
