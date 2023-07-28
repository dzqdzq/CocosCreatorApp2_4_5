"use stirct";
let e;
let n = null;
let t = false;
let u = false;
const { drawHermite: l } = require("./utils");

let r = function () {
  n = null;
  t = false;
  u = false;
  e = null;
};

let a = function (n) {
  e = n;

  if (t) {
    process.nextTick(() => {
      Editor.Ipc.sendToPanel("curve-editor", "current-keys", n);
      u = false;
    });
  }
};

module.exports = {
  close: function (e) {
    if (e === n) {
      Editor.Panel.close("curve-editor");
      r();
    }
  },
  open: function (e, t) {
    if (!u) {
      Editor.Panel.open("curve-editor");
      u = true;
    }

    n = t;
    a(e);
  },
  update: a,
  drawCurve: function (e, n, t) {
    let u = [];
    for (let n = 0, t = e.length; n < t; n++) {
      let t = e[n];
      u.push({
        time: t.value.time.value,
        value: t.value.value.value,
        outTangent: t.value.outTangent.value,
        inTangent: t.value.inTangent.value,
      });
    }
    l(u, n, t);
  },
  changeCurveState: function (u) {
    t = u;

    if (u && n) {
      Editor.Ipc.sendToPanel("curve-editor", "current-keys", e);
    } else {
      r();
    }
  },
  changeCurveData: function (e) {
    if (n) {
      n.apply(e);
    }
  },
  clear: r,
};
