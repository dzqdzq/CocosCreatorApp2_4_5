"use strict";require("util");
const e = require("fs-extra");
const a = require("path");
const d = require("../utils/cloud");
exports.creator = [{name:"Renderer",prefab:[{uuid:"1f55e3be-b89b-4b79-88de-47fd31018044",name:"Splash Sprite"},{uuid:"96083d03-c332-4a3f-9386-d03e2d19e8ee",name:"Sprite"},{uuid:"27756ebb-3d33-44b0-9b96-e858fadd4dd4",name:"Label"},{uuid:"4a37dd57-78cd-4cec-aad4-f11a73d12b63",name:"Rich Text"},{uuid:"cd33edea-55f5-46c2-958d-357a01384a36",name:"ParticleSystem"},{uuid:"7de03a80-4457-438d-95a7-3e7cdffd6086",name:"TiledMap"}]},{name:"UI",prefab:[{uuid:"2c937608-2562-40ea-b264-7395df6f0cea",name:"Canvas"},{uuid:"972b9a4d-47ee-4c74-b5c3-61d8a69bc29f",name:"Button"},{uuid:"785a442c-3ceb-45be-a46e-7317f625f3b9",name:"Layout"},{uuid:"32044bd2-481f-4cf1-a656-e2b2fb1594eb",name:"ScrollView"},{uuid:"ca8401fe-ad6e-41a8-bd46-8e3e4e9945be",name:"PageView"},{uuid:"5965ffac-69da-4b55-bcde-9225d0613c28",name:"ProgressBar"},{uuid:"61aeb05b-3b32-452b-8eed-2b76deeed554",name:"EditBox"},{uuid:"0004d1cf-a0ad-47d8-ab17-34d3db9d35a3",name:"Slider"},{uuid:"0d784963-d024-4ea6-a7db-03be0ad63010",name:"Toggle"},{uuid:"bf0a434c-84dd-4a8e-a08a-7a36f180cc75",name:"Toggle Group"},{uuid:"232d2782-c4bd-4bb4-9e01-909f03d6d3b9",name:"Video Player"},{uuid:"8c5001fd-07ee-4a4b-a8a0-63e15195e94d",name:"WebView"}]}];
exports.user = null;

exports.query = function(u){switch(u){case 0:return exports.creator;case 2:return exports.user;case 1:
  const c = [];
  const n = [{name:"Project",prefab:c}];
  return e.existsSync(d.paths.cloudFunctions)?(e.readdirSync(d.paths.cloudFunctions).forEach(u=>{const n=a.join(d.paths.cloudFunctions,u);if (e.statSync(n).isDirectory()) {
    try{
      const e = a.join(n,"package.json");
      const d = require(e);
      c.push({component:n,name:d.name||u,icon:d.icon?a.join(n,d.icon):""})
    }catch(e){console.warn(e)}
  }}),n):n;}};