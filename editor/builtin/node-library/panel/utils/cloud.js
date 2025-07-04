"use strict";
const o = require("path");
const n = require("fs-extra");
exports.paths = {cloudFunctions:o.join(Editor.remote?Editor.remote.App.home:Editor.App.home,"cloud-component"),assets:"db://assets/cloud-component"};
exports.cloudFunction = [];

exports.dragCloudFunction = function(o){
  if (-1===exports.cloudFunction.indexOf(o)) {
    exports.cloudFunction.push(o);
  }
};

exports.dropCloudFunction = function(o){setTimeout(()=>{
  const n=exports.cloudFunction.indexOf(o);

  if (-1!==n) {
    exports.cloudFunction.splice(n,1);
  }
},600)};

exports.applyCloudFunction = function(){
  let t="undefinedenv";const e=o.join(Editor.Project.path,"settings/serverless.json");if (n.existsSync(e)) {
    try{t = n.readJSONSync(e).env_id||"undefinedenv";}catch(o){Editor.warn(o)}
  }const c=o.join(Editor.Project.path,"serverless","cloud-function",t);
  n.ensureDirSync(c);

  exports.cloudFunction.forEach(t=>{
    const e=o.join(t,"../../cloud-function");

    if (n.existsSync(e)) {
      n.readdirSync(e).forEach(t=>{n.copySync(o.join(e,t),o.join(c,t))});
    }
  });
};