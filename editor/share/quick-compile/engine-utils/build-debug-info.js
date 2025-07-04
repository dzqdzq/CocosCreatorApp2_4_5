const r = require("child_process").spawn;
module.exports = function () {
  return {
    transform(o) {
      if (-1 !== o.src.indexOf("EngineErrorMap.md")) {
        var n = r("gulp", ["build-debug-infos"], {
          cwd: Editor.url("unpack://engine"),
        });

        n.stdout.on("data", (r) => {
          Editor.log(r.toString());
        });

        n.stderr.on("data", (r) => {
          Editor.log(r.toString());
        });
      }
    },
  };
};
