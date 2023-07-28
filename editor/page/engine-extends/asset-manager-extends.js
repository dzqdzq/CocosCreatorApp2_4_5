let e = cc.assetManager;
e.cacheAsset = false;
e.force = true;
e.downloader.maxRetryCount = 0;
e.downloader.limited = false;
e.downloader.appendTimeStamp = true;
var t = (e.editorExtend = e.editorExtend || {});

var a = new cc.AssetManager.Pipeline("parse existing asset and load", [
  function (e, t) {
    var a = e.input;
    var n = cc.AssetManager.RequestItem.create();
    n.isNative = false;
    n.uuid = "" + (new Date().getTime() + Math.random());
    n.file = a;
    n.ext = ".json";
    e.source = e.output = [n];
    t();
  },
  e._loadPipe,
]);

t.loadJson = function (e, t, n) {
  if ("function" == typeof t) {
    n = t;
    t = null;
  }

  var i = new cc.AssetManager.Task({
    input: e,
    options: t,
    onComplete: function (e) {
      if (e) {
        if (n) {
          n(e, null);
        }
      } else {
        this.output._uuid = "";

        if (n) {
          n(e, this.output);
        }
      }
    },
  });
  a.async(i);
  return i;
};

t.parseUuid = function (t) {
    var a = "";
    if (t.startsWith(e.generalImportBase)) {
      var n = cc.path.dirname(t);
      var i = cc.path.basename(n);
      if (2 === i.length) {
        var s = (a = cc.path.basename(t)).indexOf(".");

        if (-1 !== s) {
          a = a.slice(0, s);
        }
      } else {
        a = i;
      }
    }
    return a;
  };
