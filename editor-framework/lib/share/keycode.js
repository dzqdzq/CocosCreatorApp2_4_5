"use strict";

exports = module.exports = function (r) {
  if (r && "object" == typeof r) {
    let e = r.which || r.keyCode || r.charCode;

    if (e) {
      r = e;
    }
  }
  if ("number" == typeof r) {
    return o[r];
  }
  let p = String(r);
  let a = e[p.toLowerCase()];
  return (
    a || (a = t[p.toLowerCase()]) || (1 === p.length ? p.charCodeAt(0) : void 0)
  );
};

let e = (exports.code = exports.codes =
  {
    backspace: 8,
    tab: 9,
    enter: 13,
    shift: 16,
    ctrl: 17,
    alt: 18,
    "pause/break": 19,
    "caps lock": 20,
    esc: 27,
    space: 32,
    "page up": 33,
    "page down": 34,
    end: 35,
    home: 36,
    left: 37,
    up: 38,
    right: 39,
    down: 40,
    insert: 45,
    delete: 46,
    command: 91,
    "right click": 93,
    "numpad *": 106,
    "numpad +": 107,
    "numpad -": 109,
    "numpad .": 110,
    "numpad /": 111,
    "num lock": 144,
    "scroll lock": 145,
    "my computer": 182,
    "my calculator": 183,
    ";": 186,
    "=": 187,
    ",": 188,
    "-": 189,
    ".": 190,
    "/": 191,
    "`": 192,
    "[": 219,
    "\\": 220,
    "]": 221,
    "'": 222,
  });

let t = (exports.aliases = {
  windows: 91,
  "⇧": 16,
  "⌥": 18,
  "⌃": 17,
  "⌘": 91,
  ctl: 17,
  control: 17,
  option: 18,
  pause: 19,
  break: 19,
  caps: 20,
  return: 13,
  escape: 27,
  spc: 32,
  pgup: 33,
  pgdn: 33,
  ins: 45,
  del: 46,
  cmd: 91,
});

for (let t = 97; t < 123; t++) {
  e[String.fromCharCode(t)] = t - 32;
}
for (let t = 48; t < 58; t++) {
  e[t - 48] = t;
}
for (let t = 1; t < 13; t++) {
  e["f" + t] = t + 111;
}
for (let t = 0; t < 10; t++) {
  e["numpad " + t] = t + 96;
}
let o = (exports.names = exports.title = {});
for (let t in e) o[e[t]] = t;
for (let o in t) e[o] = t[o];
