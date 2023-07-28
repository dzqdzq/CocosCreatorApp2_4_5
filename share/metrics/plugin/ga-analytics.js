(function(){
  var t=function(t){this.w = t||[];};
  t.prototype.set = function(t){this.w[t] = true;};

  t.prototype.encode = function(){for (var t=[],e=0; e<this.w.length; e++) {
    if (this.w[e]) {
      t[Math.floor(e/6)] ^= 1<<e%6;
    }
  }for (e=0; e<t.length; e++) {
    t[e] = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_".charAt(t[e]||0);
  }return t.join("")+"~"};

  var e=new t;function n(t){e.set(t)}

  var i = function(e,n){
    var i=new t(a(e));
    i.set(n);
    e.set(ee,i.w);
  };

  var r = function(n){
    n = a(n);
    n = new t(n);
    for (var i=e.w.slice(),r=0; r<n.w.length; r++) {
      i[r] = i[r]||n.w[r];
    }return new t(i).encode()
  };

  var a = function(t){
    t = t.get(ee);

    if (!s(t)) {
      t = [];
    }

    return t;
  };

  var o = function(t){return"function"==typeof t};
  var s = function(t){return"[object Array]"==Object.prototype.toString.call(Object(t))};
  var c = function(t){return void 0!=t&&-1<(t.constructor+"").indexOf("String")};
  var u = function(t,e){return 0==t.indexOf(e)};
  var h = function(t){return t?t.replace(/^[\s\xa0]+|[\s\xa0]+$/g,""):""};

  var l = function(t){
    var e=k.createElement("img");
    e.width = 1;
    e.height = 1;
    e.src = t;
    return e;
  };

  var f = function(){};
  var g = function(t){return encodeURIComponent instanceof Function?encodeURIComponent(t):(n(28),t)};

  var v = function(t,e,i,r){try{
    if (t.addEventListener) {
      t.addEventListener(e,i,!!r);
    } else {
      if (t.attachEvent) {
        t.attachEvent("on"+e,i);
      }
    }
  }catch(t){n(27)}};

  var p = function(t,e){if(t){
    var n=k.createElement("script");
    n.type = "text/javascript";
    n.async = true;
    n.src = t;

    if (e) {
      n.id = e;
    }

    var i=k.getElementsByTagName("script")[0];i.parentNode.insertBefore(n,i)
  }};

  var d = function(){return"https:"==k.location.protocol};
  var m = function(){var t=""+k.location.hostname;return 0==t.indexOf("www.")?t.substring(4):t};

  var w = function(t,e){if (1==e.length&&null!=e[0]&&"object"==typeof e[0]) {
    return e[0];
  }for(var n={},i=Math.min(t.length+1,e.length),r=0;r<i;r++){
    if("object"==typeof e[r]){for (var a in e[r]) if (e[r].hasOwnProperty(a)) {
      n[a] = e[r][a];
    }break}

    if (r<t.length) {
      n[t[r]] = e[r];
    }
  }return n};

  var b = function(){
    this.keys = [];
    this.values = {};
    this.m = {};
  };

  b.prototype.set = function(t,e,n){
    this.keys.push(t);

    if (n) {
      this.m[":"+t] = e;
    } else {
      this.values[":"+t] = e;
    }
  };

  b.prototype.get = function(t){return this.m.hasOwnProperty(":"+t)?this.m[":"+t]:this.values[":"+t]};

  b.prototype.map = function(t){for(var e=0;e<this.keys.length;e++){
    var n = this.keys[e];
    var i = this.get(n);

    if (i) {
      t(n,i);
    }
  }};

  var y = window;
  var k = document;

  var _ = function(t){var e=y._gaUserPrefs;if (e&&e.ioo&&e.ioo()||t&&true===y["ga-disable-"+t]) {
    return true;
  }try{var n=y.external;if (n&&n._gaUserPrefs&&"oo"==n._gaUserPrefs) {
    return true;
  }}catch(t){}return false;};

  var x = function(t){
    var e = [];
    var n = k.cookie.split(";");
    t = new RegExp("^\\s*"+t+"=\\s*(.*?)\\s*$");
    for(var i=0;i<n.length;i++){
      var r=n[i].match(t);

      if (r) {
        e.push(r[1]);
      }
    }return e
  };

  var j = function(t,e,i,r,a,o){
    if (!(a=!_(a)&&!(C.test(k.location.hostname)||"/"==i&&S.test(r)))) {
      return false;
    }

    if (e&&1200<e.length) {
      e = e.substring(0,1200);
      n(24);
    }

    i = t+"="+e+"; path="+i+"; ";

    if (o) {
      i += "expires="+new Date((new Date).getTime()+o).toGMTString()+"; ";
    }

    if (r&&"none"!=r) {
      i += "domain="+r+";";
    }

    r = k.cookie;
    k.cookie = i;
    if (!(r=r!=k.cookie)) {
      t:{for (t=x(t),r=0; r<t.length; r++) {
        if(e==t[r]){r = true;break t}
      }r = false;}
    }return r
  };

  var O = function(t){return g(t).replace(/\(/g,"%28").replace(/\)/g,"%29")};
  var S = /^(www\.)?google(\.com?)?(\.[a-z]{2})?$/;
  var C = /(^|\.)doubleclick\.net$/i;
  var A = function(){return(ot||d()?"https:":"http:")+"//www.google-analytics.com"};

  var T = function(t,e,n){
    n = n||f;
    if (2036>=e.length) {
      L(t,e,n);
    } else {
      if (!(8192>=e.length)) {
        throw (P("len",e.length), new function(t){
          this.name = "len";
          this.message = t+"-8192";
        }(e.length));
      }

      if (!(I(t,e,n) || E(t,e,n))) {
        L(t,e,n);
      }
    }
  };

  var L = function(t,e,n){var i=l(t+"?"+e);i.onload = i.onerror=function(){
    i.onload = null;
    i.onerror = null;
    n();
  };};

  var E = function(t,e,n){var i=y.XMLHttpRequest;if (!i) {
    return false;
  }var r=new i;return "withCredentials"in r&&(r.open("POST",t,true),r.withCredentials=true,r.setRequestHeader("Content-Type","text/plain"),r.onreadystatechange=function(){
    if (4==r.readyState) {
      n();
      r = null;
    }
  },r.send(e),true);};

  var I = function(t,e,n){return !!y.navigator.sendBeacon&&(!!y.navigator.sendBeacon(t,e)&&(n(),true));};

  var P = function(t,e,n){
    if (!(1<=100*Math.random() || _("?"))) {
      t = ["t=error","_e="+t,"_v=j41","sr=1"];

      if (e) {
        t.push("_f="+e);
      }

      if (n) {
        t.push("_m="+g(n.substring(0,100)));
      }

      t.push("aip=1");
      t.push("z="+B());
      L(A()+"/collect",t.join("&"),f);
    }
  };

  var V = function(){this.M = [];};
  function M(t){if (100!=t.get(Le)&&Pn(Y(t,we))%1e4>=100*Z(t,Le)) {
    throw"abort"
  }}function N(t){if (_(Y(t,ye))) {
    throw"abort"
  }}function D(){var t=k.location.protocol;if ("http:"!=t&&"https:"!=t) {
    throw"abort"
  }}function R(t){
    try{
      if (y.navigator.sendBeacon) {
        n(42);
      } else {
        if (y.XMLHttpRequest&&"withCredentials"in new y.XMLHttpRequest) {
          n(40);
        }
      }
    }catch(t){}
    t.set(te,r(t),true);
    t.set(dt,Z(t,dt)+1);
    var e=[];

    W.map(function(n,i){if(i.F){
      var r=t.get(n);

      if (void 0!=r&&r!=i.defaultValue) {
        if ("boolean"==typeof r) {
          r *= 1;
        }

        e.push(i.F+"="+g(""+r));
      }
    }});

    e.push("z="+z());
    t.set(gt,e.join("&"),true);
  }function F(t){
    var e = Y(t,Pe)||A()+"/collect";
    var n = Y(t,pt);

    if (!n&&t.get(vt)) {
      n = "beacon";
    }

    if (n) {
      var i = Y(t,gt);
      var r = (r=t.get(ft))||f;

      if ("image"==n) {
        L(e,i,r);
      } else {
        if (!("xhr"==n&&E(e,i,r) || "beacon"==n&&I(e,i,r))) {
          T(e,i,r);
        }
      }
    } else {
      T(e,Y(t,gt),t.get(ft));
    }t.set(ft,f,true)
  }function H(t){
    var e=y.gaData;

    if (e) {
      if (e.expId) {
        t.set(qt,e.expId);
      }

      if (e.expVar) {
        t.set(Xt,e.expVar);
      }
    }
  }function $(){if (y.navigator&&"preview"==y.navigator.loadPurpose) {
    throw"abort"
  }}function G(t){
    var e=y.gaDevIds;

    if (s(e)&&0!=e.length) {
      t.set("&did",e.join(","),true);
    }
  }function U(t){if (!t.get(ye)) {
    throw"abort"
  }}
  V.prototype.add = function(t){this.M.push(t)};

  V.prototype.D = function(t){
    try{for(var e=0;e<this.M.length;e++){
      var n=t.get(this.M[e]);

      if (n&&o(n)) {
        n.call(y,t);
      }
    }}catch(t){}

    if ((e=t.get(ft))!=f&&o(e)) {
      t.set(ft,f,true);
      setTimeout(e,10);
    }
  };

  var B = function(){return Math.round(2147483647*Math.random())};

  var z = function(){try{
    var t=new Uint32Array(1);
    y.crypto.getRandomValues(t);
    return 2147483647&t[0];
  }catch(t){return B()}};

  function q(t){
    var e=Z(t,Zt);

    if (500<=e) {
      n(15);
    }

    if("transaction"!=(i=Y(t,lt))&&"item"!=i){
      var i = Z(t,Qt);
      var r = (new Date).getTime();
      var a = Z(t,Jt);

      if (0==a) {
        t.set(Jt,r);
      }

      if (0<(a=Math.round(2*(r-a)/1e3))) {
        i = Math.min(i+a,20);
        t.set(Jt,r);
      }

      if (0>=i) {
        throw"abort";
      }t.set(Qt,--i)
    }t.set(Zt,++e)
  }
  var X = function(){this.data = new b;};
  var W = new b;
  var K = [];

  X.prototype.get = function(t){
    var e = tt(t);
    var n = this.data.get(t);

    if (e&&void 0==n) {
      n = o(e.defaultValue)?e.defaultValue():e.defaultValue;
    }

    return e&&e.Z?e.Z(this,t,n):n;
  };

  var Y = function(t,e){var n=t.get(e);return void 0==n?"":""+n};
  var Z = function(t,e){var n=t.get(e);return void 0==n||""===n?0:1*n};

  X.prototype.set = function(t,e,n){if (t) {
    if ("object"==typeof t) {
      for (var i in t) if (t.hasOwnProperty(i)) {
        J(this,i,t[i],n);
      }
    } else {
      J(this,t,e,n)
    }
  }};

  var J = function(t,e,n,i){
    if (void 0!=n) {
      switch(e){case ye:mn.test(n)}
    }var r=tt(e);

    if (r&&r.o) {
      r.o(t,e,n,i);
    } else {
      t.data.set(e,n,i);
    }
  };

  var Q = function(t,e,n,i,r){
    this.name = t;
    this.F = e;
    this.Z = i;
    this.o = r;
    this.defaultValue = n;
  };

  var tt = function(t){var e=W.get(t);if (!e) {
    for(var n=0;n<K.length;n++){
      var i = K[n];
      var r = i[0].exec(t);
      if(r){
        e = i[1](r);
        W.set(e.name,e);
        break
      }
    }
  }return e};

  var et = function(t,e,n,i,r){
    t = new Q(t,e,n,i,r);
    W.set(t.name,t);
    return t.name;
  };

  var nt = function(t,e){K.push([new RegExp("^"+t+"$"),e])};
  var it = function(t,e,n){return et(t,e,n,void 0,rt)};
  var rt = function(){};
  var at = c(window.GoogleAnalyticsObject)&&h(window.GoogleAnalyticsObject)||"ga";
  var ot = false;
  var st = et("_br");
  var ct = it("apiVersion","v");
  var ut = it("clientVersion","_v");
  et("anonymizeIp","aip");
  var ht = et("adSenseId","a");
  var lt = et("hitType","t");
  var ft = et("hitCallback");
  var gt = et("hitPayload");
  et("nonInteraction","ni");
  et("currencyCode","cu");
  et("dataSource","ds");
  var vt = et("useBeacon",void 0,false);
  var pt = et("transport");
  et("sessionControl","sc","");
  et("sessionGroup","sg");
  et("queueTime","qt");
  var dt=et("_s","_s");et("screenName","cd");
  var mt = et("location","dl","");
  var wt = et("referrer","dr");
  var bt = et("page","dp","");
  et("hostname","dh");
  var yt = et("language","ul");
  var kt = et("encoding","de");
  et("title","dt",function(){return k.title||void 0});
  nt("contentGroup([0-9]+)",function(t){return new Q(t[0],"cg"+t[1])});
  var _t = et("screenColors","sd");
  var xt = et("screenResolution","sr");
  var jt = et("viewportSize","vp");
  var Ot = et("javaEnabled","je");
  var St = et("flashVersion","fl");
  et("campaignId","ci");
  et("campaignName","cn");
  et("campaignSource","cs");
  et("campaignMedium","cm");
  et("campaignKeyword","ck");
  et("campaignContent","cc");
  var Ct = et("eventCategory","ec");
  var At = et("eventAction","ea");
  var Tt = et("eventLabel","el");
  var Lt = et("eventValue","ev");
  var Et = et("socialNetwork","sn");
  var It = et("socialAction","sa");
  var Pt = et("socialTarget","st");
  var Vt = et("l1","plt");
  var Mt = et("l2","pdt");
  var Nt = et("l3","dns");
  var Dt = et("l4","rrt");
  var Rt = et("l5","srt");
  var Ft = et("l6","tcp");
  var Ht = et("l7","dit");
  var $t = et("l8","clt");
  var Gt = et("timingCategory","utc");
  var Ut = et("timingVar","utv");
  var Bt = et("timingLabel","utl");
  var zt = et("timingValue","utt");
  et("appName","an");
  et("appVersion","av","");
  et("appId","aid","");
  et("appInstallerId","aiid","");
  et("exDescription","exd");
  et("exFatal","exf");
  var qt = et("expId","xid");
  var Xt = et("expVar","xvar");
  var Wt = et("_utma","_utma");
  var Kt = et("_utmz","_utmz");
  var Yt = et("_utmht","_utmht");
  var Zt = et("_hc",void 0,0);
  var Jt = et("_ti",void 0,0);
  var Qt = et("_to",void 0,20);
  nt("dimension([0-9]+)",function(t){return new Q(t[0],"cd"+t[1])});
  nt("metric([0-9]+)",function(t){return new Q(t[0],"cm"+t[1])});
  et("linkerParam",void 0,void 0,function(t){var e=rn(t=t.get(we),0);return"_ga=1."+g(e+"."+t)},rt);
  var te = et("usage","_u");
  var ee = et("_um");
  et("forceSSL",void 0,void 0,function(){return ot},function(t,e,i){
    n(34);
    ot = !!i;
  });var ne=et("_j1","jid");nt("\\&(.*)",function(t){
    var e = new Q(t[0],t[1]);

    var n = function(t){
      var e;

      W.map(function(n,i){
        if (i.F==t) {
          e = i;
        }
      });

      return e&&e.name;
    }(t[0].substring(1));

    if (n) {
      e.Z = function(t){return t.get(n)};
      e.o = function(t,e,i,r){t.set(n,i,r)};
      e.F = void 0;
    }

    return e;
  });
  var ie = it("_oot");
  var re = et("previewTask");
  var ae = et("checkProtocolTask");
  var oe = et("validationTask");
  var se = et("checkStorageTask");
  var ce = et("historyImportTask");
  var ue = et("samplerTask");
  var he = et("_rlt");
  var le = et("buildHitTask");
  var fe = et("sendHitTask");
  var ge = et("ceTask");
  var ve = et("devIdTask");
  var pe = et("timingTask");
  var de = et("displayFeaturesTask");
  var me = it("name");
  var we = it("clientId","cid");
  var be = et("userId","uid");
  var ye = it("trackingId","tid");
  var ke = it("cookieName",void 0,"_ga");
  var _e = it("cookieDomain");
  var xe = it("cookiePath",void 0,"/");
  var je = it("cookieExpires",void 0,63072e3);
  var Oe = it("legacyCookieDomain");
  var Se = it("legacyHistoryImport",void 0,true);
  var Ce = it("storage",void 0,"cookie");
  var Ae = it("allowLinker",void 0,false);
  var Te = it("allowAnchor",void 0,true);
  var Le = it("sampleRate","sf",100);
  var Ee = it("siteSpeedSampleRate",void 0,1);
  var Ie = it("alwaysSendReferrer",void 0,false);
  var Pe = et("transportUrl");
  var Ve = et("_r","_r");
  function Me(t,e,i,r){e[t] = function(){try{
    if (r) {
      n(r);
    }

    return i.apply(this,arguments);
  }catch(e){throw (P("exc",t,e&&e.name), e)}};}

  var Ne = function(t,e,n){
    this.V = 1e4;
    this.fa = t;
    this.$ = false;
    this.B = e;
    this.ea = n||1;
  };

  var De = function(t,e){
    var n;if (t.fa&&t.$) {
      return 0;
    }
    t.$ = true;
    if(e){if (t.B&&Z(e,t.B)) {
      return Z(e,t.B);
    }if (0==e.get(Ee)) {
      return 0
    }}return 0==t.V?0:(void 0===n&&(n=z()),0==n%t.V?Math.floor(n/t.V)%t.ea+1:0)
  };

  var Re = new Ne(true,st,7);

  var Fe = function(t,e){var n=Math.min(Z(t,Ee),100);if(!(Pn(Y(t,we))%100>=n)&&(He(n={})||$e(n))){
    var i=n[Vt];

    if (!(void 0==i||1/0==i || isNaN(i))) {
      if (0<i) {
        Ge(n,Nt);
        Ge(n,Ft);
        Ge(n,Rt);
        Ge(n,Mt);
        Ge(n,Dt);
        Ge(n,Ht);
        Ge(n,$t);
        e(n);
      } else {
        v(y,"load",function(){Fe(t,e)},false);
      }
    }
  }};

  var He = function(t){var e;if (!(e=(e=y.performance||y.webkitPerformance)&&e.timing)) {
    return false;
  }var n=e.navigationStart;return 0!=n&&(t[Vt]=e.loadEventStart-n,t[Nt]=e.domainLookupEnd-e.domainLookupStart,t[Ft]=e.connectEnd-e.connectStart,t[Rt]=e.responseStart-e.requestStart,t[Mt]=e.responseEnd-e.responseStart,t[Dt]=e.fetchStart-n,t[Ht]=e.domInteractive-n,t[$t]=e.domContentLoadedEventStart-n,true);};

  var $e = function(t){
    if (y.top!=y) {
      return false;
    }
    var e = y.external;
    var n = e&&e.onloadT;

    if (e&&!e.isValidLoadTime) {
      n = void 0;
    }

    if (2147483648<n) {
      n = void 0;
    }

    if (0<n) {
      e.setPageReadyTime();
    }

    return void 0!=n&&(t[Vt]=n,true);
  };

  var Ge = function(t,e){
    var n=t[e];

    if ((isNaN(n)||1/0==n || 0>n)) {
      t[e] = void 0;
    }
  };

  var Ue = false;

  var Be = function(t){if("cookie"==Y(t,Ce)){
    var e = Y(t,ke);
    var i = Xe(t);
    var r = Ze(Y(t,xe));
    var a = Ke(Y(t,_e));
    var o = 1e3*Z(t,je);
    var s = Y(t,ye);
    if ("auto"!=a) {
      if (j(e,i,r,a,s,o)) {
        Ue = true;
      }
    } else {
      var c;
      n(32);
      i = [];
      if (4!=(a=m().split(".")).length||(c=a[a.length-1],parseInt(c,10)!=c)) {
        for (c=a.length-2; 0<=c; c--) {
          i.push(a.slice(c).join("."));
        }
        i.push("none");
        c = i;
      } else {
        c = ["none"];
      }for (var u=0; u<c.length; u++) {
        a = c[u];
        t.data.set(_e,a);
        i = Xe(t);
        if (j(e,i,r,a,s,o)) {
          Ue = true;
          return;
        }
      }t.data.set(_e,"auto")
    }
  }};

  var ze = function(t){if ("cookie"==Y(t,Ce)&&!Ue&&(Be(t),!Ue)) {
    throw"abort"
  }};

  var qe = function(t){if(t.get(Se)){
    var e = Y(t,_e);
    var i = Y(t,Oe)||m();
    var r = Qe("__utma",i,e);

    if (r) {
      n(19);
      t.set(Yt,(new Date).getTime(),true);
      t.set(Wt,r.R);

      if ((e=Qe("__utmz",i,e))&&r.hash==e.hash) {
        t.set(Kt,e.R);
      }
    }
  }};

  var Xe = function(t){
    var e = O(Y(t,we));
    var n = Ye(Y(t,_e));

    if (1<(t=Je(Y(t,xe)))) {
      n += "-"+t;
    }

    return ["GA1",n,e].join(".");
  };

  var We = function(t,e,n){for(var i,r=[],a=[],o=0;o<t.length;o++){
    var s=t[o];

    if (s.H[n]==e) {
      r.push(s);
    } else {
      if (void 0==i||s.H[n]<i) {
        a = [s];
        i = s.H[n];
      } else {
        if (s.H[n]==i) {
          a.push(s);
        }
      }
    }
  }return 0<r.length?r:a};

  var Ke = function(t){return 0==t.indexOf(".")?t.substr(1):t};
  var Ye = function(t){return Ke(t).split(".").length};
  var Ze = function(t){return t?(1<t.length&&t.lastIndexOf("/")==t.length-1&&(t=t.substr(0,t.length-1)),0!=t.indexOf("/")&&(t="/"+t),t):"/"};
  var Je = function(t){return"/"==(t=Ze(t))?1:t.split("/").length};
  function Qe(t,e,n){
    if ("none"==e) {
      e = "";
    }

    var i = [];
    var r = x(t);
    t = "__utma"==t?6:2;
    for(var a=0;a<r.length;a++){
      var o=(""+r[a]).split(".");

      if (o.length>=t) {
        i.push({hash:o[0],R:r[a],O:o});
      }
    }return 0==i.length?void 0:1==i.length?i[0]:tn(e,i)||tn(n,i)||tn(null,i)||i[0]
  }function tn(t,e){
    var n;
    var i;

    if (null==t) {
      n = i=1;
    } else {
      n = Pn(t);
      i = Pn(u(t,".")?t.substring(1):"."+t);
    }

    for (var r=0; r<e.length; r++) {
      if (e[r].hash==n||e[r].hash==i) {
        return e[r]
      }
    }
  }
  var en = new RegExp(/^https?:\/\/([^\/:]+)/);
  var nn = /(.*)([?&#])(?:_ga=[^&#]*)(?:&?)(.*)/;
  function rn(t,e){for (var n=new Date,i=(r=y.navigator).plugins||[],r=(n=[t,r.userAgent,n.getTimezoneOffset(),n.getYear(),n.getDate(),n.getHours(),n.getMinutes()+e],0); r<i.length; ++r) {
    n.push(i[r].description);
  }return Pn(n.join("."))}var an=function(t){
    n(48);
    this.target = t;
    this.T = false;
  };

  an.prototype.ca = function(t,e){if(t.tagName){if ("a"==t.tagName.toLowerCase()) {
    if (t.href) {
      t.href = on(this,t.href,e);
    }

    return;
  }if ("form"==t.tagName.toLowerCase()) {
    return sn(this,t)
  }}if ("string"==typeof t) {
    return on(this,t,e)
  }};

  var on = function(t,e,n){
    if ((r=nn.exec(e))&&3<=r.length) {
      e = r[1]+(r[3]?r[2]+r[3]:"");
    }

    t = t.target.get("linkerParam");
    var i = e.indexOf("?");
    var r = e.indexOf("#");

    if (n) {
      e += (-1==r?"#":"&")+t;
    } else {
      n = -1==i?"?":"&";
      e = -1==r?e+(n+t):e.substring(0,r)+n+t+e.substring(r);
    }

    return e.replace(/&+_ga=/,"&_ga=");
  };

  var sn = function(t,e){if(e&&e.action){var n=t.target.get("linkerParam").split("=")[1];if ("get"==e.method.toLowerCase()) {
    for (var i=e.childNodes||[],r=0; r<i.length; r++) {
      if ("_ga"==i[r].name) {
        i[r].setAttribute("value",n);
        return;
      }
    }
    (i=k.createElement("input")).setAttribute("type","hidden");
    i.setAttribute("name","_ga");
    i.setAttribute("value",n);
    e.appendChild(i);
  } else {
    if ("post"==e.method.toLowerCase()) {
      e.action = on(t,e.action);
    }
  }}};

  function cn(t,e){if (e==k.location.hostname) {
    return false;
  }for (var n=0; n<t.length; n++) {
    if (t[n]instanceof RegExp) {if (t[n].test(e)) {
      return true;
    }} else {
      if (0<=e.indexOf(t[n])) {
        return true;
      }
    }
  }return false;}

  an.prototype.S = function(t,e,i){
    function r(i){try{
      var r;
      i = i||y.event;
      t:{var o=i.target||i.srcElement;for(i=100;o&&0<i;){
        if(o.href&&o.nodeName.match(/^a(?:rea)?$/i)){r = o;break t}
        o = o.parentNode;
        i--;
      }r = {};}

      if (("http:"==r.protocol||"https:"==r.protocol)&&cn(t,r.hostname||"")&&r.href) {
        r.href = on(a,r.href,e);
      }
    }catch(t){n(26)}}var a=this;

    if (!this.T) {
      this.T = true;
      v(k,"mousedown",r,false);
      v(k,"keyup",r,false);
    }

    if(i){i = function(e){if((e=(e=e||y.event).target||e.srcElement)&&e.action){
      var n=e.action.match(en);

      if (n&&cn(t,n[1])) {
        sn(a,e);
      }
    }};for (var o=0; o<k.forms.length; o++) {
      v(k.forms[o],"submit",i)
    }}
  };

  var un;

  var hn = function(t,e,n){
    this.U = ne;
    this.aa = e;

    if (!(e = n)) {
      e = (e=Y(t,me))&&"t0"!=e?vn.test(e)?"_gat_"+O(Y(t,ye)):"_gat_"+O(e):"_gat";
    }

    this.Y = e;
  };

  var ln = function(t,e){
    if (!e.get(t.U)) {
      if ("1"==x(t.Y)[0]) {
        e.set(t.U,"",true);
      } else {
        e.set(t.U,""+B(),true);
      }
    }
  };

  var fn = function(t,e){
    if (e.get(t.U)) {
      j(t.Y,"1",e.get(xe),e.get(_e),e.get(ye),6e5);
    }
  };

  var gn = function(t,e){if(e.get(t.U)){
    var n = new b;

    var i = function(t){
      if (tt(t).F) {
        n.set(tt(t).F,e.get(t));
      }
    };

    i(ct);
    i(ut);
    i(ye);
    i(we);
    i(be);
    i(t.U);
    n.set(tt(te).F,r(e));
    var a=t.aa;

    n.map(function(t,e){
      a += g(t)+"=";
      a += g(""+e)+"&";
    });

    a += "z="+B();
    l(a);
    e.set(t.U,"",true);
  }};

  var vn = /^gtm\d+$/;

  var pn = function(t,e){
    var n;
    var r = t.b;

    if (!r.get("dcLoaded")) {
      i(r,29);

      if ((e=e||{})[ke]) {
        n = O(e[ke]);
      }

      (function(t, e) {var n=e.get(le);e.set(le,function(e){
        ln(t,e);var i=n(e);
        fn(t,e);
        return i;
      });var i=e.get(fe);e.set(fe,function(e){
        var n=i(e);
        gn(t,e);
        return n;
      })})(n=new hn(r,"https://stats.g.doubleclick.net/r/collect?t=dc&aip=1&_r=3&",n),r);

      r.set("dcLoaded",true);
    }
  };

  var dn = function(t){if(!t.get("dcLoaded")&&"cookie"==t.get(Ce)){
    i(t,51);var e=new hn(t);
    ln(e,t);
    fn(e,t);

    if (t.get(e.U)) {
      t.set(Ve,1,true);
      t.set(Pe,A()+"/r/collect",true);
    }
  }};

  var mn = /^(UA|YT|MO|GP)-(\d+)-(\d+)$/;

  var wn = function(t){
    function e(t,e){i.b.data.set(t,e)}function n(t,n){
      e(t,n);
      i.filters.add(t);
    }var i=this;
    this.b = new X;
    this.filters = new V;
    e(me,t[me]);
    e(ye,h(t[ye]));
    e(ke,t[ke]);
    e(_e,t[_e]||m());
    e(xe,t[xe]);
    e(je,t[je]);
    e(Oe,t[Oe]);
    e(Se,t[Se]);
    e(Ae,t[Ae]);
    e(Te,t[Te]);
    e(Le,t[Le]);
    e(Ee,t[Ee]);
    e(Ie,t[Ie]);
    e(Ce,t[Ce]);
    e(be,t[be]);
    e(ct,1);
    e(ut,"j41");
    n(ie,N);
    n(re,$);
    n(ae,D);
    n(oe,U);
    n(se,ze);
    n(ce,qe);
    n(ue,M);
    n(he,q);
    n(ge,H);
    n(ve,G);
    n(de,dn);
    n(le,R);
    n(fe,F);

    n(pe,function(t){return function(e){
      if (!("pageview"!=e.get(lt) || t.I)) {
        t.I = true;
        Fe(e,function(e){t.send("timing",e)});
      }
    };}(this));

    bn(this.b,t[we]);
    yn(this.b);
    this.b.set(ht,function(){var t=y.gaGlobal=y.gaGlobal||{};return t.hid=t.hid||B()}());

    (function(t, e, n) {if(!un){
      var i;
      i = k.location.hash;
      var r = y.name;
      var a = /^#?gaso=([^&]*)/;

      if ((r = (i=(i=i&&i.match(a)||r&&r.match(a))?i[1]:x("GASO")[0]||"")&&i.match(/^(?:!([-0-9a-z.]{1,40})!)?([-.\w]{10,1200})$/i))) {
        j("GASO",""+i,n,e,t,0);

        if (!window._udo) {
          window._udo = e;
        }

        if (!window._utcp) {
          window._utcp = n;
        }

        t = r[1];
        p("https://www.google.com/analytics/web/inpage/pub/inpage.js?"+(t?"prefix="+t+"&":"")+B(),"_gasojs");
      }

      un = true;
    }})(this.b.get(ye),this.b.get(_e),this.b.get(xe));
  };

  var bn = function(t,e){
    if("cookie"==Y(t,Ce)){
      var i;
      Ue = false;
      t:{var r=x(Y(t,ke));if(r&&!(1>r.length)){i = [];for(var a=0;a<r.length;a++){
        var o;
        var s = (o=r[a].split(".")).shift();

        if (("GA1"==s||"1"==s)&&1<o.length) {
          if (1==(s=o.shift().split("-")).length) {
            s[1] = "1";
          }

          s[0] *= 1;
          s[1] *= 1;
          o = {H:s,s:o.join(".")};
        } else {
          o = void 0;
        }

        if (o) {
          i.push(o);
        }
      }if(1==i.length){
        n(13);
        i = i[0].s;
        break t
      }if(0!=i.length){
        n(14);
        r = Ye(Y(t,_e));
        if(1==(i=We(i,r,0)).length){i = i[0].s;break t}
        r = Je(Y(t,xe));
        i = (i=We(i,r,1))[0]&&i[0].s;
        break t
      }n(12)}i = void 0;}

      if (!i) {
        i = Y(t,_e);

        if (void 0!=(i=Qe("__utma",r=Y(t,Oe)||m(),i))) {
          n(10);
          i = i.O[1]+"."+i.O[2];
        } else {
          i = void 0;
        }
      }

      if (i) {
        t.data.set(we,i);
        Ue = true;
      }
    }
    i = t.get(Te);

    if ((a = (i=k.location[i?"href":"search"].match("(?:&|#|\\?)"+g("_ga").replace(/([.*+?^=!:${}()|\[\]\/\\])/g,"\\$1")+"=([^&#]*)"))&&2==i.length?i[1]:"")) {
      if (t.get(Ae)) {
        if (-1==(i=a.indexOf("."))) {
          n(22);
        } else {
          r = a.substring(i+1);

          if ("1"!=a.substring(0,i)) {
            n(22);
          } else {
            if (-1==(i=r.indexOf("."))) {
              n(22);
            } else {
              if ((a=r.substring(0,i))!=rn(i=r.substring(i+1),0)&&a!=rn(i,-1)&&a!=rn(i,-2)) {
                n(23);
              } else {
                n(11);
                t.data.set(we,i);
              }
            }
          }
        }
      } else {
        n(21);
      }
    }

    if (e) {
      n(9);
      t.data.set(we,g(e));
    }

    if (!t.get(we)) {
      if (i=(i=y.gaGlobal&&y.gaGlobal.vid)&&-1!=i.search(/^(?:utma\.)?\d+\.\d+$/)?i:void 0) {
        n(17);
        t.data.set(we,i);
      } else {for (n(8),r=(i=y.navigator.userAgent+(k.cookie?k.cookie:"")+(k.referrer?k.referrer:"")).length,a=y.history.length; 0<a; ) {
        i += a--^r++;
      }t.data.set(we,[B()^2147483647&Pn(i),Math.round((new Date).getTime()/1e3)].join("."))}
    }Be(t)
  };

  var yn = function(t){
    var e = y.navigator;
    var i = y.screen;
    var r = k.location;

    t.set(wt,function(t){var e=k.referrer;if(/^https?:\/\//i.test(e)){if (t) {
      return e;
    }t = "//"+k.location.hostname;var n=e.indexOf(t);if (!(5!=n&&6!=n||"/"!=(t=e.charAt(n+t.length))&&"?"!=t&&""!=t&&":"!=t)) {
      return;
    }return e}}(t.get(Ie)));

    if(r){
      var a=r.pathname||"";

      if ("/"!=a.charAt(0)) {
        n(31);
        a = "/"+a;
      }

      t.set(mt,r.protocol+"//"+r.hostname+a+r.search);
    }

    if (i) {
      t.set(xt,i.width+"x"+i.height);
    }

    if (i) {
      t.set(_t,i.colorDepth+"-bit");
    }

    i = k.documentElement;
    var o = (a=k.body)&&a.clientWidth&&a.clientHeight;
    var s = [];

    if (i&&i.clientWidth&&i.clientHeight&&("CSS1Compat"===k.compatMode||!o)) {
      s = [i.clientWidth,i.clientHeight];
    } else {
      if (o) {
        s = [a.clientWidth,a.clientHeight];
      }
    }

    i = 0>=s[0]||0>=s[1]?"":s.join("x");
    t.set(jt,i);

    t.set(St,function(){
      var t;
      var e;
      var n;
      if ((n=(n=y.navigator)?n.plugins:null)&&n.length) {
        for(var i=0;i<n.length&&!e;i++){
          var r=n[i];

          if (-1<r.name.indexOf("Shockwave Flash")) {
            e = r.description;
          }
        }
      }if (!e) {
        try{e = (t=new ActiveXObject("ShockwaveFlash.ShockwaveFlash.7")).GetVariable("$version");}catch(t){}
      }if (!e) {
        try{
          t = new ActiveXObject("ShockwaveFlash.ShockwaveFlash.6");
          e = "WIN 6,0,21,0";
          t.AllowScriptAccess = "always";
          e = t.GetVariable("$version");
        }catch(t){}
      }if (!e) {
        try{e = (t=new ActiveXObject("ShockwaveFlash.ShockwaveFlash")).GetVariable("$version");}catch(t){}
      }

      if (e&&(t=e.match(/[\d]+/g))&&3<=t.length) {
        e = t[0]+"."+t[1]+" r"+t[2];
      }

      return e||void 0;
    }());

    t.set(kt,k.characterSet||k.charset);
    t.set(Ot,e&&"function"==typeof e.javaEnabled&&e.javaEnabled()||false);
    t.set(yt,(e&&(e.language||e.browserLanguage)||"").toLowerCase());
    if(r&&t.get(Te)&&(e=k.location.hash)){
      for (e=e.split(/[?&#]+/),r=[],i=0; i<e.length; ++i) {
        if ((u(e[i],"utm_id")||u(e[i],"utm_campaign")||u(e[i],"utm_source")||u(e[i],"utm_medium")||u(e[i],"utm_term")||u(e[i],"utm_content")||u(e[i],"gclid")||u(e[i],"dclid") || u(e[i],"gclsrc"))) {
          r.push(e[i]);
        }
      }

      if (0<r.length) {
        e = "#"+r.join("&");
        t.set(mt,t.get(mt)+e);
      }
    }
  };

  wn.prototype.get = function(t){return this.b.get(t)};
  wn.prototype.set = function(t,e){this.b.set(t,e)};
  var kn={pageview:[bt],event:[Ct,At,Tt,Lt],social:[Et,It,Pt],timing:[Gt,Ut,zt,Bt]};

  wn.prototype.send = function(t){
    var e;
    var n;

    if (!(1 > arguments.length)) {
      if ("string"==typeof arguments[0]) {
        e = arguments[0];
        n = [].slice.call(arguments,1);
      } else {
        e = arguments[0]&&arguments[0][lt];
        n = arguments;
      }

      if (e) {
        (n=w(kn[e]||[],n))[lt] = e;
        this.b.set(n,void 0,true);
        this.filters.D(this.b);
        this.b.data.m = {};

        (function(t) {if(!d()&&!ot){var e=De(Re,t);if(e&&!(!y.navigator.sendBeacon&&4<=e&&6>=e)){
          var n = (new Date).getHours();
          var i = [z(),z(),z()].join(".");
          t = (3==e||5==e?"https:":"http:")+"//www.google-analytics.com/collect?z=br.";
          t += [e,"A",n,i].join(".");
          var r=(r=(r=1!=e%3?"https:":"http:")+"//www.google-analytics.com/collect?z=br.")+[e,"B",n,i].join(".");

          if (7==e) {
            r = r.replace("//www.","//ssl.");
          }

          n = function(){
            if (4<=e&&6>=e) {
              y.navigator.sendBeacon(r,"");
            } else {
              l(r);
            }
          };

          if (z()%2) {
            l(t);
            n();
          } else {
            n();
            l(t);
          }
        }}})(this.b);
      }
    }
  };

  var _n;
  var xn;
  var jn;
  var On = function(t){return "prerender"!=k.visibilityState&&(t(),true);};
  var Sn = /^(?:(\w+)\.)?(?:(\w+):)?(\w+)$/;

  var Cn = function(t){if (o(t[0])) {
    this.u = t[0];
  } else {
    var e=Sn.exec(t[0]);

    if (null!=e&&4==e.length) {
      this.c = e[1]||"t0";
      this.K = e[2]||"";
      this.C = e[3];
      this.a = [].slice.call(t,1);

      if (!this.K) {
        this.A = "create"==this.C;
        this.i = "require"==this.C;
        this.g = "provide"==this.C;
        this.ba = "remove"==this.C;
      }

      if (this.i) {
        if (3<=this.a.length) {
          this.X = this.a[1];
          this.W = this.a[2];
        } else {
          if (this.a[1]) {
            if (c(this.a[1])) {
              this.X = this.a[1];
            } else {
              this.W = this.a[1];
            }
          }
        }
      }
    }

    e = t[1];
    t = t[2];
    if (!this.C) {
      throw"abort";
    }if (this.i&&(!c(e)||""==e)) {
      throw"abort";
    }if (this.g&&(!c(e)||""==e||!o(t))) {
      throw"abort";
    }if (An(this.c)||An(this.K)) {
      throw"abort";
    }if (this.g&&"t0"!=this.c) {
      throw"abort"
    }
  }};

  function An(t){return 0<=t.indexOf(".")||0<=t.indexOf(":")}
  _n = new b;
  jn = new b;
  xn = {ec:45,ecommerce:46,linkid:47};

  var Tn = function(t){
    function e(t){
      var e = (t.hostname||"").split(":")[0].toLowerCase();
      var n = (t.protocol||"").toLowerCase();
      n = 1*t.port||("http:"==n?80:"https:"==n?443:"");
      t = t.pathname||"";

      if (!u(t,"/")) {
        t = "/"+t;
      }

      return [e,""+n,t];
    }var n=k.createElement("a");
    n.href = k.location.href;
    var i = (n.protocol||"").toLowerCase();
    var r = e(n);
    var a = n.search||"";
    var o = i+"//"+r[0]+(r[1]?":"+r[1]:"");

    if (u(t,"//")) {
      t = i+t;
    } else {
      if (u(t,"/")) {
        t = o+t;
      } else {
        if (!t||u(t,"?")) {
          t = o+r[2]+(t||a);
        } else {
          if (0>t.split("/")[0].indexOf(":")) {
            t = o+r[2].substring(0,r[2].lastIndexOf("/"))+"/"+t;
          }
        }
      }
    }

    n.href = t;
    i = e(n);
    return {protocol:(n.protocol||"").toLowerCase(),host:i[0],port:i[1],path:i[2],query:n.search||"",url:t||""};
  };

  var Ln = {ga:function(){Ln.f = [];}};
  Ln.ga();

  Ln.D = function(t){var e=Ln.J.apply(Ln,arguments);e = Ln.f.concat(e);for (Ln.f=[]; 0<e.length&&!Ln.v(e[0])&&(e.shift(),!(0<Ln.f.length)); )
    {}Ln.f = Ln.f.concat(e);};

  Ln.J = function(t){for (var e=[],i=0; i<arguments.length; i++) {
    try{var r=new Cn(arguments[i]);if (r.g) {
      _n.set(r.a[0],r.a[1]);
    } else {if(r.i){var a=(l=r).a[0];if(!o(_n.get(a))&&!jn.get(a)){
      if (xn.hasOwnProperty(a)) {
        n(xn[a]);
      }

      var s=l.X;

      if (!s&&xn.hasOwnProperty(a)) {
        n(39);
        s = a+".js";
      } else {
        n(43);
      }

      if(s){
        if (!(s && 0<=s.indexOf("/"))) {
          s = (ot||d()?"https:":"http:")+"//www.google-analytics.com/plugins/ua/"+s;
        }

        var c;
        var h = Tn(s);
        var l = void 0;
        var f = h.protocol;
        var g = k.location.protocol;
        if(c=l="https:"==f||f==g||"http:"==f&&"http:"==g){l = h;var v=Tn(k.location.href);if (l.query||0<=l.url.indexOf("?")||0<=l.path.indexOf("://")) {
          c = false;
        } else {
          if (l.host==v.host&&l.port==v.port) {
            c = true;
          } else
            {var m="http:"==l.protocol?80:443;c = !("www.google-analytics.com"!=l.host||(l.port||m)!=m||!u(l.path,"/plugins/"));}
        }}

        if (c) {
          p(h.url);
          jn.set(a,true);
        }
      }
    }}e.push(r)}}catch(t){}
  }return e};

  Ln.v = function(t){try{if (t.u) {
    t.u.call(y,En.j("t0"));
  } else {var e=t.c==at?En:En.j(t.c);if (t.A) {
    if ("t0"==t.c) {
      En.create.apply(En,t.a);
    }
  } else {
    if (t.ba) {
      En.remove(t.c);
    } else {
      if (e) {
        if (t.i) {
          var n;
          var i = t.a[0];
          var r = t.W;

          if (!(e == En)) {
            e.get(me);
          }

          var a=_n.get(i);

          if (o(a)) {
            e.plugins_ = e.plugins_||new b;

            if (!e.plugins_.get(i)) {
              e.plugins_.set(i,new a(e,r||{}));
            }

            n = true;
          } else {
            n = false;
          }

          if (!n) {
            return true;
          }
        } else {
          if (t.K) {
            var s = t.C;
            var c = t.a;
            var u = e.plugins_.get(t.K);
            u[s].apply(u,c)
          } else {
            e[t.C].apply(e,t.a)
          }
        }
      }
    }
  }}}catch(t){}};

  var En=function(t){
    n(1);
    Ln.D.apply(Ln,[arguments]);
  };
  En.h = {};
  En.P = [];
  En.L = 0;
  En.answer = 42;
  var In=[ye,_e,me];function Pn(t){
    var e;
    var n = 1;
    var i = 0;
    if (t) {
      for (n=0,e=t.length-1; 0<=e; e--) {
        n = 0!=(i=266338304&(n=(n<<6&268435455)+(i=t.charCodeAt(e))+(i<<14)))?n^i>>21:n;
      }
    }return n
  }

  En.create = function(t){
    var e=w(In,[].slice.call(arguments));

    if (!e[me]) {
      e[me] = "t0";
    }

    var n=""+e[me];return En.h[n]?En.h[n]:(e=new wn(e),En.h[n]=e,En.P.push(e),e)
  };

  En.remove = function(t){for (var e=0; e<En.P.length; e++) {
    if(En.P[e].get(me)==t){
      En.P.splice(e,1);
      En.h[t] = null;
      break
    }
  }};

  En.j = function(t){return En.h[t]};
  En.getAll = function(){return En.P.slice(0)};

  En.N = function(){
    if ("ga"!=at) {
      n(49);
    }

    var t=y[at];if(!t||42!=t.answer){
      En.L = t&&t.l;
      En.loaded = true;
      Me("create",e=y[at]=En,e.create);
      Me("remove",e,e.remove);
      Me("getByName",e,e.j,5);
      Me("getAll",e,e.getAll,6);
      Me("get",e=wn.prototype,e.get,7);
      Me("set",e,e.set,4);
      Me("send",e,e.send);
      Me("get",e=X.prototype,e.get);
      Me("set",e,e.set);
      if(!d()&&!ot){
        t:{for(var e=k.getElementsByTagName("script"),i=0;i<e.length&&100>i;i++){var r=e[i].src;if(r&&0==r.indexOf("https://www.google-analytics.com/analytics")){
          n(33);
          e = true;
          break t
        }}e = false;}

        if (e) {
          ot = true;
        }
      }

      if (!(d()||ot || !De(new Ne))) {
        n(36);
        ot = true;
      }

      (y.gaplugins=y.gaplugins||{}).Linker = an;
      e = an.prototype;
      _n.set("linker",an);
      Me("decorate",e,e.ca,20);
      Me("autoLink",e,e.S,25);
      _n.set("displayfeatures",pn);
      _n.set("adfeatures",pn);
      t = t&&t.q;

      if (s(t)) {
        Ln.D.apply(En,t);
      } else {
        n(50);
      }
    }
  };

  En.da = function(){for (var t=En.getAll(),e=0; e<t.length; e++) {
    t[e].get(me)
  }};

  (function() {var t=En.N;if(!On(t)){
    n(16);
    var e = false;

    var i = function(){if(!e&&On(t)){
      e = true;
      var n = i;
      var r = k;

      if (r.removeEventListener) {
        r.removeEventListener("visibilitychange",n,false);
      } else {
        if (r.detachEvent) {
          r.detachEvent("onvisibilitychange",n);
        }
      }
    }};

    v(k,"visibilitychange",i)
  }})();
})(window);