var e = function (e) {
    var r = e[0];
    if (void 0 !== r) {
      var i;
      var s;
      var n;
      var o;

      var f = new (function () {
        this.objList = [];
        this.keyList = [];
        this.referncedIDList = [];
        this.referencedCounts = [];
        this.temporaryDataList = [];
      })();

      f.referencedCounts = new Array(e.length);
      var a = e.slice();
      t(r, e, f);
      var c = 0;
      for (c = 0; c < f.temporaryDataList.length; c++) {
        delete f.temporaryDataList[c]._iN$t;
      }
      for (c = 0; c < f.objList.length; c++) {
        s = f.objList[c];
        i = f.referncedIDList[c];
        n = f.keyList[c];
        o = a[i];
        if (
          (!(f.referencedCounts[i] > 1))
        ) {
          s[n] = o;
          var d = e.indexOf(o);
          e.splice(d, 1);
        }
      }
      for (c = 0; c < f.objList.length; c++) {
        i = f.referncedIDList[c];
        n = f.keyList[c];
        s = f.objList[c];
        if (
          (f.referencedCounts[i] > 1)
        ) {
          o = a[i];
          var _ = e.indexOf(o);
          s[n].__id__ = _;
        }
      }
    }
  };

var t = function (e, t, i) {
  if ("object" == typeof e) {
    e._iN$t = true;
    i.temporaryDataList.push(e);
    if ((e.content)) {
      var s = e.__type__ && cc.js._getClassById(e.__type__);
      if (s && s.prototype._serialize) {
        return;
      }
    }
    var n;
    if (Array.isArray(e)) {
      for (var o = 0; o < e.length; o++) {
        if ((n = e[o])) {
          r(n, o, e, t, i);
        }
      }
    } else {
      for (var f in e) if ((n = e[f])) {
        r(n, f, e, t, i);
      }
    }
  }
};

var r = function (e, r, i, s, n) {
  var o = e.__id__;
  var f = void 0 !== o;

  if (f) {
    e = s[o];

    if (-1 !== n.referncedIDList.indexOf(o)) {
      n.referencedCounts[o]++;
    } else {
      n.referencedCounts[o] = 1;
    }

    n.referncedIDList.push(o);
    n.keyList.push(r);
    n.objList.push(i);
  }

  if (!e._iN$t) {
    t(e, s, n);
  } else {
    if (f) {
      n.referencedCounts[o]++;
    }
  }
};

if (CC_TEST) {
  cc._Test.nicifySerialized = e;
}

module.exports = e;
