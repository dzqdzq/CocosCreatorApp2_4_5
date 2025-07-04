"use strict";
const e = require("fire-path");
let t = {};
module.exports = t;
const r = require("../../console");
let o = {};
function i(e) {
  return new Promise(function (t, r) {
    let o = new window.XMLHttpRequest();
    o.open("GET", e, true);

    o.onreadystatechange = function (i) {
      if (4 !== o.readyState) {
        return;
      }

      if (-1 === [0, 200, 304].indexOf(o.status)) {
        r(
              new Error(
                `While loading from url ${e} server responded with a status of ${o.status}`
              )
            );
      } else {
        t(i.target.response);
      }
    };

    o.send(null);
  });
}
function n(e, t) {
  return void 0 === t
    ? (r.error(`Failed to load resource: ${e}`), (o[e] = void 0), void 0)
    : ((o[e] = t), t);
}
function l(e, t) {
  return void 0 === t
    ? (r.error(`Failed to load stylesheet: ${e}`), (o[e] = void 0), void 0)
    : ((t += `\n//# sourceURL=${e}`), (o[e] = t), t);
}
function s(e, t) {
  if (void 0 === t) {
    r.error(`Failed to load script: ${e}`);
    o[e] = void 0;
    return;
  }
  t += `\n//# sourceURL=${e}`;
  let i = window.eval(t);
  o[e] = i;
  return i;
}

t.getResource = function (e) {
  return o[e];
};

t.importStylesheet = function (e) {
    let t = o[e];
    return void 0 !== t
      ? new Promise(function (e) {
          e(t);
        })
      : i(e).then(l.bind(this, e), l.bind(this, e, void 0));
  };

t.importStylesheets = function (e) {
    if (!Array.isArray(e)) {
      r.error(
        "Call to `importStylesheets` failed. The`urls` parameter must be an array"
      );

      return;
    }
    let o = [];
    for (let r = 0; r < e.length; ++r) {
      let i = e[r];
      o.push(t.importStylesheet(i));
    }
    return Promise.all(o);
  };

t.loadGlobalScript = function (e, t) {
  let r = document.createElement("script");
  r.type = "text/javascript";

  r.onload = function () {
    if (t) {
      t();
    }
  };

  r.src = e;
  document.head.appendChild(r);
};

t.importScript = function (t) {
    let n = o[t];
    if (void 0 !== n) {
      return new Promise(function (e) {
        e(n);
      });
    }
    try {
      let l = t;

      if (!e.isAbsolute(t)) {
        l = Editor.url(t);
      }

      n = require(l);

      if (0 === Object.keys(n).length &&
        global.__temp_panel_proto_) {
        n = global.__temp_panel_proto_;
        global.__temp_panel_proto_ = void 0;
      }

      return void 0 === n
        ? i(t).then(s.bind(this, t), s.bind(this, t, void 0))
        : new Promise(function (e) {
        o[t] = n;
        e(n);
      });
    } catch (e) {
      r.error(`Failed to load script: ${t}`);
    }
  };

t.importScripts = function (e) {
    if (!Array.isArray(e)) {
      r.error(
        "Call to `importScripts` failed. The`urls` parameter must be an array"
      );

      return;
    }
    let o = [];
    for (let r = 0; r < e.length; ++r) {
      let i = e[r];
      o.push(t.importScript(i));
    }
    return Promise.all(o);
  };

t.importTemplate = function (e) {
    let t = o[e];
    return void 0 !== t
      ? new Promise(function (e) {
          e(t);
        })
      : i(e).then(n.bind(this, e), n.bind(this, e, void 0));
  };

t.importResource = function (e) {
    let t = o[e];
    return void 0 !== t
      ? new Promise(function (e) {
          e(t);
        })
      : i(e).then(n.bind(this, e), n.bind(this, e, void 0));
  };
