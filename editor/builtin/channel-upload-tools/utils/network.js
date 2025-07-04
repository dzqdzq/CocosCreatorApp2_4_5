let e = require("fs");
let t = require("http");
let s = require("https");
let r = require("url");
let o = require("request");

exports.getAsync = function (e, t, s) {
  return new Promise((r, n) => {
    let a = { url: e };

    if (t) {
      a.qs = t;
    }

    if (s) {
      a.headers = s;
    }

    o.get(a, (e, t, s) =>
      e ? n(e) : 200 !== t.statusCode ? n(t.statusMessage) : (r(s), void 0)
    );
  });
};

exports.putAsync = function (e, t, s, r) {
    return new Promise((n, a) => {
      let p = { url: e };

      if (t) {
        p.qs = t;
      }

      if (r) {
        p.body = r;
      }

      if (s) {
        p.headers = s;
      }

      o.put(p, (e, t, s) =>
        e ? a(e) : 200 !== t.statusCode ? a(t.statusMessage) : (n(s), void 0)
      );
    });
  };

exports.uploadFile = function (t, s, r) {
    return new Promise((n, a) => {
      let p = { url: t, headers: { accept: "application/json" } };
      const u = o
        .post(p, (e, t, s) =>
          e ? a(e) : 200 !== t.statusCode ? a(t.statusMessage) : (n(s), void 0)
        )
        .form();
      u.append("file", e.createReadStream(s));
      u.append("authCode", r);
      u.append("fileCount", "1");
      u.append("parseType", "1");
    });
  };

exports.postAsync = function (e, o) {
    return new Promise((n, a) => {
      let p = r.parse(e);
      const u = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        host: p.host,
        path: p.path,
      };
      const i = (e.startsWith("http://") ? t : s).request(u, (e) => {
        let t = "";

        e.on("end", () => {
          n(t);
        });

        e.on("data", (e) => {
          t += e;
        });
      });

      i.on("error", (e) => {
        a(e);
      });

      i.write(o);
      i.end();
    });
  };
