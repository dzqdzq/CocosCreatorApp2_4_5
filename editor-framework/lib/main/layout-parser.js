let e = {};
module.exports = e;
const r = require("js-yaml");

e.parse = function (e, t) {
  let n;
  return (n = "json" === t.format ? JSON.parse(e) : r.safeLoad(e));
};

e.stringify = function (e, t) {
    let n;
    return (n =
      "json" === t.format ? JSON.stringify(e, null, 2) : r.safeDump(e));
  };
