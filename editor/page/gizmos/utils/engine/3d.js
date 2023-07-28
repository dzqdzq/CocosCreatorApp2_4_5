"use strict";let e=require("./engine-interface");const t=require("../../../../3d/manager/camera");
let o = require("../external").GeometryUtils.aabb;
let n = cc.gfx;
let r = function(e,t){return e.map(t).reduce((e,t)=>e.concat(t),[])};
const c = (e,t)=>e.distance-t.distance;
const a = cc.geometry.ray.create();

module.exports = new (class extends e {constructor(){
  super();
  this.gfx = n;
  this.panPlaneLayer = cc.Layers.Editor;
}create3DNode(e){
  let t=new cc.Node(e);
  t._layer = cc.Layers.Gizmos;
  t.modelColor = cc.color();
  return t;
}createMesh(e){
  e.positions = r(e.positions,e=>[e.x,e.y,e.z]);

  if (e.normals) {
    e.normals = r(e.normals,e=>[e.x,e.y,e.z]);
  }

  if (e.uvs) {
    e.uvs = r(e.uvs,e=>[e.x,e.y]);
  }

  let t=cc.utils.createMesh(cc.game._renderContext,e);
  t.getSubMesh(0).doubleSided = e.doubleSided;
  return t;
}addMeshToNode(e,t,o={}){
  let r=e.addComponent(cc.ModelComponent);
  r.mesh = t;
  let c=new cc.Material;
  c.effectName = "__editor-gizmo";

  if (o.unlit) {
    c.effect.LOD = 50;
  } else {
    if (t.getSubMesh(0)._primitiveType<n.PT_TRIANGLES) {
      c.effect.LOD = o.noDepthTestForLines?50:0;
    }
  }

  c.setProperty("color",e.modelColor);
  if(c.effect){
    let e=c.effect.getActiveTechnique().passes[0];

    if (o.cullMode) {
      e.setCullMode(o.cullMode);
    }
  }
  r.material = c;
}setMeshColor(e,t){
  e.modelColor.r = t.r;
  e.modelColor.g = t.g;
  e.modelColor.b = t.b;
}getMeshColor(e){return e.modelColor}setNodeOpacity(e,t){e.modelColor.a = t;}getNodeOpacity(e){return e.modelColor.a}getRaycastResults(e,o,n){
  let r=cc.director._renderSystem._scene;t._camera._camera.screenPointToRay(o,n,cc.winSize.width,cc.winSize.height,a);let s=r.raycast(a,e._layer).sort(c);
  s.ray = a;
  return s;
}getModel(e){return e.getComponent(cc.ModelComponent)}updateVBAttr(e,t,o){
  let n = e.getSubMesh(0)._vertexBuffer;
  let r = n[t];

  o.forEach((e,t)=>{
    r[3*t] = e.x;
    r[3*t+1] = e.y;
    r[3*t+2] = e.z;
  });

  n.updateAttr(t);
}getBoudingBox(e){let t=null;if (e instanceof cc.ModelComponent) {
  let n=e.mesh;

  if (n) {
    t = o.fromPoints(o.create(),n.minPosition,n.maxPosition);
  }
} else {
  console.error("target is not a cc.ModelComponent");
}return t}getRootBoneNode(e){let t=null;if (e instanceof cc.SkinningModelComponent) {if(e.skeleton){
  let o=e.skeleton.joints;

  if (o&&o.length>0&&e._skinningTarget) {
    t = e._skinningTarget.get(o[0]);
  }
}} else {
  console.error("target is not a cc.SkinningModelComponent");
}return t}getRootBindPose(e){let t=null;if (e instanceof cc.SkinningModelComponent) {
  let o=e.skeleton;

  if (o) {
    t = o.bindposes[0];
  }
} else {
  console.error("target is not a cc.SkinningModelComponent");
}return t}getCameraData(e){
  let t=null;

  if (e instanceof cc.CameraComponent) {
    (t={}).projection = e.projection;
    t.orthoHeight = e.orthoHeight;
    t.fov = e.fov;
    t.aspect = cc.winSize.width/cc.winSize.height;
    t.near = e.near;
    t.far = e.far;
  } else {
    console.error("target is not a cc.CameraComponent");
  }

  return t;
}setCameraData(e,t){
  if (e instanceof cc.CameraComponent) {
    if (t.fov) {
      e.fov = t.fov;
    }

    if (t.far) {
      e.far = t.far;
    }
  } else {
    console.error("target is not a cc.CameraComponent");
  }
}getLightData(e){
  let t=null;

  if (e instanceof cc.LightComponent) {
    (t={}).type = e.type;
    t.range = e.range;
    t.spotAngle = e.spotAngle;
  } else {
    console.error("target is not a cc.LightComponent");
  }

  return t;
}setLightData(e,t){
  if (e instanceof cc.LightComponent) {
    if (t.range) {
      e.range = t.range;
    }

    if (t.spotAngle) {
      e.spotAngle = t.spotAngle;
    }
  } else {
    console.error("target is not a cc.LightComponent");
  }
}});