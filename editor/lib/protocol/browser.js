"use strict";
const e = require("fire-url");
const r = require("fire-fs");
const { protocol: o } = require("electron");
const t = require("./utils");
let i = o.registerFileProtocol("unpack", (r, o) => {
  let i = decodeURIComponent(r.url);
  let s = e.parse(i);
  let n = t.unpackUrl2path(s);
  o(n ? { path: n } : -6);
});

if (i) {
  Editor.success("protocol unpack registerred");
} else {
  Editor.failed("Failed to register protocol unpack");
}

if ((i = o.registerStringProtocol("disable-commonjs", (o, t) => {
  let i;
  let s = e.parse(o.url);
  if (!s.slashes) {
    Editor.error('Please use "disable-commonjs://" + fspath.');
    return t(-6);
  }
  let n = decodeURIComponent(s.hostname);
  let l = decodeURIComponent(s.pathname);

  console.log(
    `Parsing disable-commonjs protocol, url: "${o.url}", hostname: "${n}", pathname: "${l}"`
  );

  if ((i = Editor.isWin32 ? n + ":" + l : l)) {
    r.readFile(i, "utf8", (e, r) => {
          if (e) {
            Editor.error(`Failed to read ${i}, ${e}`);
            return t(-6);
          }
          t({
            data: (function (e) {
              const r =
                "(function(){var require = undefined;var module = undefined; ";
              let o = e.lastIndexOf("\n");
              if (-1 !== o) {
                let t = e.slice(o).trimLeft();

                if (!t) {
                  o = e.lastIndexOf("\n", o - 1);
                  t = e.slice(o).trimLeft();
                }

                if (t.startsWith("//")) {
                  return r + e.slice(0, o) + "\n})();\n" + t;
                }
              }
              return r + e + "\n})();\n";
            })(r),
            charset: "utf-8",
          });
        });
  } else {
    t(-6);
  }
}))) {
  Editor.success("protocol disable-commonjs registerred");
} else {
  Editor.failed("Failed to register protocol disable-commonjs");
}

Editor.Protocol.register("unpack", t.unpackUrl2path);
