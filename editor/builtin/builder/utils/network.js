let e = require("request");
exports.getAsync = function (s, t, r) {
  return new Promise((u, n) => {
    let o = { url: s };

    if (t) {
      o.qs = t;
    }

    if (r) {
      o.headers = r;
    }

    e.get(o, (e, s, t) =>
      e ? n(e) : 200 !== s.statusCode ? n(s.statusMessage) : (u(t), void 0)
    );
  });
};
