"use strict";
var e = require("fire-fs");
var t = require("convert-source-map");
var r = require("typescript");
var o = require("path");

module.exports = class extends require("./javascript") {
  static defaultType() {
    return "typescript";
  }
  static validate(e) {
    return !e.endsWith(".d.ts");
  }
  compile(i, s) {
    var c;
    var a = "";
    try {
      a = e.readFileSync(i, { encoding: "utf8" });
      let t;
      let n = o.join(Editor.Project.path, "tsconfig.json");

      let p = {
        target: "ES5",
        sourceMap: true,
        allowJS: true,
        experimentalDecorators: true,
        allowSyntheticDefaultImports: true,
        pretty: true,
        noEmitHelpers: true,
        noImplicitUseStrict: true,
        module: r.ModuleKind.CommonJS,
      };

      try {
        let o = e.readFileSync(n, "utf8");
        let i = r.parseConfigFileTextToJson(n, o);

        if (i.error) {
          Editor.error("Error in tsconfig.json: " + i.error.messageText);
          t = p;
        } else {
          (t = i.config.compilerOptions).sourceMap = true;
        }
      } catch (e) {
        t = p;
      }
      c = r.transpileModule(a, { compilerOptions: t });
    } catch (e) {
      return s(e);
    }
    let n = JSON.parse(c.sourceMapText);
    n.sourcesContent = [a];
    n.file = "";
    c.sourceMapObject = n;
    c.outputText = t.removeMapFileComments(c.outputText);
    s(null, c);
  }
};
