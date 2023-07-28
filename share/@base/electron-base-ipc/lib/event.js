"use strict";exports.MessageEvent = class{constructor(s){
  this.senderType = s;
  this.sender = "";
  this.needCallback = false;
  this.reply = function(){};
}};