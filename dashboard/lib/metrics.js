"use strict";const{setClientId:e,prepareUserIdentity:t,sendAppInfo:o,trackEvent:r}=require("../../share/metrics");

exports.dashboardOpen = function(){e(function(){
  t();
  o();
  r({category:"Editor",action:"Dashboard Open",label:"new metrics"});
})};

exports.dashboardClose = function(e){
  let t = false;

  let o = function(){
    if (!t) {
      t = true;

      if (e) {
        e();
      }
    }
  };

  r({category:"Editor",action:"Dashboard Close",label:"new metrics"},o);

  setTimeout(()=>{
    console.log("quit due to request timeout");
    o();
  },2e3);
};