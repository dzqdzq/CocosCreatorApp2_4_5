"use strict";
let n = {};
function t(n, t) {
  return function (u) {
    return u < 0.5 ? t(2 * u) / 2 : n(2 * u - 1) / 2 + 0.5;
  };
}
module.exports = n;

n.linear = function (n) {
    return n;
  };

n.quadIn = function (n) {
    return n * n;
  };

n.quadOut = function (n) {
    return n * (2 - n);
  };

n.quadInOut = function (n) {
    return (n *= 2) < 1 ? 0.5 * n * n : -0.5 * (--n * (n - 2) - 1);
  };

n.quadOutIn = t(n.quadIn, n.quadOut);

n.cubicIn = function (n) {
    return n * n * n;
  };

n.cubicOut = function (n) {
    return --n * n * n + 1;
  };

n.cubicInOut = function (n) {
    return (n *= 2) < 1 ? 0.5 * n * n * n : 0.5 * ((n -= 2) * n * n + 2);
  };

n.cubicOutIn = t(n.cubicIn, n.cubicOut);

n.quartIn = function (n) {
    return n * n * n * n;
  };

n.quartOut = function (n) {
    return 1 - --n * n * n * n;
  };

n.quartInOut = function (n) {
    return (n *= 2) < 1
      ? 0.5 * n * n * n * n
      : -0.5 * ((n -= 2) * n * n * n - 2);
  };

n.quartOutIn = t(n.quartIn, n.quartOut);

n.quintIn = function (n) {
    return n * n * n * n * n;
  };

n.quintOut = function (n) {
    return --n * n * n * n * n + 1;
  };

n.quintInOut = function (n) {
    return (n *= 2) < 1
      ? 0.5 * n * n * n * n * n
      : 0.5 * ((n -= 2) * n * n * n * n + 2);
  };

n.quintOutIn = t(n.quintIn, n.quintOut);

n.sineIn = function (n) {
    return 1 - Math.cos((n * Math.PI) / 2);
  };

n.sineOut = function (n) {
    return Math.sin((n * Math.PI) / 2);
  };

n.sineInOut = function (n) {
    return 0.5 * (1 - Math.cos(Math.PI * n));
  };

n.sineOutIn = t(n.sineIn, n.sineOut);

n.expoIn = function (n) {
    return 0 === n ? 0 : Math.pow(1024, n - 1);
  };

n.expoOut = function (n) {
    return 1 === n ? 1 : 1 - Math.pow(2, -10 * n);
  };

n.expoInOut = function (n) {
    return 0 === n
      ? 0
      : 1 === n
      ? 1
      : (n *= 2) < 1
      ? 0.5 * Math.pow(1024, n - 1)
      : 0.5 * (2 - Math.pow(2, -10 * (n - 1)));
  };

n.expoOutIn = t(n.expoIn, n.expoOut);

n.circIn = function (n) {
    return 1 - Math.sqrt(1 - n * n);
  };

n.circOut = function (n) {
    return Math.sqrt(1 - --n * n);
  };

n.circInOut = function (n) {
    return (n *= 2) < 1
      ? -0.5 * (Math.sqrt(1 - n * n) - 1)
      : 0.5 * (Math.sqrt(1 - (n -= 2) * n) + 1);
  };

n.circOutIn = t(n.circIn, n.circOut);

n.elasticIn = function (n) {
  var t;
  var u = 0.1;
  return 0 === n
    ? 0
    : 1 === n
    ? 1
    : (!u || u < 1
        ? ((u = 1), (t = 0.1))
        : (t = (0.4 * Math.asin(1 / u)) / (2 * Math.PI)),
      -u *
        Math.pow(2, 10 * (n -= 1)) *
        Math.sin(((n - t) * (2 * Math.PI)) / 0.4));
};

n.elasticOut = function (n) {
  var t;
  var u = 0.1;
  return 0 === n
    ? 0
    : 1 === n
    ? 1
    : (!u || u < 1
        ? ((u = 1), (t = 0.1))
        : (t = (0.4 * Math.asin(1 / u)) / (2 * Math.PI)),
      u * Math.pow(2, -10 * n) * Math.sin(((n - t) * (2 * Math.PI)) / 0.4) +
        1);
};

n.elasticInOut = function (n) {
  var t;
  var u = 0.1;
  return 0 === n
    ? 0
    : 1 === n
    ? 1
    : (!u || u < 1
        ? ((u = 1), (t = 0.1))
        : (t = (0.4 * Math.asin(1 / u)) / (2 * Math.PI)),
      (n *= 2) < 1
        ? u *
          Math.pow(2, 10 * (n -= 1)) *
          Math.sin(((n - t) * (2 * Math.PI)) / 0.4) *
          -0.5
        : u *
            Math.pow(2, -10 * (n -= 1)) *
            Math.sin(((n - t) * (2 * Math.PI)) / 0.4) *
            0.5 +
          1);
};

n.elasticOutIn = t(n.elasticIn, n.elasticOut);

n.backIn = function (n) {
    var t = 1.70158;
    return n * n * ((t + 1) * n - t);
  };

n.backOut = function (n) {
    var t = 1.70158;
    return --n * n * ((t + 1) * n + t) + 1;
  };

n.backInOut = function (n) {
    var t = 2.5949095;
    return (n *= 2) < 1
      ? n * n * ((t + 1) * n - t) * 0.5
      : 0.5 * ((n -= 2) * n * ((t + 1) * n + t) + 2);
  };

n.backOutIn = t(n.backIn, n.backOut);

n.bounceIn = function (t) {
    return 1 - n.bounceOut(1 - t);
  };

n.bounceOut = function (n) {
    return n < 1 / 2.75
      ? 7.5625 * n * n
      : n < 2 / 2.75
      ? 7.5625 * (n -= 1.5 / 2.75) * n + 0.75
      : n < 2.5 / 2.75
      ? 7.5625 * (n -= 2.25 / 2.75) * n + 0.9375
      : 7.5625 * (n -= 2.625 / 2.75) * n + 0.984375;
  };

n.bounceInOut = function (t) {
    return t < 0.5
      ? 0.5 * n.bounceIn(2 * t)
      : 0.5 * n.bounceOut(2 * t - 1) + 0.5;
  };

n.bounceOutIn = t(n.bounceIn, n.bounceOut);

n.smooth = function (n) {
    return n <= 0 ? 0 : n >= 1 ? 1 : n * n * (3 - 2 * n);
  };

n.fade = function (n) {
    return n <= 0 ? 0 : n >= 1 ? 1 : n * n * n * (n * (6 * n - 15) + 10);
  };
