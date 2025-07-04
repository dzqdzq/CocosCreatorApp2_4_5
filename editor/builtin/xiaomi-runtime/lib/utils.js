let o = require("child_process").spawn;

let r = {
  execCmd: (r, e, t) =>
    new Promise((c, d) => {
      console.log("exec command ", r, e);
      const n = o(r, e, { cwd: t });

      n.stdout.on("data", (o) => {
        Editor.log(o.toString());
      });

      n.stderr.on("data", (o) => {
        Editor.error(o.toString());
      });

      n.on("close", (o) => {
        if (o) {
          d(o);
        } else {
          c();
        }
      });
    }).catch((o) => {
      throw new Error("Error exec command, return code: " + o);
    }),
};

module.exports = r;
