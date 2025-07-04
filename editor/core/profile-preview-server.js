const { EventEmitter: e } = require("events");
module.exports = function (o) {
  const n = new e();

  n.on("route", ({ req: e, elapsedMS: o }) => {
    console.log(e.method, e.url, `${o}ms`);
  });

  o.use(function (e, o, t) {
    const s = Date.now();

    o.once("finish", () => {
      n.emit("route", { req: e, elapsedMS: Date.now() - s });
    });

    t();
  });
};
