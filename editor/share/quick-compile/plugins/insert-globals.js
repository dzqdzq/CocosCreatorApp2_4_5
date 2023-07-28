const { Readable: e } = require("stream");
const r = require("insert-module-globals");
const { isNodeModulePath: o } = require("../utils");

module.exports = function () {
  return {
    nodeModule: true,
    async transform(n, u) {
      let { src: s, source: t } = n;
      n.source = await new Promise((n, a) => {
        var i = "";
        var d = new e();
        d.push(t);
        d.push(null);

        d
          .pipe(r(s, { debug: !o(s), basedir: u.root }))
          .on("data", function (e) {
            i += e.toString();
          })
          .on("end", () => {
            n(i);
          })
          .on("error", (e) => {
            a(e);
          });
      });
    },
  };
};
