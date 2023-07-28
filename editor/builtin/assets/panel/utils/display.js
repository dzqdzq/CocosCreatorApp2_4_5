"use strict";
const e = require("./cache");
let n = e.queryNodes();
e.queryCache();

exports.point = function (t) {
  for (let o = n.length - 1; o >= 0; o--) {
    let r = n[o];
    if (r.show) {
      let n = r.showIndex * e.lineHeight + e.lineHeight;

      if (t < 0) {
        t = 0;
      } else {
        if (t > n) {
          t = n;
        }
      }

      break;
    }
  }
  let o = (t / e.lineHeight) | 0;
  return {
    y: t,
    node: e.queryShowNodes()[o] || null,
    remaining: t - o * e.lineHeight,
  };
};

exports.info = function (n) {
    let t = e.queryNode(n);
    if (!t) {
      return null;
    }
    let o = function (e) {
      let n = 0;

      if (e.show &&
        e.children) {
        e.children.forEach((e) => {
          if (e.show) {
            n += 1;
            n += o(e);
          }
        });
      }

      return n;
    };
    return {
      offset: e.queryShowNodes().findIndex((e) => e === t),
      count: o(t) + 1,
      node: t,
    };
  };
