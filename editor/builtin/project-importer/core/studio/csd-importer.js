"use strict";
const e = require("async");
const t = require("xmldom").DOMParser;
const r = require("fire-fs");
const o = require("fire-path");
const n = require("fire-url");
const i = require("./xml-utils");
const a = "db://internal/";
const d = "db://internal/image/default_sprite_splash.png/default_sprite_splash";
const l = "db://internal/particle/atom.plist";
const c = "db://internal/image/default_btn_normal.png/default_btn_normal";
const f = "db://internal/image/default_btn_pressed.png/default_btn_pressed";
const s = "db://internal/image/default_btn_disabled.png/default_btn_disabled";
const p = "db://internal/image/default_progressbar.png/default_progressbar";
const g = "db://internal/image/default_scrollbar_vertical.png/default_scrollbar_vertical";
const u = "db://internal/image/default_scrollbar.png/default_scrollbar";
const m = "db://internal/image/default_panel.png/default_panel";
const N = "_action";
const y = 60;
const v = /[\\\/]/g;

const h = {SpriteObjectData:function(e,t,r){Y(e,t,cc.Sprite.SizeMode.RAW,r)},ImageViewObjectData:function(t,r,o){e.waterfall([function(e){Y(t,r,cc.Sprite.SizeMode.CUSTOM,e)},function(e){
  var o=t.getComponent(cc.Sprite);if (!o) {
    e();
    return;
  }var n=i.getBoolPropertyOfNode(r,"Scale9Enable",false);

  if (n&&o.spriteFrame) {
    o.type = cc.Sprite.Type.SLICED;
    W(r,o.spriteFrame._uuid,e);
  } else {
    e();
  }
}],o)},ParticleObjectData:function(e,t,r){var o=e.addComponent(cc.ParticleSystem);if (!o) {
  Editor.warn("Add ParticleSystem component for node %s failed.",t.getAttribute("Name"));
  r();
  return;
}var a="";switch(i.getPropertyOfNode(t,"Type","Default","FileData")){case"Normal":var d=i.getPropertyOfNode(t,"Path","","FileData");a = n.join(B,d);break;case"Default":default:a = l;}if(a){
  var c=Editor.assetdb.remote.urlToUuid(a);

  if (Editor.assetdb.remote.existsByUuid(c)) {
    o.file = Editor.assetdb.remote._fspath(a);
    o.custom = false;
  }
}r()},GameMapObjectData:function(e,t,r){var o=e.addComponent(cc.TiledMap);if (!o) {
  Editor.warn("Add TiledMap component for node %s failed.",t.getAttribute("Name"));
  r();
  return;
}var a="";switch(i.getPropertyOfNode(t,"Type","Default","FileData")){case"Normal":var d=i.getPropertyOfNode(t,"Path","","FileData");a = n.join(B,d);}if(a){
  var l=Editor.assetdb.remote.urlToUuid(a);

  if (Editor.assetdb.remote.existsByUuid(l)) {
    o.tmxFile = Editor.assetdb.remote._fspath(a);
  }
}r()},SimpleAudioObjectData:function(e,t,r){var o=e.addComponent(cc.AudioSource);if (!o) {
  Editor.warn("Add AudioSource component for node %s failed.",t.getAttribute("Name"));
  r();
  return;
}var a="";switch(i.getPropertyOfNode(t,"Type","Default","FileData")){case"Normal":var d=i.getPropertyOfNode(t,"Path","","FileData");a = n.join(B,d);}if(a){
  var l=Editor.assetdb.remote.urlToUuid(a);

  if (Editor.assetdb.remote.existsByUuid(l)) {
    o.clip = Editor.assetdb.remote._fspath(a);
  }
}r()},ButtonObjectData:function(t,r,o){
  var n = t.addComponent(cc.Button);
  var a = t.addComponent(cc.Sprite);
  if (!n) {
    Editor.warn("Add Button component for node %s failed.",r.getAttribute("Name"));
    o();
    return;
  }
  a.sizeMode = cc.Sprite.SizeMode.CUSTOM;
  a.trim = false;
  var d=i.getBoolPropertyOfNode(r,"Scale9Enable",false);

  if (d) {
    a.type = cc.Sprite.Type.SLICED;
  }

  n.interactable = i.getBoolPropertyOfNode(r,"DisplayState",true);
  n.transition = cc.Button.Transition.SPRITE;
  var l=i.getFirstChildNodeByName(r,"NormalFileData");
  a.spriteFrame = X(l,c);
  n.normalSprite = X(l,c);
  n.hoverSprite = X(l,c);
  var p=i.getFirstChildNodeByName(r,"PressedFileData");
  n.pressedSprite = X(p,f);
  var g=i.getFirstChildNodeByName(r,"DisabledFileData");
  n.disabledSprite = X(g,s);
  var u=i.getPropertyOfNode(r,"ButtonText","");if(u){
    var m=new cc.Node("Label");
    m.setContentSize(t.getContentSize());
    t.addChild(m);
    var N = m.addComponent(cc.Label);
    var y = i.getIntPropertyOfNode(r,"FontSize",14);
    var v = new cc.Color(i.getIntPropertyOfNode(r,"R",65,"TextColor"),i.getIntPropertyOfNode(r,"G",65,"TextColor"),i.getIntPropertyOfNode(r,"B",70,"TextColor"));
    var h = i.getIntPropertyOfNode(r,"A",255,"TextColor");
    m.color = v;
    m.opacity = h;
    N.string = u;
    N._fontSize = y;
    N.horizontalAlign = cc.Label.HorizontalAlign.CENTER;
    N.verticalAlign = cc.Label.VerticalAlign.CENTER;
    var P=m.addComponent(cc.StudioWidget);
    P.isAlignVerticalCenter = true;
    P.isAlignHorizontalCenter = true;
    var C=i.getFirstChildNodeByName(r,"FontResource");

    if (C) {
      Z(N,C);
    }
  }if (d) {for(var O=[n.normalSprite,n.pressedSprite,n.disabledSprite],S=[],b=0,F=O.length;b<F;b++){
    var A=O[b];

    if (A) {
      if (S.indexOf(A._uuid)<0) {
        S.push(A._uuid);
      }
    }
  }if (0===S.length) {
    o();
    return;
  }var B=0;e.whilst(function(e){e(null,B<S.length)},function(e){W(r,S[B],function(){
    B++;
    e();
  })},function(){o()})} else {
    o()
  }
},TextBMFontObjectData:G,TextObjectData:G,LoadingBarObjectData:function(e,t,r){
  var o = e.addComponent(cc.Sprite);
  var n = e.addComponent(cc.ProgressBar);
  if (!n) {
    Editor.warn("Add ProgressBar component for node %s failed.",t.getAttribute("Name"));
    r();
    return;
  }
  n.mode = cc.ProgressBar.Mode.FILLED;
  var a=i.getPropertyOfNode(t,"ProgressType","");
  n.reverse = "Right_To_Left"===a;
  o.sizeMode = cc.Sprite.SizeMode.CUSTOM;
  o.trim = false;
  var d=i.getFirstChildNodeByName(t,"ImageFileData");
  o.spriteFrame = X(d,p);
  o.type = cc.Sprite.Type.FILLED;
  o.fillType = cc.Sprite.FillType.HORIZONTAL;
  o.fillStart = n.reverse?1:0;
  n.barSprite = o;
  n.totalLength = 1;
  var l=i.getIntPropertyOfNode(t,"ProgressInfo",80);
  n.progress = l/100;
  r();
},TextFieldObjectData:function(e,t,r){
  var o=e.addComponent(cc.EditBox);if (!o) {
    Editor.warn("Add EditBox component for node %s failed.",t.getAttribute("Name"));
    r();
    return;
  }
  o._useOriginalSize = false;
  o.lineHeight = 0;
  o.placeholder = i.getPropertyOfNode(t,"PlaceHolderText","");
  o.string = i.getPropertyOfNode(t,"LabelText","");
  o.fontColor = new cc.Color(i.getIntPropertyOfNode(t,"R",255,"CColor"),i.getIntPropertyOfNode(t,"G",255,"CColor"),i.getIntPropertyOfNode(t,"B",255,"CColor"),i.getIntPropertyOfNode(t,"A",255,"CColor"));
  o.fontSize = i.getIntPropertyOfNode(t,"FontSize",20);

  if (i.getBoolPropertyOfNode(t,"MaxLengthEnable",false)) {
    o.maxLength = i.getIntPropertyOfNode(t,"MaxLengthText",10);
  } else {
    o.maxLength = -1;
  }

  if (i.getBoolPropertyOfNode(t,"PasswordEnable",false)) {
    o.inputFlag = cc.EditBox.InputFlag.PASSWORD;
    o.inputMode = cc.EditBox.InputMode.SINGLE_LINE;
  }

  r()
},PanelObjectData:J,CheckBoxObjectData:function(e,t,r){
  var o=e.addComponent(cc.StudioComponent);if (!o) {
    Editor.warn("Add StudioComponent component for node %s failed.",t.getAttribute("Name"));
    r();
    return;
  }
  o.type = cc.StudioComponent.ComponentType.CHECKBOX;
  var n=i.getFirstChildNodeByName(t,"NormalBackFileData");
  o.checkNormalBackFrame = X(n,"");
  var a=i.getFirstChildNodeByName(t,"PressedBackFileData");
  o.checkPressedBackFrame = X(a,"");
  var d=i.getFirstChildNodeByName(t,"DisableBackFileData");
  o.checkDisableBackFrame = X(d,"");
  var l=i.getFirstChildNodeByName(t,"NodeNormalFileData");
  o.checkNormalFrame = X(l,"");
  var c=i.getFirstChildNodeByName(t,"NodeDisableFileData");
  o.checkDisableFrame = X(c,"");
  o.checkInteractable = i.getBoolPropertyOfNode(t,"DisplayState",true);
  o.isChecked = i.getBoolPropertyOfNode(t,"CheckedState",false);
  r();
},TextAtlasObjectData:function(e,t,r){
  var o=e.addComponent(cc.StudioComponent);if (!o) {
    Editor.warn("Add StudioComponent component for node %s failed.",t.getAttribute("Name"));
    r();
    return;
  }
  o.type = cc.StudioComponent.ComponentType.TEXT_ATLAS;
  var n=i.getFirstChildNodeByName(t,"LabelAtlasFileImage_CNB");
  o.atlasFrame = X(n,"");
  o.firstChar = i.getPropertyOfNode(t,"StartChar",".");
  o.charWidth = i.getIntPropertyOfNode(t,"CharWidth",0);
  o.charHeight = i.getIntPropertyOfNode(t,"CharHeight",0);
  o.string = i.getPropertyOfNode(t,"LabelText","");
  r();
},SliderObjectData:function(e,t,r){
  var o=e.addComponent(cc.StudioComponent);if (!o) {
    Editor.warn("Add StudioComponent component for node %s failed.",t.getAttribute("Name"));
    r();
    return;
  }
  o.type = cc.StudioComponent.ComponentType.SLIDER_BAR;
  var n=i.getFirstChildNodeByName(t,"BackGroundData");
  o.sliderBackFrame = X(n,"");
  var a=i.getFirstChildNodeByName(t,"ProgressBarData");
  o.sliderBarFrame = X(a,"");
  var d=i.getFirstChildNodeByName(t,"BallNormalData");
  o.sliderBtnNormalFrame = X(d,"");
  var l=i.getFirstChildNodeByName(t,"BallPressedData");
  o.sliderBtnPressedFrame = X(l,"");
  var c=i.getFirstChildNodeByName(t,"BallDisabledData");
  o.sliderBtnDisabledFrame = X(c,"");
  o.sliderInteractable = i.getBoolPropertyOfNode(t,"DisplayState",true);
  var f=i.getIntPropertyOfNode(t,"PercentInfo",0);
  o.sliderProgress = f/100;
  r();
},ListViewObjectData:function(e,t,r){
  var o=e.addComponent(cc.StudioComponent);if (!o) {
    Editor.warn("Add StudioComponent component for node %s failed.",t.getAttribute("Name"));
    r();
    return;
  }
  o.type = cc.StudioComponent.ComponentType.LIST_VIEW;
  o.listInertia = i.getBoolPropertyOfNode(t,"IsBounceEnabled",false);
  if("Vertical"===i.getPropertyOfNode(t,"DirectionType","")){
    o.listDirection = cc.StudioComponent.ListDirection.VERTICAL;
    let e=i.getPropertyOfNode(t,"HorizontalType","Left");

    if (e.indexOf("Center")>=0) {
      o.listHorizontalAlign = cc.StudioComponent.HorizontalAlign.CENTER;
    } else {
      if (e.indexOf("Right")>=0) {
        o.listHorizontalAlign = cc.StudioComponent.HorizontalAlign.RIGHT;
      } else {
        o.listHorizontalAlign = cc.StudioComponent.HorizontalAlign.LEFT;
      }
    }
  }else{
    o.listDirection = cc.StudioComponent.ListDirection.HORIZONTAL;
    let e=i.getPropertyOfNode(t,"VerticalType","Top");

    if (e.indexOf("Center")>=0) {
      o.listVerticalAlign = cc.StudioComponent.VerticalAlign.CENTER;
    } else {
      if (e.indexOf("Bottom")>=0) {
        o.listVerticalAlign = cc.StudioComponent.VerticalAlign.BOTTOM;
      } else {
        o.listVerticalAlign = cc.StudioComponent.VerticalAlign.TOP;
      }
    }
  }
  o.listPadding = i.getIntPropertyOfNode(t,"ItemMargin",0);
  J(e,t,r);
},PageViewObjectData:function(e,t,r){
  var o=e.addComponent(cc.StudioComponent);if (!o) {
    Editor.warn("Add StudioComponent component for node %s failed.",t.getAttribute("Name"));
    r();
    return;
  }
  o.type = cc.StudioComponent.ComponentType.PAGE_VIEW;
  J(e,t,r);
}};

const P = {ProjectNodeObjectData:function(t,r){
  var a = i.getPropertyOfNode(t,"Path","","FileData");
  var d = o.join(E,a);
  var l = null;
  e.waterfall([function(e){w(d,e)},function(e){
    var t = function(e,t){
      var r = o.dirname(e);
      var i = o.relative(E,r);
      var a = o.basename(e,o.extname(e));
      return n.join(B,i,a+t)
    }(d,".prefab");

    var r = Editor.assetdb.remote.urlToUuid(t);
    if (!r) {
      e();
      return;
    }cc.assetManager.loadAny(r,function(t,r){
      if (t) {
        e();
      } else {
        l = cc.instantiate(r);
        e();
      }
    })
  }],function(){
    if (!l) {
      l = new cc.Node;
    }

    r(l);
  })
},ScrollViewObjectData:function(t,r){
  var o=new cc.Node(x(t.getAttribute("Name")));U(o,t);var n=o.addComponent(cc.ScrollView);if (!n) {
    Editor.warn("Add ScrollView component for node %s failed.",t.getAttribute("Name"));
    r(o);
    return;
  }
  n.inertia = i.getBoolPropertyOfNode(t,"IsBounceEnabled",false);
  var a=i.getPropertyOfNode(t,"ScrollDirectionType","Vertical");
  n.vertical = a.indexOf("Vertical")>=0;
  n.horizontal = a.indexOf("Horizontal")>=0;
  if(i.getBoolPropertyOfNode(t,"ClipAble",false)){var d=o.addComponent(cc.Mask);d.enabled = true;}
  var l = o.getContentSize().width;
  var c = o.getContentSize().height;
  var f = new cc.Node("content");
  var s = i.getIntPropertyOfNode(t,"Width",l,"InnerNodeSize");
  var p = i.getIntPropertyOfNode(t,"Height",c,"InnerNodeSize");
  f.setContentSize(s,p);
  f.setAnchorPoint(0,1);
  f.setPosition(0,c);

  e.waterfall([function(e){K(o,t,e)},function(e){
    o.addChild(f);
    f.setPosition(k(f));
    n.content = f;
    if(n.vertical){
      var t=Q(cc.Scrollbar.Direction.VERTICAL,"vScrollBar",o.getContentSize());
      o.addChild(t);
      n.verticalScrollBar = t.getComponent(cc.Scrollbar);
    }if(n.horizontal){
      var r=Q(cc.Scrollbar.Direction.HORIZONTAL,"hScrollBar",o.getContentSize());
      o.addChild(r);
      n.horizontalScrollBar = r.getComponent(cc.Scrollbar);
    }e()
  }],function(){r(f,o)});
}};

const C = ["GameLayerObjectData","GameNodeObjectData"];

const O = {AnchorPoint:function(e,t){
  t = j(t);
  for(var r=[],o=[],n=i.getAllChildren(e),a=0,d=n.length;a<d;a++){
    var l = n[a];
    var c = i.getIntPropertyOfNode(l,"FrameIndex",0);
    var f = i.getFloatPropertyOfNode(l,"X",0);
    var s = i.getFloatPropertyOfNode(l,"Y",0);
    var p = {frame:c,value:f};
    var g = {frame:c,value:s};
    var u = H(l);

    if (u) {
      p.curve = u;
      g.curve = u;
    }

    r.push(p);
    o.push(g);
  }
  t.props.anchorX = r;
  t.props.anchorY = o;
  return t;
},Position:function(e,t,r){
  t = j(t);
  for(var o=[],n=i.getAllChildren(e),a=0,d=n.length;a<d;a++){
    var l = n[a];
    var c = i.getIntPropertyOfNode(l,"FrameIndex",0);
    var f = i.getFloatPropertyOfNode(l,"X",0);
    var s = i.getFloatPropertyOfNode(l,"Y",0);
    var p = k(r,cc.v2(f,s));
    var g = {frame:c,value:[p.x,p.y]};
    var u = H(l);

    if (u) {
      g.curve = u;
    }

    o.push(g);
  }
  t.props.position = o;
  return t;
},RotationSkew:function(e,t){
  t = j(t);
  for(var r=[],o=i.getAllChildren(e),n=0,a=o.length;n<a;n++){
    var d = o[n];
    var l = i.getIntPropertyOfNode(d,"FrameIndex",0);
    var c = i.getFloatPropertyOfNode(d,"X",0);
    var f = {frame:l,value:c};
    var s = H(d);

    if (s) {
      f.curve = s;
    }

    r.push(f);
  }
  t.props.rotation = r;
  return t;
},Scale:function(e,t){
  t = j(t);
  for(var r=[],o=[],n=i.getAllChildren(e),a=0,d=n.length;a<d;a++){
    var l = n[a];
    var c = i.getIntPropertyOfNode(l,"FrameIndex",0);
    var f = i.getFloatPropertyOfNode(l,"X",0);
    var s = i.getFloatPropertyOfNode(l,"Y",0);
    var p = {frame:c,value:f};
    var g = {frame:c,value:s};
    var u = H(l);

    if (u) {
      p.curve = u;
      g.curve = u;
    }

    r.push(p);
    o.push(g);
  }
  t.props.scaleX = r;
  t.props.scaleY = o;
  return t;
},CColor:function(e,t){
  t = j(t);
  for(var r=[],o=i.getAllChildren(e),n=0,a=o.length;n<a;n++){
    var d = o[n];
    var l = i.getIntPropertyOfNode(d,"FrameIndex",0);
    var c = {frame:l,value:new cc.Color(i.getIntPropertyOfNode(d,"R",255,"Color"),i.getIntPropertyOfNode(d,"G",255,"Color"),i.getIntPropertyOfNode(d,"B",255,"Color"),255)};
    var f = H(d);

    if (f) {
      c.curve = f;
    }

    r.push(c);
  }
  t.props.color = r;
  return t;
},Alpha:function(e,t){
  t = j(t);
  for(var r=[],o=i.getAllChildren(e),n=0,a=o.length;n<a;n++){
    var d = o[n];
    var l = i.getIntPropertyOfNode(d,"FrameIndex",0);
    var c = {frame:l,value:i.getIntPropertyOfNode(d,"Value",255)};
    var f = H(d);

    if (f) {
      c.curve = f;
    }

    r.push(c);
  }
  t.props.opacity = r;
  return t;
},VisibleForFrame:function(e,t){
  t = j(t);
  for(var r=[],o=i.getAllChildren(e),n=0,a=o.length;n<a;n++){
    var d = o[n];
    var l = i.getIntPropertyOfNode(d,"FrameIndex",0);
    var c = {frame:l,value:i.getBoolPropertyOfNode(d,"Value",true)};
    r.push(c)
  }
  t.props.active = r;
  return t;
},FileData:function(e,t,r){if (!r) {
  return t;
}if(r.getComponent(cc.Sprite)){t = function(e,t){
  if (!e) {
    e = {};
  }

  if (!e.comps) {
    e.comps = {};
  }

  if (!e.comps[t]) {
    e.comps[t] = {};
  }

  return e
}(t,"cc.Sprite");for(var o=[],n=i.getAllChildren(e),a=0,d=n.length;a<d;a++){
  var l = n[a];
  var c = i.getIntPropertyOfNode(l,"FrameIndex",0);
  var f = i.getFirstChildNodeByName(l,"TextureFile");
  var s = X(f,"");
  if(s){var p={frame:c,value:s};o.push(p)}
}t.comps["cc.Sprite"].spriteFrame = o;}return t}};

const S = ["sine","quad","cubic","quart","quint","expo","circ","elastic","back","bounce"];
const b = ["In","Out","InOut"];
const F = "triggerAnimationEvent";
var A = [];
var B = "";
var I = "";
var E = "";
var T = {};
function w(a,d){
  if (A.indexOf(a)>=0) {
    d();
    return;
  }
  Editor.log("Importing csd file : ",a);
  if (!r.existsSync(a)) {
    Editor.warn("%s is not existed!",a);
    d();
    return;
  }if (!r.statSync(a).isFile()) {
    Editor.warn("%s is not a file!",a);
    d();
    return;
  }var l=(new t).parseFromString(r.readFileSync(a,"utf-8"));if (!l) {
    Editor.warn("Parse %s failed.",a);
    d();
    return;
  }try{
    var c = l.getElementsByTagName("PropertyGroup")[0].getAttribute("Type");
    var f = l.getElementsByTagName("Content")[0];
    f = i.getFirstChildNodeByName(f,"Content");
  }catch(e){
    Editor.warn("Parse %s failed.",a);
    d();
    return;
  }if (!f||!c) {
    Editor.warn("Parse %s failed.",a);
    d();
    return;
  }
  var s = null;
  var p = null;
  switch(c){case "Scene":
    s = D(a,".fire");
    p = z;
    break;case"Node":case "Layer":
    s = D(a,".prefab");
    p = L;}if (!p) {
    d();
    return;
  }e.waterfall([function(e){
    T = {};

    p(f,a,function(t){if(t){
      var n=o.dirname(s);

      if (!r.existsSync(n)) {
        r.mkdirsSync(n);
      }

      r.writeFileSync(s,t);
    }e()});
  },function(e){
    var t = o.relative(I,s);
    var r = n.join(B,t);
    Editor.assetdb.import([s],n.dirname(r),false,function(t,r){
      A.push(a);
      e();
    })
  }],d)
}function D(e,t){
  var r = o.dirname(e);
  var n = o.relative(E,r);
  var i = o.basename(e,o.extname(e));
  return o.join(I,n,i+t)
}function x(e){
  var t=e;

  if (e&&(t=e.replace(v,"_"))!==e) {
    Editor.warn('The name of node "%s" contains illegal characters. It was renamed to "%s".',e,t);
  }

  return t;
}function z(e,t,r){
  var o = new cc.SceneAsset;
  var n = new cc.Scene;
  var i = new cc.Node("Scene");
  i.setAnchorPoint(0,0);
  n.addChild(i);
  var a=new cc.Node("Canvas");
  a.addComponent(cc.Canvas);
  i.addChild(a);
  var d=new cc.Node("Main Camera");
  d.addComponent(cc.Camera);
  a.addChild(d);

  _(i,e,t,function(){
    o.scene = n;
    r(Editor.serialize(o));
  });
}function L(e,t,r){var o=new cc.Node;_(o,e,t,function(){var e=Editor.require("scene://utils/prefab").createPrefabFrom(o);r(Editor.serialize(e))})}function _(t,a,d,l){e.waterfall([function(r){var o=i.getFirstChildNodeByName(a,"ObjectData");(function t(r,o,n,a){var d=r;var l=false;var c="";e.waterfall([function(e){if (r) {
  e();
} else {
  l = true;
  var t = o.getAttribute("ctype");
  var n = P[t];

  if (n) {
    n(o,function(t,o){
      r = t;
      d = o||r;
      e();
    });
  } else {
    r = new cc.Node;
    d = r;
    e();
  }
}},function(e){if(l){
  var t=i.getPropertyOfNode(o,"ActionTag","");

  if (t) {
    if (n) {
      c += n+"/";
    }

    c += x(o.getAttribute("Name"));
    T[t] = {nodePath:c,node:d};
  }
}(function(e,t,r){
  var o=t.getAttribute("ctype");

  if ("ScrollViewObjectData"!==o) {
    U(e,t);
  }

  e.active = i.getBoolPropertyOfNode(t,"VisibleForFrame",true);

  if (i.getBoolPropertyOfNode(t,"TouchEnable",false)) {
    e.addComponent(cc.BlockInputEvents);
  }

  (function(e,t){
    var r = i.getPropertyOfNode(t,"HorizontalEdge","");
    var o = i.getBoolPropertyOfNode(t,"PercentWidthEnable",false);
    var n = i.getBoolPropertyOfNode(t,"PercentWidthEnabled",false);
    var a = i.getBoolPropertyOfNode(t,"PositionPercentXEnabled",false);
    var d = i.getBoolPropertyOfNode(t,"StretchWidthEnable",false);
    var l = i.getFloatPropertyOfNode(t,"X",0,"PrePosition");

    if (a) {
      a = 0!==l;
    }

    var c = i.getPropertyOfNode(t,"VerticalEdge","");
    var f = i.getBoolPropertyOfNode(t,"PercentHeightEnable",false);
    var s = i.getBoolPropertyOfNode(t,"PercentHeightEnabled",false);
    var p = i.getBoolPropertyOfNode(t,"PositionPercentYEnabled",false);
    var g = i.getBoolPropertyOfNode(t,"StretchHeightEnable",false);
    var u = i.getFloatPropertyOfNode(t,"Y",0,"PrePosition");

    if (p) {
      p = 0!==u;
    }

    if(r||o||n||a||d||c||f||s||p||g){
      var m=e.addComponent(cc.StudioWidget);if (!m) {
        Editor.warn("Add Widget component for node %s failed.",t.getAttribute("Name"));
        return;
      }
      var N = e.getAnchorPoint();
      var y = i.getFloatPropertyOfNode(t,"X",0,"PreSize");
      var v = i.getFloatPropertyOfNode(t,"LeftMargin",0);
      var h = i.getFloatPropertyOfNode(t,"RightMargin",0);
      var P = l-y*N.x;
      var C = 1-l-y*(1-N.x);
      var O = o||n||d;

      if (r.indexOf("Left")>=0) {
        E(!a);

        if (O) {
          T(false);
        }
      } else {
        if (r.indexOf("Right")>=0) {
          T(!a);

          if (O) {
            E(false);
          }
        } else {
          if (r.indexOf("Both")>=0) {
            E(!O&&!a);
            T(!O&&!a);
          } else {
            if (O) {
              E(false);
              T(false);
            } else {
              if (a) {
                E(false);
              }
            }
          }
        }
      }

      var S = i.getFloatPropertyOfNode(t,"Y",0,"PreSize");
      var b = i.getFloatPropertyOfNode(t,"TopMargin",0);
      var F = i.getFloatPropertyOfNode(t,"BottomMargin",0);
      var A = u-S*N.y;
      var B = 1-u-S*(1-N.y);
      var I = f||s||g;

      if (c.indexOf("Bottom")>=0) {
        w(!p);

        if (I) {
          D(false);
        }
      } else {
        if (c.indexOf("Top")>=0) {
          D(!p);

          if (I) {
            w(false);
          }
        } else {
          if (c.indexOf("Both")>=0) {
            w(!I&&!p);
            D(!I&&!p);
          } else {
            if (p) {
              w(false);
            }
          }
        }
      }
    }function E(e){
      m.isAlignLeft = true;
      m.isAbsoluteLeft = e;
      m.left = e?v:P;
    }function T(e){
      m.isAlignRight = true;
      m.isAbsoluteRight = e;
      m.right = e?h:C;
    }function w(e){
      m.isAlignBottom = true;
      m.isAbsoluteBottom = e;
      m.bottom = e?F:A;
    }function D(e){
      m.isAlignTop = true;
      m.isAbsoluteTop = e;
      m.top = e?b:B;
    }
  })(e,t);

  if (o&&h[o]) {
    h[o](e,t,r);
  } else {
    r();
  }
})(r,o,e)},function(n){var a=o.getElementsByTagName("Children");if (!a||0===a.length) {
  n();
  return;
}for(var d=(a=a[0]).childNodes,l=[],f=0,s=d.length;f<s;f++){
  var p=d[f];

  if (!i.shouldIgnoreNode(p)) {
    l.push(p);
  }
}if (0===l.length) {
  n();
  return;
}var g=0;e.whilst(function(e){e(null,g<l.length)},function(e){t(null,l[g],c,function(t){
  r.addChild(t);

  if (t.getParent()) {
    t.setPosition(k(t));
  }

  g++;
  e();
})},function(){n()})}],function(){a(d)})})(t,o,"",function(){r()})},function(l){(function(t,a,d,l){
  var c=i.getFirstChildNodeByName(a,"Animation");if (!c) {
    l();
    return;
  }var f=i.getChildNodesByName(c,"Timeline");if (!f||0===f.length) {
    l();
    return;
  }var s=function(e){
    var t = o.dirname(e);
    var r = o.relative(E,t);
    var i = o.basename(e,o.extname(e))+N;
    n.join(B,r,i);
    return o.join(I,r,i);
  }(d);

  if (!r.existsSync(s)) {
    r.mkdirsSync(s);
  }

  var p = i.getIntPropertyOfNode(c,"Duration",0);
  var g = i.getFloatPropertyOfNode(c,"Speed",0);
  var u = o.basename(d,o.extname(d));
  var m = [{name:u,startIndex:0,endIndex:p}];
  var v = 0;
  var h = 0;
  var P = i.getFirstChildNodeByName(a,"AnimationList");
  if(P){var C=i.getChildNodesByName(P,"AnimationInfo");if(C&&C.length>0){var S=1;for(v=0,h=C.length;v<h;v++){
    var b = C[v];
    var F = i.getPropertyOfNode(b,"Name","");
    if(F){
      if (F.toLowerCase()===m[0].name.toLowerCase()) {
        m[0].name = u+S;
        S++;
      }

      var A = i.getIntPropertyOfNode(b,"StartIndex",0);
      var w = i.getIntPropertyOfNode(b,"EndIndex",p);
      m.push({name:F,startIndex:A,endIndex:w})
    }
  }}}
  var D = {};
  var x = [];
  for(v=0,h=f.length;v<h;v++){
    var z = f[v];
    var L = i.getPropertyOfNode(z,"ActionTag","");
    var _ = T[L];
    if(_){var R=_.nodePath;if(R){var j=i.getPropertyOfNode(z,"Property","");if ("FrameEvent"===j) {
      x = V(z,x);
    } else
      {var H=O[j];if(!H&&""!==j){Editor.warn('Action for property "%s" is not supported.',j);continue}D[R] = H(z,D[R],_.node);}}}
  }
  var k = o.dirname(s);
  var U = o.relative(I,k);
  var X = n.join(B,U);
  var W = [];
  for(v=0,h=m.length;v<h;v++){
    var Y = m[v];
    var G = Y.name+".anim";
    var q = o.join(s,G);
    var Z = M(Y,D,x);
    Z.speed = g;
    Z.sample = y;
    Z._name = Y.name;
    Z._duration = (Y.endIndex-Y.startIndex)/y;
    var J=Editor.serialize(Z);
    r.writeFileSync(q,J);
    W.push(n.join(X,o.basename(s),G));
  }e.waterfall([function(e){Editor.assetdb.import([s],X,false,function(){e()})},function(e){var r=t.addComponent(cc.Animation);if (r) {for(v=0,h=W.length;v<h;v++){
    var o = W[v];
    var i = Editor.assetdb.remote.urlToUuid(o);
    if(i){
      var a=new cc.AnimationClip;
      a._uuid = i;
      a._name = n.basenameNoExt(o);
      r.addClip(a);
    }
  }e()} else {
    Editor.warn("Add Animation component failed.");
    e();
  }}],l)
})(t,a,d,l)}],l)}function M(e,t,r){
  var o = new cc.AnimationClip;
  var n = e.startIndex;
  var i = e.endIndex;
  var a = {};
  for(var d in t)if(t.hasOwnProperty(d)){
    var l = {};
    var c = t[d];
    var f = c.props;
    if(f){var s={};for (var p in f) if (f.hasOwnProperty(p)) {
      s[p] = R(f[p],n,i);
    }l.props = s;}var g=c.comps;if(g){
      var u=null;for(var m in g)if(g.hasOwnProperty(m)){
        var N = null;
        var y = g[m];
        for(var v in y)if(y.hasOwnProperty(v)){
          var h=R(y[v],n,i);

          if (h.length>0) {
            if (!N) {
              N = {};
            }

            N[v] = h;
          }
        }

        if (N) {
          if (!u) {
            u = {};
          }

          u[m] = N;
        }
      }

      if (u) {
        l.comps = u;
      }
    }
    a[d] = l;
  }
  o.curveData = {paths:a};
  o.events = R(r,n,i);
  return o;
}function R(e,t,r){for(var o=[],n=0,i=e.length;n<i;n++){
  let i = e[n];
  let d = i.frame;
  if (d<t||d>r) {
    continue;
  }let l={};for (var a in i) if (i.hasOwnProperty(a)) {
    if ("frame"===a) {
      l.frame = (d-t)/y;
    } else {
      l[a] = i[a];
    }
  }o.push(l)
}return o}function j(e){
  if (!e) {
    e = {};
  }

  if (!e.props) {
    e.props = {};
  }

  return e;
}function H(e){var t=i.getIntPropertyOfNode(e,"Type",0,"EasingData");if (0===t) {
  return null;
}var r=null;if(-1===t){
  var o = i.getFirstChildNodeByName(e,"EasingData");
  var n = i.getFirstChildNodeByName(o,"Points");
  var a = i.getChildNodesByName(n,"PointF");
  r = [i.getFloatPropertyOfNode(a[1],"X","0"),i.getFloatPropertyOfNode(a[1],"Y","0"),i.getFloatPropertyOfNode(a[2],"X","0"),i.getFloatPropertyOfNode(a[2],"Y","0")];
}else{
  var d = Math.floor((t-1)/3);
  var l = (t-1)%3;

  if (d<S.length) {
    r = S[d]+b[l];
  }
}return r}function V(e,t){for(var r=i.getAllChildren(e),o=0,n=r.length;o<n;o++){
  var a = r[o];
  var d = i.getIntPropertyOfNode(a,"FrameIndex",0);
  var l = i.getPropertyOfNode(a,"Value","");
  var c = {frame:d,func:F};

  if (l) {
    c.params = [l];
  }

  t.push(c);
}return t}function k(e,t){
  if (!t) {
    t = e.getPosition();
  }

  var r=e.getParent();if (!r) {
    return t;
  }
  var o = r.getAnchorPoint();
  var n = r.getContentSize();
  var i = t.x-n.width*o.x;
  var a = t.y-n.height*o.y;
  return cc.v2(i,a)
}function U(e,t){
  var r=t.getAttribute("ctype");
  e.setName(x(t.getAttribute("Name")));
  e.setContentSize(i.getFloatPropertyOfNode(t,"X",0,"Size"),i.getFloatPropertyOfNode(t,"Y",0,"Size"));

  if ("GameLayerObjectData"===r) {
    e.setAnchorPoint(0,0);
  }

  if(C.indexOf(r)<0){
    e.active = i.getBoolPropertyOfNode(t,"VisibleForFrame",true);
    e.setAnchorPoint(i.getFloatPropertyOfNode(t,"ScaleX",0,"AnchorPoint"),i.getFloatPropertyOfNode(t,"ScaleY",0,"AnchorPoint"));
    e.setPosition(i.getFloatPropertyOfNode(t,"X",0,"Position"),i.getFloatPropertyOfNode(t,"Y",0,"Position"));
    var o = i.getFloatPropertyOfNode(t,"ScaleX",1,"Scale");
    var n = i.getFloatPropertyOfNode(t,"ScaleY",1,"Scale");
    var a = i.getBoolPropertyOfNode(t,"FlipX",false);
    var d = i.getBoolPropertyOfNode(t,"FlipY",false);
    o = a?-1*o:o;
    n = d?-1*n:n;
    e.setScale(o,n);
    let l = i.getFloatPropertyOfNode(t,"RotationSkewX",0);
    let c = i.getFloatPropertyOfNode(t,"RotationSkewY",0);

    if (l===c) {
      e.angle = l;
    } else {
      e.is3DNode = true;
      e.eulerAngles = cc.v3(l,c,0);
    }

    if ("TextFieldObjectData"!==r&&"ScrollViewObjectData"!==r) {
      e.color = new cc.Color(i.getIntPropertyOfNode(t,"R",255,"CColor"),i.getIntPropertyOfNode(t,"G",255,"CColor"),i.getIntPropertyOfNode(t,"B",255,"CColor"));
      e.opacity = i.getIntPropertyOfNode(t,"Alpha",255);
    }
  }
}function X(e,t){
  if (!e&&!t) {
    return null;
  }let r=function(e,t){var r=t;if(e){
    var o = i.getPropertyOfNode(e,"Type","Default");
    var a = i.getPropertyOfNode(e,"Path","");
    switch(o){case"PlistSubImage":var d=i.getPropertyOfNode(e,"Plist","");if(d&&a){var l=n.join(B,d);r = n.join(l,a.replace(v,"-"));}break;case"MarkedSubImage":case "Normal":
      if (a) {
        r = n.join(B,a);
        r = n.join(r,n.basenameNoExt(r));
      }}
  }let c=Editor.assetdb.remote.urlToUuid(r);return r&&c?c:null}(e,t);if (!r) {
    Editor.warn("Failed to import spriteframe asset, asset info: "+e+", uuid: "+r);
    return null;
  }if (!Editor.assetdb.remote.existsByUuid(r)) {
    Editor.warn("Failed to import spriteframe asset, asset info: "+e+", url: "+t);
    return null;
  }var o=new cc.SpriteFrame;
  o._uuid = r;
  return o;
}function W(e,t,r){Editor.assetdb.queryMetaInfoByUuid(t,function(o,n){
  if (!n) {
    r();
    return;
  }
  var d = JSON.parse(n.json);
  var l = i.getIntPropertyOfNode(e,"Scale9OriginX",0);
  var c = i.getIntPropertyOfNode(e,"Scale9OriginY",0);
  var f = i.getIntPropertyOfNode(e,"Scale9Width",d.rawWidth);
  var s = i.getIntPropertyOfNode(e,"Scale9Height",d.rawHeight);
  d.trimThreshold = -1;
  d.borderTop = c;
  d.borderBottom = d.rawHeight-c-s;

  if (d.borderBottom<0) {
    d.borderBottom = 0;
  }

  d.borderLeft = l;
  d.borderRight = d.rawWidth-l-f;

  if (d.borderRight<0) {
    d.borderRight = 0;
  }

  var p=JSON.stringify(d);

  if (n.assetUrl.startsWith(a)) {
    r();
  } else {
    Editor.assetdb.saveMeta(t,p,function(){r()});
  }
})}function Y(e,t,r,o){
  var n=e.addComponent(cc.Sprite);if (!n) {
    Editor.warn("Add sprite component for node %s failed.",t.getAttribute("Name"));
    return o;
  }var a=i.getIntPropertyOfNode(t,"Src",cc.macro.BlendFactor.SRC_ALPHA,"BlendFunc");
  n.srcBlendFactor = 1===a?cc.macro.BlendFactor.SRC_ALPHA:a;
  n.dstBlendFactor = i.getIntPropertyOfNode(t,"Dst",cc.macro.BlendFactor.ONE_MINUS_SRC_ALPHA,"BlendFunc");
  var d=i.getFirstChildNodeByName(t,"FileData");
  n.sizeMode = r;
  n.trim = false;
  n.spriteFrame = X(d,"");
  o();
}function G(t,r,o){
  var n=t.addComponent(cc.Label);if (!n) {
    Editor.warn("Add Label component for node %s failed.",r.getAttribute("Name"));
    o();
    return;
  }switch(i.getBoolPropertyOfNode(r,"IsCustomSize",false)&&(n.overflow=cc.Label.Overflow.CLAMP,n._useOriginalSize=false),n.string=i.getPropertyOfNode(r,"LabelText",""),n.lineHeight=0,i.getPropertyOfNode(r,"HorizontalAlignmentType","")){case"HT_Right":n.horizontalAlign = cc.Label.HorizontalAlign.RIGHT;break;case"HT_Center":n.horizontalAlign = cc.Label.HorizontalAlign.CENTER;break;default:n.horizontalAlign = cc.Label.HorizontalAlign.LEFT;}switch(i.getPropertyOfNode(r,"VerticalAlignmentType","")){case"VT_Bottom":n.verticalAlign = cc.Label.VerticalAlign.BOTTOM;break;case"VT_Center":n.verticalAlign = cc.Label.VerticalAlign.CENTER;break;default:n.verticalAlign = cc.Label.VerticalAlign.TOP;}
  var a = i.getFirstChildNodeByName(r,"LabelBMFontFile_CNB");
  var d = i.getFirstChildNodeByName(r,"FontResource");
  e.waterfall([function(e){
    if (a) {
      Z(n,a,e);
    } else {
      if (d) {
        Z(n,d,e);
      } else {
        e();
      }
    }
  },function(e){
    var t=i.getIntPropertyOfNode(r,"FontSize",-1);

    if (t>=0) {
      n._fontSize = t;
      e();
    } else {
      if (a) {
        q(a,(t,r)=>{
          if (!(!t && r)) {
            e();
          }

          var o=r._fntConfig;
          n._fontSize = o.fontSize;
          n.lineHeight = o.commonHeight;
          e();
        });
      } else {
        e();
      }
    }
  }],o)
}function q(e,t){
  var r = n.join(B,i.getPropertyOfNode(e,"Path",""));
  var o = false;
  if(r){
    var a=Editor.assetdb.remote.urlToUuid(r);

    if (Editor.assetdb.remote.existsByUuid(a)) {
      o = true;
    }
  }

  if (o) {
    cc.assetManager.loadAny(a,t);
  } else {
    if (t) {
      t(null,null);
    }
  }
}function Z(e,t,r){if (!e||!t) {
  if (r) {
    r();
  }

  return;
}q(t,(t,o)=>{
  if (t) {
    Editor.error(t);
  }

  e.font = o||null;

  if (r) {
    r();
  }
})}function J(e,t,r){
  if (i.getBoolPropertyOfNode(t,"ClipAble",false)) {
    e.addComponent(cc.Mask).enabled = true;
  }

  K(e,t,r)
}function K(t,r,o){
  var n = t.getContentSize().width;
  var a = t.getContentSize().height;
  var l = i.getFirstChildNodeByName(r,"FileData");
  var c = i.getIntPropertyOfNode(r,"ComboBoxIndex",0);
  var f = null;
  e.waterfall([function(e){if (l) {
    let n=(f=new cc.Node("background")).addComponent(cc.Sprite);
    n.trim = false;
    var o=X(l,m);if (!o) {
      return e();
    }

    if (i.getBoolPropertyOfNode(r,"Scale9Enable",false)) {
      f.setContentSize(t.getContentSize());
      n.sizeMode = cc.Sprite.SizeMode.CUSTOM;
      n.type = cc.Sprite.Type.SLICED;
      n.spriteFrame = o;
      W(r,o._uuid,e);
    } else {
      n.spriteFrame = o;
      e();
    }
  } else {
    if (1===c) {
      (f=new cc.Node("background")).setContentSize(n,a);let t=f.addComponent(cc.Sprite);
      t.sizeMode = cc.Sprite.SizeMode.CUSTOM;
      t.trim = false;
      t.spriteFrame = new cc.SpriteFrame;
      t.spriteFrame._uuid = Editor.assetdb.remote.urlToUuid(d);
      f.color = new cc.Color(i.getIntPropertyOfNode(r,"R",255,"SingleColor"),i.getIntPropertyOfNode(r,"G",255,"SingleColor"),i.getIntPropertyOfNode(r,"B",255,"SingleColor"));
      f.opacity = i.getIntPropertyOfNode(r,"BackColorAlpha",255);
      e();
    } else {
      e()
    }
  }},function(e){if(f){
    t.addChild(f);let e=f.addComponent(cc.StudioWidget);
    e.isAlignHorizontalCenter = true;
    e.isAlignVerticalCenter = true;
  }e()}],o)
}function Q(e,t,r){
  var o = new cc.Node(t);
  var n = o.addComponent(cc.Scrollbar);
  n.direction = e;
  var i=o.addComponent(cc.StudioWidget);
  i.isAlignRight = true;
  i.isAlignBottom = true;
  i.isAlignTop = e===cc.Scrollbar.Direction.VERTICAL;
  i.isAlignLeft = e===cc.Scrollbar.Direction.HORIZONTAL;
  var a=new cc.Node("bar");o.addChild(a);var d=a.addComponent(cc.Sprite);
  d.type = cc.Sprite.Type.SLICED;
  d.trim = false;
  d.sizeMode = cc.Sprite.SizeMode.CUSTOM;
  d.spriteFrame = new cc.SpriteFrame;

  if (e===cc.Scrollbar.Direction.HORIZONTAL) {
    o.setContentSize(r.width,15);
    a.setContentSize(.7*r.width,15);
    d.spriteFrame._uuid = Editor.assetdb.remote.urlToUuid(u);
  } else {
    o.setContentSize(15,r.height);
    a.setContentSize(15,.7*r.height);
    d.spriteFrame._uuid = Editor.assetdb.remote.urlToUuid(g);
  }

  n.handle = d;
  return o;
}

module.exports = {importCSDFiles:function(t,r,o,n,i){
  E = r;
  I = o;
  B = n;
  var a=0;e.whilst(function(e){e(null,a<t.length)},function(e){w(t[a],function(){
    a++;
    e();
  })},function(){i()})
}};