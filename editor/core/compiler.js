require("async");
require("fire-path");
var e = {
  _runTask: function (r, o) {
    var n = null;
    var i = false;
    Editor.App.spawnWorker(
      "app://editor/page/build/compile-worker",
      function (u, p) {
        if (!i) {
          i = true;

          p.once("closed", function () {
            u = null;

            if (o) {
              o(n);
            }
          });
        }

        u.send(
          "app:compile-worker-start",
          r,
          (r, o) => {
            if (o) {
              n = n || o;
            }

            if (!(u && u.nativeWin.isDestroyed())) {
              if (u && !e.debugWorker) {
                u.close();
              }
            }
          },
          -1
        );
      },
      e.debugWorker,
      true
    );
  },
  debugWorker: false,
};
module.exports = e;
