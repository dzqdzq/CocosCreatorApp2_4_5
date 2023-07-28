"use strict";
var t = require("child_process");
var n = t.spawn;
var o = (t.exec, t.execSync);
var r = t.spawnSync;
function i(t, n) {
  try {
    process.kill(parseInt(t, 10), n);
  } catch (t) {
    if ("ESRCH" !== t.code) {
      throw t;
    }
  }
}
function e(t, n, o, r, i) {
  var c = r(t);
  var a = "";
  c.stdout.on("data", function (t) {
    var t = t.toString("ascii");
    a += t;
  });
  var f = function (c) {
    delete o[t];
    if ((0 != c)) {
      if (Object.keys(o).length == 0) {
        i();
      }
      return;
    }
    a.match(/\d+/g).forEach(function (c) {
      c = parseInt(c, 10);
      n[t].push(c);
      n[c] = [];
      o[c] = 1;
      e(c, n, o, r, i);
    });
  };
  c.on("close", f);
}

module.exports = function (t, c, a, f) {
  var s = {};
  var u = {};
  switch (
    ((s[t] = []),
    (u[t] = 1),
    "function" == typeof a && void 0 === f && ((f = a), (a = void 0)),
    process.platform)
  ) {
    case "win32":
      o("taskkill /pid " + t + " /T /F");
      break;
    case "darwin":
      (function (t) {
        var n;

        (function (t) {
            for (var n = "", o = 0; o < t.length; o++) {
              n += String.fromCharCode(t[o]);
            }
            return n;
          })(r("lsof", ["-i", `:${t}`]).stdout)
            .split(/[\n|\r]/)
            .forEach((t) => {
              if (-1 !== t.indexOf("LISTEN") && !n) {
                let o = t.split(/\s+/);

                if (/\d+/.test(o[1])) {
                  n = o[1];
                }
              }
            });

        if (!n) {
          Editor.log(`port:${t} close!`);
          return;
        }
        o(`kill -9 ${n}`);
      })(c);
      break;
    default:
      (function (t, n, o, r, i) {
        var c = r(t);
        var a = "";
        c.stdout.on("data", function (t) {
          var t = t.toString("ascii");
          a += t;
        });
        c.on("close", function (c) {
          delete o[t];
          if (0 != c) {
            if (0 == Object.keys(o).length) {
              i();
            }

            return;
          }
          a.match(/\d+/g).forEach(function (c) {
            c = parseInt(c, 10);
            n[t].push(c);
            n[c] = [];
            o[c] = 1;

            (function (t, n, o, r, i) {
              var c = r(t);
              var a = "";
              c.stdout.on("data", function (t) {
                var t = t.toString("ascii");
                a += t;
              });
              c.on("close", function (c) {
                delete o[t];
                if (0 != c) {
                  if (0 == Object.keys(o).length) {
                    i();
                  }

                  return;
                }
                a.match(/\d+/g).forEach(function (c) {
                  c = parseInt(c, 10);
                  n[t].push(c);
                  n[c] = [];
                  o[c] = 1;
                  e(c, n, o, r, i);
                });
              });
            })(c, n, o, r, i);
          });
        });
      })(
        t,
        s,
        u,
        function (t) {
          return n("ps", ["-o", "pid", "--no-headers", "--ppid", t]);
        },
        function () {
          (function (t, n, o) {
            var r = {};
            try {
              Object.keys(t).forEach(function (o) {
                t[o].forEach(function (t) {
                  if (!r[t]) {
                    i(t, n);
                    r[t] = 1;
                  }
                });

                if (!r[o]) {
                  i(o, n);
                  r[o] = 1;
                }
              });
            } catch (t) {
              if (o) {
                return o(t);
              }
              throw t;
            }
            if (o) {
              return o();
            }
          })(s, a, f);
        }
      );
  }
};
