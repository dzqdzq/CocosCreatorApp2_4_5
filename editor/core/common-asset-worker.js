let e;
let n;

let t = {
  async _init() {
    if (!e) {
      return n
        ? new Promise((e) => {
            let t = setInterval(function () {
              if (!n) {
                clearInterval(t);
                e();
              }
            }, 100);
          })
        : ((n = true),
          new Promise((t) => {
            Editor.App.spawnWorker(
              "app://editor/page/worker/common-asset-worker",
              function (r, o) {
                n = false;

                (e = r).send(
                  "app:init-common-asset-worker",
                  function () {
                    t();
                  },
                  -1
                );

                o.once("closed", function () {
                  e = null;
                });
              },
              false,
              true
            );
          }));
    }
  },
  async start(n, t) {
    await this._init();
    return new Promise((r, o) => {
      if (e) {
        e.send(
          "app:start-common-asset-worker",
          n,
          t,
          function (e, n) {
            if (e) {
              return o(e);
            }
            r(n);
          },
          -1
        );
      }
    });
  },
};

module.exports = t;
