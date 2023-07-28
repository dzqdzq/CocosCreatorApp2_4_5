"use strict";
var e = require("fire-fs");
var t = require("readline");
var i = require("fire-path");
var r = require("async");
var s = require("@babel/core");
var a = require("convert-source-map");
var o = require("./precompile-script");
var l = 92160;
function u(t) {
  if (-1 !== i.basename(t).lastIndexOf(".min.")) {
    return true;
  }
  var r = e.statSync(t);
  return r && r.size >= l;
}
function n(t) {
  var r = i.basename(t);
  var s = e.statSync(t);
  return (0 === Editor.Dialog.messageBox({
    type: "question",
    buttons: [Editor.T("MESSAGE.yes"), Editor.T("MESSAGE.no")],
    title: Editor.T("MESSAGE.assets.plugin_title"),
    message: Editor.T("MESSAGE.assets.plugin_message", { fileName: r }),
    detail: Editor.T("MESSAGE.assets.plugin_detail", {
      fileSize: (function (e) {
        if (0 === e) {
          return "0 B";
        }
        var t = Math.floor(Math.log(e) / Math.log(1024));
        return (
          (e / Math.pow(1024, t)).toPrecision(3) +
          " " +
          ["B", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"][t]
        );
      })(s.size),
    }),
    defaultId: 0,
    cancelId: 1,
    noLink: true,
  }));
}
class p extends Editor.metas.asset {
  constructor(e) {
    super(e);
    this.isPlugin = null;
    this.loadPluginInWeb = true;
    this.loadPluginInNative = true;
    this.loadPluginInEditor = false;
  }
  static defaultType() {
    return "javascript";
  }
  static version() {
    return "1.0.8";
  }
  getImportedPaths() {
    var e = this._assetdb._uuidToImportPathNoExt(this.uuid);
    return [e + ".js", e + ".js.map"];
  }
  dests() {
    if (null === this.isPlugin) {
      var e = this._assetdb.uuidToFspath(this.uuid);
      this.isPlugin = u(e);
    }
    return this.isPlugin ? [] : this.getImportedPaths();
  }
  compile(t, i) {
    var r;
    try {
      var o = e.readFileSync(t, { encoding: "utf-8" });
      var l = !!a.fromSource(o);

      r = s.transform(o, {
        ast: false,
        highlightCode: false,
        sourceMaps: true,
        inputSourceMap: l,
        compact: false,
        filename: t,
        presets: [[require("@babel/preset-env"), { loose: true }]],
        plugins: [
          [require("@babel/plugin-proposal-decorators"), { legacy: true }],
          [require("@babel/plugin-proposal-class-properties"), { loose: true }],
          [require("babel-plugin-add-module-exports")],
        ],
      });
    } catch (e) {
      return i(e);
    }
    i(null, { outputText: r.code, sourceMapObject: r.map });
  }
  _importToLibrary(e, t) {
    r.waterfall(
      [
        (t) => {
          this.compile(e, function (e, i) {
            if (e) {
              e.code = "ESCRIPTIMPORT";
              e.stack = "Compile error: " + e.stack;
            }

            t(e, i);
          });
        },
        o.compile.bind(null, this.uuid, e),
        (e, t) => {
          this._assetdb.saveAssetToLibrary(this.uuid, e.outputText, ".js");

          this._assetdb.saveAssetToLibrary(
            this.uuid,
            JSON.stringify(e.sourceMapObject),
            ".js.map"
          );

          t(null);
        },
      ],
      t
    );
  }
  checkGlobalVariables(i, r) {
    var s = /^var\s+\S+/;
    var a = t.createInterface({ input: e.createReadStream(i) });

    a.on("line", (e) => {
      if (s.test(e)) {
        Editor.info(
          Editor.T("MESSAGE.assets.js_global_var_1_4", {
            property: Editor.T("INSPECTOR.javascript.loadPluginInEditor"),
            path: i,
            line: e.trim(),
          })
        );
      }
    });

    a.on("close", r);
  }
  import(e, t) {
    if (null === this.isPlugin) {
      this.isPlugin = false;

      if (u(e)) {
        this.isPlugin = n(e);
      }
    }

    if (this.isPlugin) {
      if (!this.loadPluginInEditor) {
        return t();
      }
      this.checkGlobalVariables(e, t);
    } else {
      this._importToLibrary(e, t);
    }
  }
  export(t, i, r) {
    if (i) {
      e.writeFile(t, i, r);
    } else {
      if (r) {
        r();
      }
    }
  }
}
false;
module.exports = p;
