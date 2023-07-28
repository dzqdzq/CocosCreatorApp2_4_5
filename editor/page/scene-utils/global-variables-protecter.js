var t = Editor.require(
    "unpack://engine-dev/cocos2d/core/platform/utils"
  ).isPlainEmptyObj_DEV;

var e = ["currentImport", "webkitIndexedDB", "webkitStorageInfo"];
var o = ["object", "function", "boolean"];
var i = window;
function n(t) {
  this.info = "";
  this.onIntroduced = this.onModified = this.onDeleted = null;

  this.dontRestoreIntroduce = this.dontRestoreModify =
  this.dontRestoreDelete =
    false;

  var o = e;
  if (t) {
    if (t.ignoreNames) {
      o = o.concat(t.ignoreNames);
    }

    var i = t.callbacks;

    if (i) {
      if ("function" == typeof i) {
        this.onIntroduced = this.onModified = this.onDeleted = i;
      } else {
        this.onIntroduced = i.introduced;
        this.onModified = i.modified;
        this.onDeleted = i.deleted;
      }
    }

    var n = t.dontRestore;

    if (n) {
      if ("object" != typeof n) {
        this.dontRestoreIntroduce = this.dontRestoreModify =
        this.dontRestoreDelete =
          n;
      } else {
        this.dontRestoreIntroduce = n.introduced;
        this.dontRestoreModify = n.modified;
        this.dontRestoreDelete = n.deleted;
      }
    }

    this.info = t.info;
  }

  this.ignoreNames = o.reduce(function (t, e) {
    t[e] = true;
    return t;
  }, {});

  this._snapshot = {};
}

n.prototype = {
  record: function () {
    for (var t in ((this._snapshot = {}), i)) if (i.hasOwnProperty(t) && !this.ignoreNames[t]) {
      this._snapshot[t] = i[t];
    }
    return this;
  },
  isRecorded: function () {
    return !t(this._snapshot);
  },
  restore: function () {
    var t;
    for (t in (console.assert(this.isRecorded(), "Should recorded"), i))
      if (i.hasOwnProperty(t) && !this.ignoreNames[t]) {
        var e = i[t];
        if (t in this._snapshot) {
          var n = this._snapshot[t];
          if (e === n) {
            continue;
          }
          if (void 0 !== n) {
            if (o.includes(typeof n)) {
              if (this.onModified) {
                var s = Editor.Utils.toString(n) || '""';
                var d = Editor.Utils.toString(i[t]) || '""';
                this.onModified(
                  `Modified global variable while ${this.info}: ${t}\nBefore: ${s}\nAfter: ${d}`
                );
              }

              if (!this.dontRestoreModify) {
                i[t] = n;
              }
            }
            continue;
          }
        }

        if (this.onIntroduced) {
          this.onIntroduced(
            `Introduced global variable while ${this.info}: ${t}`
          );
        }

        if (
          (!this.dontRestoreIntroduce)
        ) {
          var r = false;
          try {
            r = delete i[t];
          } catch (t) {}

          if (!r) {
            this._snapshot[t] = i[t] = void 0;
          }
        }
      }
    for (t in this._snapshot) if (!(t in i || this.ignoreNames[t])) {
      if (this.onDeleted) {
        this.onDeleted(`Deleted global variable while ${this.info}: ${t}`);
      }

      if (!this.dontRestoreDelete) {
        i[t] = this._snapshot[t];
      }
    }
  },
};

module.exports = n;
