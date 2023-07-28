const e = require("@babel/core");
module.exports = function (r) {
  return {
    transform(s) {
      if (-1 !== s.src.indexOf(".json")) {
        return;
      }
      let o = "inline";

      if ((r = r || {}).exludesForSourceMap &&
        r.exludesForSourceMap.includes(s.src)) {
        o = false;
      }

      let l = e.transform(s.source, {
        ast: false,
        highlightCode: false,
        sourceMaps: o,
        compact: false,
        filename: s.src,
        presets: [
          [require("@babel/preset-env"), { loose: true }],
          {
            plugins: [
              [require("@babel/plugin-proposal-decorators"), { legacy: true }],
              [
                require("@babel/plugin-proposal-class-properties"),
                { loose: true },
              ],
            ],
          },
          [require("@babel/preset-typescript"), { allowDeclareFields: true }],
        ],
        plugins: [
          [require("babel-plugin-const-enum"), { transform: "constObject" }],
          [require("babel-plugin-add-module-exports")],
        ],
      });
      s.source = l.code;
    },
  };
};
