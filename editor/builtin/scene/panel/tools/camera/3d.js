"use strict";let e=require("./editor-camera");const{Vec3:t,Quat:i,Mat3:s}=cc.math;
let o = new t;
let a = new t;
let h = cc.Enum({NONE:0,ORBIT:1,PAN:2,ZOOM:3,WANDER:4});

module.exports = class extends e{constructor(){
  super();
  this.settings = {speed:1,farClip:4096,nearClip:.1};
  this.mouse_wheel_factor = -.025;
  this.orbit_speed = .006;
  this.rotate_speed = .006;
  this.pan_speed = 2;
  this.wander_speed = 10;
  this.shift_speed_multipy = 5;
  this.curWanderMove = new t;
  this.camera_move_mode = h.NONE;
  this._sceneViewCenter = new t;
  this._viewDist = 20;
  this.damping = 20;
  this.id_right = cc.v3(1,0,0);
  this.id_up = cc.v3(0,1,0);
  this.id_forward = cc.v3(0,0,1);
  this.right = cc.v3(this.id_right);
  this.up = cc.v3(this.id_up);
  this.forward = cc.v3(this.id_forward);
  this._destRot = new i;
  this._destEye = new t;
  this._curMouseDX = 0;
  this._curMouseDY = 0;
}resetPos(){
  this.node.getPosition(this.eye);
  this._destEye = t.clone(this.eye);
  this.node.getRotation(this.rotation);
  this._destRot = i.clone(this.rotation);
}init(e){
  super.init(e);
  this.initPosition();
  this.tickInterval = 1e3/60;
  this.dt = 1/60;

  this.moveUpdate = (() => {
    let e = this._destEye;
    let s = this._destRot;
    let o = this.dt;
    i.rotateX(s,s,this._curMouseDY*this.rotate_speed);
    i.rotateAround(s,s,this.id_up,-this._curMouseDX*this.rotate_speed);
    i.slerp(this.rotation,this.rotation,s,o*this.damping);
    t.scale(a,this.curWanderMove,this.settings.speed*(this.shiftKey?this.shift_speed_multipy*o:o));
    t.transformQuat(a,a,this.rotation);
    t.add(e,e,a);
    t.lerp(this.eye,this.eye,e,o*this.damping);
    this.update();
    this._curMouseDX = 0;
    this._curMouseDY = 0;
  });

  this.cameraTweenMoveUpdate = ((e, i) => {let s=Date.now()-this.startMoveTime;if (s>=i) {
    this.stopTicking(this.cameraTweenMoveUpdate);
    this.eye = this.startCameraPos.add(e);
  } else {
    let o=new t;
    t.scale(o,e,s/i);
    this.eye = this.startCameraPos.add(o);
  }this.update()});

  this.initTips();
  this._initLinearTick();
}_initLinearTick(){const e=require("./grid/linear-ticks");this._linearTicks = (new e).initTicks([5,2],.1,1e4).spacing(15,80);}initTips(){
  this.info = document.createElement("div");
  this.info.hidden = true;
  this.info.id = "camera_info";
  this.info.innerHTML = "\n        <style>\n            #camera_info { position: absolute; top: 10px; left: 10px; font-size: 12px; text-align: center; color: #fff; }\n            #camera_info div { padding: 2px 0; }\n            #camera_info span { border: 1px solid #fff; border-radius: 2px; padding: 0 4px; }\n        </style>\n        <div>\n            <span>w</span>\n        </div>\n        <div>\n            <span>a</span>\n            <span>s</span>\n            <span>d</span>\n        </div>\n        ";
  _Scene.view.shadowRoot.appendChild(this.info);
}startTicking(e,...t){
  if (!e.timer) {
    e.timer = setInterval(e,this.tickInterval,...t);
  }
}stopTicking(e){
  if (e.timer) {
    clearInterval(e.timer);
    e.timer = 0;
  }
}initPosition(){
  this.eye.set(cc.v3(0,20,20));let e=cc.v3(0,0,0);
  this._sceneViewCenter = e;
  this._viewDist = t.distance(this.eye,this._sceneViewCenter);
  let s = cc.v3(0,1,0);
  let o = i.fromViewUp(new i,this.eye.sub(e).normalizeSelf(),s);
  this.rotation.set(o);
  this.update();
}update(){this.updateCamera()}focusCameraToPos(e){
  let i = new t;
  let s = new t;
  let o = e.center;
  let a = 6*Math.max(e.halfExtents.x,e.halfExtents.y,e.halfExtents.z,1)/Math.tan(this.tool._camera.fov/180*Math.PI);
  this._sceneViewCenter = o.clone();
  t.transformQuat(i,cc.v3(0,0,-1),this.rotation);
  t.scale(s,i,-a);
  o.addSelf(s);
  t.sub(s,o,this.eye);
  this.startMoveTime = Date.now();
  this.startCameraPos = this.eye.clone();
  this.startTicking(this.cameraTweenMoveUpdate,s,300);
}focusCameraToNodes(e){if (e.length<=0) {
  return;
}e = e.map(e=>cc.engine.getInstanceById(e));let t=Editor.GizmosUtils.getRecursiveWorldBounds3D(e);this.focusCameraToPos(t)}updateViewCenterByDist(e){
  this.node.getWorldPosition(this.eye);
  this.node.getWorldRotation(this.rotation);
  t.transformQuat(this.forward,this.id_forward,this.rotation);
  t.scale(o,this.forward,e);
  t.add(a,this.eye,o);
  this._sceneViewCenter = a;
}enterOrbitMode(){
  this.camera_move_mode = h.ORBIT;
  this.node.getWorldPosition(this.eye);
  this._viewDist = t.distance(this.eye,this._sceneViewCenter);
}enterPanMode(){
  this.camera_move_mode = h.PAN;
  _Scene.view.style.cursor = "-webkit-grab";
}exitPanMode(){
  this.camera_move_mode = h.NONE;
  _Scene.view.style.cursor = "";
  this.updateViewCenterByDist(-this._viewDist);
}enterWanderMode(){
  this.camera_move_mode = h.WANDER;
  this.needMouseMove = true;
  this.startTicking(this.moveUpdate);
  this.info.hidden = false;
  cc.game.canvas.requestPointerLock();
  this.resetPos();
  this._curMouseDX = 0;
  this._curMouseDY = 0;
}exitWanderMode(){
  this.camera_move_mode = h.NONE;
  this.needMouseMove = false;
  this.stopTicking(this.moveUpdate);
  this.info.hidden = true;
  document.exitPointerLock();
  this.updateViewCenterByDist(-this._viewDist);
}onMouseDown(e){
  _Scene.lockGizmoTool(true);

  if (this.camera_move_mode===h.NONE) {
    if (1===e.which&&this.altKey) {
      this.enterOrbitMode();
    }

    if (2===e.which) {
      this.enterPanMode();
    } else {
      if (3===e.which) {
        this.enterWanderMode();
      }
    }
  }

  t.set(this.curWanderMove,0,0,0);
  this.isMouseDown = true;
  this.needMouseMove = true;
  this.lastX = e.x;
  this.lastY = e.y;
  return true;
}getWheelDelta(e){return e.wheelDelta*this.mouse_wheel_factor*this.settings.speed}onMouseWheel(e){
  let i = -this.getWheelDelta(e);
  let o = new s;
  let a = cc.v3(0,0,-1);
  let h = new t;
  s.fromQuat(o,this.rotation);
  t.transformMat3(h,a,o);
  t.scaleAndAdd(this.eye,this.eye,h,i);
  this._viewDist = t.distance(this.eye,this._sceneViewCenter);
  this.update();
}onMouseMove(e){if (this.isMouseDown||this.needMouseMove) {
  this.onCameraDrag(e);
  this.lastX = e.x;
  this.lastY = e.y;
  return true;
}}onMouseUp(e){
  this.isMouseDown = false;
  this.needMouseMove = false;
  _Scene.lockGizmoTool(false);
  if (1===e.which) {if (this.camera_move_mode===h.ORBIT) {
    this.camera_move_mode = h.NONE;
    return true;
  }} else {
    if (2===e.which) {
      this.exitPanMode();
    } else {
      if (3===e.which) {
        this.exitWanderMode();
      }
    }
  }
}onKeyDown(e){
  this.shiftKey = e.shiftKey;
  this.altKey = e.altKey;
  this.ctrlKey = e.ctrlKey;
  if("f"===Editor.KeyCode(e.which)&&!this.ctrlKey&&!this.shiftKey){let e=Editor.Selection.curSelection("node");this.focusCameraToNodes(e)}

  if ("k"===Editor.KeyCode(e.which)) {
    if (this.camera_move_mode===h.WANDER) {
      this.exitWanderMode();
    } else {
      this.enterWanderMode();
    }
  }

  if (this.camera_move_mode===h.WANDER) {
    switch(Editor.KeyCode(e.which)){case"w":this.curWanderMove.z = -this.wander_speed;break;case"s":this.curWanderMove.z = this.wander_speed;break;case"a":this.curWanderMove.x = -this.wander_speed;break;case"d":this.curWanderMove.x = this.wander_speed;}
  }
}onKeyUp(e){switch(this.shiftKey=e.shiftKey,this.altKey=e.altKey,Editor.KeyCode(e.which)){case"w":case"s":this.curWanderMove.z = 0;break;case"a":case"d":this.curWanderMove.x = 0;}}onResize(){}zoomTo(e){}onCameraDrag(e){
  let t = e.x-this.lastX;
  let i = -(e.y-this.lastY);

  if (this.camera_move_mode===h.ORBIT) {
    this.orbit(t,i);
  } else {
    if (this.camera_move_mode===h.PAN) {
      this.panning(t,i);
    } else {
      if (this.camera_move_mode===h.WANDER) {
        this.rotate(e.movementX,-e.movementY);
      }
    }
  }
}orbit(e,s){
  let o=this.rotation;
  i.rotateX(o,o,s*this.orbit_speed);
  i.rotateAround(o,o,this.id_up,-e*this.orbit_speed);
  let a=cc.v3(0,0,this._viewDist);
  t.transformQuat(a,a,o);
  t.add(this.eye,this._sceneViewCenter,a);
  this.update();
}panning(e,t){this.moveCamera(cc.v3(-e*this.pan_speed,-t*this.pan_speed,0),false)}moveCamera(e,i){
  t.transformQuat(e,e,this.rotation);
  this.eye.addSelf(e);
  this.update();
}rotate(e,t){
  this._curMouseDX = e;
  this._curMouseDY = t;
}adjustSceneToNodes(e){this.focusCameraToNodes(e)}adjustToCenter(){}_updateGrid(e,i,s,o){
  let a = this._linearTicks;
  let h = t.mag(this.eye)/500*1e4|0;
  a.range(-h,h,1e4);let n=s.clone();
  n.a = 0;
  for(let t=a.minTickLevel;t<=a.maxTickLevel;++t){let h=a.tickRatios[t];if(h>0){let r=a.ticksAtLevel(t,true);for(let t=0;t<r.length;++t){
    let d = r[t];
    let c = s.clone();
    c.a = 51*h;
    c.a *= 1-Math.abs(d)/a.maxValue;
    e.push(cc.v2(d,0));
    e.push(cc.v2(d,-o));
    e.push(cc.v2(d,0));
    e.push(cc.v2(d,o));
    i.push(c);
    i.push(n);
    i.push(c);
    i.push(n);
    e.push(cc.v2(0,d));
    e.push(cc.v2(-o,d));
    e.push(cc.v2(0,d));
    e.push(cc.v2(o,d));
    i.push(c);
    i.push(n);
    i.push(c);
    i.push(n);
  }}}
}};