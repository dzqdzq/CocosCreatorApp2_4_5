let e = require("path");
let r = require("fs-extra");
let o = (require("glob"), require("crypto"));
let i;
let n;
let s;
let t;
let c;
let a;
let u;
let d;
let l = false;

let m = {
  cocos: {
    provider: "com.cocos.creator.engine2d",
    version: Editor.versions.CocosCreator,
    path: "cocos",
  },
};

let p = { main: "cocos2d-runtime.js" };

let g = {
  provider: "com.cocos.creator.engine2d",
  signature: [{ path: "cocos2d-runtime.js", md5: "" }],
};

module.exports = {
  gatherInfo(r) {
    i = r.cpk;
    d = r.gameConfig;
    l = r.customConfig.separateEngineMode;
    let o = r.buildPath;
    n = e.join(o, "cocos");
    s = e.join(o, "src", "cocos2d-runtime.js");
    t = e.join(n, "cocos2d-runtime.js");
    Editor.url("packages://runtime-adapters/platforms/cocos-play");
    u = e.join(o, "main.js");
    c = e.join(n, "plugin.json");
    a = e.join(n, "signature.json");
  },
  organizeResources() {
    if (!l) {
      return;
    }
    Editor.info(Editor.T("link-sure-runtime.separate_engine_begin_hint"));

    if (!r.existsSync(n)) {
      r.ensureDirSync(n);
    }

    r.moveSync(s, t);
    let e = r.readFileSync(t);
    g.signature[0].md5 = o.createHash("md5").update(e).digest("hex");
    r.writeJSONSync(c, p);
    r.writeJSONSync(a, g);

    let i = Editor.url(
        "packages://runtime-adapters/platforms/cocos-play/res/main.js"
      );

    let j = r.readFileSync(i, "utf-8");
    if (j.indexOf("require('src/cocos2d-runtime.js');") > -1) {
      let e =
        "if (typeof requirePlugin === 'function') {\n\trequirePlugin('cocos');\n} else {\n\trequire('cocos/cocos2d-runtime.js');\n}";
      j = j.replace("require('src/cocos2d-runtime.js');", e);
      r.writeFileSync(u, j);
    }
    d.plugins = m;
    Editor.info(Editor.T("link-sure-runtime.separate_engine_end_hint"));
  },
  pack() {
    if (l) {
      i.directory(n, "cocos");
    }
  },
};
