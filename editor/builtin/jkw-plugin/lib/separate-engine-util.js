let e = require("path");
let o = require("fs-extra");
let r = (require("glob"), require("crypto"));
let i;
let n;
let c;
let s;
let t;
let u;
let a;
let d;
let p = false;

let l = {
  cocos: {
    provider: "com.cocos.creator.engine2d",
    version: Editor.versions.CocosCreator,
    path: "cocos",
  },
};

let g = { main: "cocos2d-runtime.js" };

let m = {
  provider: "com.cocos.creator.engine2d",
  signature: [{ path: "cocos2d-runtime.js", md5: "" }],
};

module.exports = {
  gatherInfo(o) {
    i = o.cpk;
    d = o.gameConfig;
    p = o.customConfig.separateEngineMode;
    let r = o.buildPath;
    n = e.join(r, "cocos");
    c = e.join(r, "src", "cocos2d-runtime.js");
    s = e.join(n, "cocos2d-runtime.js");
    Editor.url("packages://runtime-adapters/platforms/cocos-play");
    a = e.join(r, "main.js");
    t = e.join(n, "plugin.json");
    u = e.join(n, "signature.json");
  },
  organizeResources() {
    if (!p) {
      return;
    }
    Editor.info(Editor.T("cpk-publish.separate_engine_begin_hint"));

    if (!o.existsSync(n)) {
      o.ensureDirSync(n);
    }

    o.moveSync(c, s);
    let e = o.readFileSync(s);
    m.signature[0].md5 = r.createHash("md5").update(e).digest("hex");
    o.writeJSONSync(t, g);
    o.writeJSONSync(u, m);
    let i = o.readFileSync(a, "utf-8");
    if (i.indexOf("require('src/cocos2d-runtime.js');") > -1) {
      let e =
        "if (typeof requirePlugin === 'function') {\n\trequirePlugin('cocos');\n} else {\n\trequire('cocos/cocos2d-runtime.js');\n}";
      i = i.replace("require('src/cocos2d-runtime.js');", e);
      o.writeFileSync(a, i);
    }
    d.plugins = l;
    Editor.info(Editor.T("cpk-publish.separate_engine_end_hint"));
  },
  pack() {
    if (p) {
      i.directory(n, "cocos");
    }
  },
};
