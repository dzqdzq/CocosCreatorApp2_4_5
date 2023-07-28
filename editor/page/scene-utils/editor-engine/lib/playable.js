var i = cc.js;
var t = Editor.require("unpack://engine-dev/cocos2d/core/event/event-target");
var s = Editor.require("unpack://engine-dev/cocos2d/core/platform/CCObject");

var n = function(){
  function n(){
    t.call(this);
    this._isPlaying = false;
    this._isPaused = false;
    this._isUpdating = false;
    this._stepOnce = false;
  }i.extend(n,s);var e=n.prototype;
  i.mixin(e,t.prototype);
  i.get(e,"isPlaying",function(){return this._isPlaying},true);
  i.get(e,"isUpdating",function(){return this._isUpdating},true);
  i.get(e,"isPaused",function(){return this._isPaused},true);
  var a=function(){};
  e.onPlay = a;
  e.onPause = a;
  e.onResume = a;
  e.onStop = a;
  e.onError = a;

  e.play = function(){
    if (this._isPlaying) {
      if (this._isPaused) {
        this._isPaused = false;
        this._isUpdating = true;
        this.onResume();
        this.emit("resume");
      } else {
        this.onError("already-playing");
      }
    } else {
      this._isPlaying = true;
      this._isUpdating = !this._isPaused;
      this.onPlay();
      this.emit("play");
    }
  };

  e.stop = function(){
    if (this._isPlaying) {
      this._isPlaying = false;
      this._isPaused = false;
      this._isUpdating = false;
      this.emit("stop");
      this.onStop();
    }
  };

  e.pause = function(){
    this._isPaused = true;
    this._isUpdating = false;
    this.emit("pause");
    this.onPause();
  };

  e.step = function(){
    this.pause();
    this._stepOnce = true;

    if (!this._isPlaying) {
      this.play();
    }
  };

  return n;
}();

module.exports = n;