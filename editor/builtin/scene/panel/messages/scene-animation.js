"use strict";
const i = Editor.require("scene://edit-mode");
const e = Editor.require("scene://utils/animation");

module.exports = {"query-animation-time"(i,n){var a=e.getAnimationTime(n.clip);i.reply(null,a)},"animation-time-changed"(i,n){e.setAnimationTime(n.time)},"animation-clip-changed"(i,n){e.updateClip(n)},"save-clip"(){i.save()},"set-animation-speed"(i,n){e.setSpeed(n)},"change-animation-record"(e,n){
  if (n) {
    i.push("animation");
  } else {
    i.pop("animation");
  }
},"mount-clip"(i,n,a){e.mountClip(n,a)},"change-animation-state"(i,n){
  if ("play"===n.state) {
    e.playAnimation();
  } else {
    e.pauseAnimation();
  }
},"change-animation-current-clip"(i,n){e.switchClip(n,i.reply)}};