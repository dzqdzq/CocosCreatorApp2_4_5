const e = require("del");
const r = require("globby");
let n = "undefined" != typeof Editor;

module.exports = function (o) {
  let i = false;
  return {
    transform() {
      i = true;
    },
    async compileFinished(t) {
      if (i) {
        let t = [o("bin/.cache/*"), "!" + o("bin/.cache/dev")];
        if (0 == r.sync(t).length) {
          return;
        }

        if (n) {
          Editor.log(Editor.T("QUICK_COMPILER.engine_modified_info"));
        } else {
          console.log(
                "JavaScript Engine changes detected and the build cache was deleted."
              );
        }

        try {
          t = t.map((e) => e.replace(/\\/g, "/"));
          e.sync(t, { force: true });
        } catch (e) {
          if (n) {
            Editor.error(e);
          } else {
            console.error(e);
          }
        }
        i = false;
      }
    },
  };
};
