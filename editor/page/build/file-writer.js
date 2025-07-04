"use strict";
var e = require("path");
const { promisify: t } = require("util");
var r = require("fire-fs");
var i = require("del");
var s = require("globby");
const a = t(r.outputFile);

module.exports = class {
  constructor(e, t) {
    this.dest = e;
    this.jsonSpace = t ? 2 : 0;
  }
  getUuidPathNoExt(t) {
    return e.join(this.dest, t.slice(0, 2), t);
  }
  getJsonPath(e) {
    return this.getUuidPathNoExt(e) + ".json";
  }
  write(e, t, i) {
    r.outputFile(e, t, i);
  }
  writeJsonByUuidNoCache(e, t, i) {
    if (!i) {
      return a(this.getJsonPath(e), t);
    }
    r.outputFile(this.getJsonPath(e), t, i);
  }
  writeJsonByUuid(e, t, r) {
    var i = JSON.stringify(t, null, this.jsonSpace);
    return this.writeJsonByUuidNoCache(e, i, r);
  }
  read(e, t) {
    r.readFile(e, t);
  }
  readJsonByUuid(e, t) {
    var i = this.getJsonPath(e);
    r.readFile(i, "utf8", function (e, r) {
      if (e) {
        return t(e);
      }
      var s;
      try {
        s = JSON.parse(r);
      } catch (e) {
        e.message = i + ": " + e.message;
        return t(e);
      }
      t(null, s);
    });
  }
  delete(e, t) {
    e = Array.isArray(e)
      ? e.map((e) => e.replace(/\\/g, "/"))
      : e.replace(/\\/g, "/");

    i(e, { force: true })
      .then((e) => {
        t();
      })
      .catch(t);
  }
  deleteJsonsByUuid(e, t) {
    var r = e.map(this.getJsonPath.bind(this));
    this.delete(r, t);
  }
  flush(t) {
    var i = e.join(this.dest, "??/");
    s(i, (e, i) => {
      if (e) {
        return t(e);
      }
      try {
        for (var s = 0; s < i.length; s++) {
          var a = i[s];

          if (0 === r.readdirSync(a).length) {
            r.rmdirSync(a);
          }
        }
      } catch (e) {
        return t(e);
      }
      t();
    });
  }
};
