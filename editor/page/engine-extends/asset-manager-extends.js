let e = cc.assetManager;
(e.cacheAsset = !1),
  (e.force = !0),
  (e.downloader.maxRetryCount = 0),
  (e.downloader.limited = !1),
  (e.downloader.appendTimeStamp = !0);
var t = (e.editorExtend = e.editorExtend || {}),
  a = new cc.AssetManager.Pipeline("parse existing asset and load", [
    function (e, t) {
      var a = e.input,
        n = cc.AssetManager.RequestItem.create();
      (n.isNative = !1),
        (n.uuid = "" + (new Date().getTime() + Math.random())),
        (n.file = a),
        (n.ext = ".json"),
        (e.source = e.output = [n]),
        t();
    },
    e._loadPipe,
  ]);
(t.loadJson = function (e, t, n) {
  "function" == typeof t && ((n = t), (t = null));
  var i = new cc.AssetManager.Task({
    input: e,
    options: t,
    onComplete: function (e) {
      e ? n && n(e, null) : ((this.output._uuid = ""), n && n(e, this.output));
    },
  });
  return a.async(i), i;
}),
  (t.parseUuid = function (t) {
    var a = "";
    if (t.startsWith(e.generalImportBase)) {
      var n = cc.path.dirname(t),
        i = cc.path.basename(n);
      if (2 === i.length) {
        var s = (a = cc.path.basename(t)).indexOf(".");
        -1 !== s && (a = a.slice(0, s));
      } else a = i;
    }
    return a;
  });
