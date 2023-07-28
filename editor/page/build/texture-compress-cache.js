const e = require("fire-fs");
const t = require("fire-path");
let r = Editor.remote.assetdb;

module.exports = {
  exportTo(n, i, o, a) {
    try {
      const c = r.getCachePath(n);
      if (e.readFileSync(t.join(c, i.name + ".json"), "utf8") !==
      JSON.stringify(i)) {
        return false;
      }
      e.copySync(t.join(c, i.name + o), a);
    } catch (e) {
      return false;
    }
    return true;
  },
  add(n, i, o, a) {
    try {
      const c = r.getCachePath(n);
      e.copySync(a, t.join(c, i.name + o));
      e.writeFileSync(t.join(c, i.name + ".json"), JSON.stringify(i));
    } catch (e) {
      Editor.warn(e);
    }
  },
};
