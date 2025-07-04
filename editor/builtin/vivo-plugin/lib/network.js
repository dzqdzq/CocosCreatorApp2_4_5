var e = require("os");
let r = {
  getHostIp: function () {
    const r = e.networkInterfaces();
    let t;
    for (const e in r)
      if (Object.prototype.hasOwnProperty.call(r, e) &&
      (r[e].every(
        (e, r, o) =>
          !(
            "IPv4" === e.family &&
            !e.internal &&
            "127.0.0.1" !== e.address &&
            ((t = e), 1)
          )
      ),
      void 0 !== t)) {
        break;
      }
    if (void 0 !== t) {
      return t.address;
    }
  },
};
module.exports = r;
