"use strict";
let e = new (require("events").EventEmitter)();

exports.on = function (...t) {
  e.on(...t);
};

exports.emit = function (...t) {
    e.emit(...t);
  };
