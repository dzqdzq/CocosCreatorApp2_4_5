const {EventEmitter:e} = require("events");
const t = require("../../@base/electron-base-ipc");
module.exports = new (class extends e {trackEvent(e,t,c,s){}trackCocosEvent(e,c){t.send("cocos-metrics:track-cocos-event",e,c)}trackException(e){}});