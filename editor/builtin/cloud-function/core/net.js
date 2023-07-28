const s = require("request");
const t = { ciphers: "ALL", secureProtocol: "TLSv1_method" };

exports.post = function (e, r) {
  return new Promise((o, u) => {
    s.post({ url: e, json: true, form: r, agentOptions: t }, (s, t, e) => {
      try {
        if (s || 200 != t.statusCode) {
          u({ status: t.statusCode, msg: s });
        } else {
          if (0 === e.status || "success" === e.error_code) {
            o(e);
          } else {
            u({
                  status: e.status ? e.status : e.err_code,
                  msg: e.status ? e.msg : e.error_msg,
                });
          }
        }
      } catch (s) {}
    });
  });
};
