"use strict";let e=require("./engine-interface");
const t = Editor.require("packages://scene/panel/tools/camera");
const r = require("../../3d/elements/utils/controller-shape-collider");
let n = require("../external").GeometryUtils.aabb;
let o = cc.gfx;
function i(e,t){let r=e.getComponent(cc.MeshRenderer);if(r){
  let e=r.getMaterial(0);

  if (e) {
    e.setProperty("diffuseColor",t);
  }
}}let s={};function c(e){if(!s[e]){let t=cc.assetManager.builtins.getBuiltin("effect",e);s[e] = cc.Material.create(t);}return cc.MaterialVariant.create(s[e])}let a={ORTHO:0,PERSPECTIVE:1};

module.exports = new (class extends e {constructor(){
  super();
  this.gfx = o;
  this.ProjectionType = a;
}create3DNode(e){
  let t=new cc.Node(e);
  t.is3DNode = true;
  t._objFlags |= cc.Object.Flags.DontSave|cc.Object.Flags.HideInHierarchy;
  return t;
}createMesh(e){
  let t = new cc.Mesh;
  let r = [{name:o.ATTR_POSITION,type:o.ATTR_TYPE_FLOAT32,num:3}];

  if (e.normals) {
    r.push({name:o.ATTR_NORMAL,type:o.ATTR_TYPE_FLOAT32,num:3});
  }

  let n=new o.VertexFormat(r);
  t.init(n,e.positions.length,true);
  t.setVertices(o.ATTR_POSITION,e.positions);

  if (e.normals) {
    t.setVertices(o.ATTR_NORMAL,e.normals);
  }

  t.setIndices(e.indices);

  if (e.minPos) {
    t._minPos = e.minPos;
  }

  if (e.maxPos) {
    t._maxPos = e.maxPos;
  }

  if (void 0!==e.primitiveType) {
    t.setPrimitiveType(e.primitiveType);
  }

  return t;
}addMeshToNode(e,t,r={}){
  let n=e.addComponent(cc.MeshRenderer);
  n.mesh = t;
  let i=c("__builtin-editor-gizmo-unlit");

  if (r.unlit) {
    if (i.effect) {
      i.effect.setDepth(false);
    }
  } else {
    if (t.subMeshes[0]._primitiveType<o.PT_TRIANGLES) {
      if (r.noDepthTestForLines) {
        if (i.effect) {
          i.effect.setDepth(false);
        }
      } else {
        i = c("__builtin-editor-gizmo-line");
      }
    } else {
      i = c("__builtin-editor-gizmo");
    }
  }

  if (i&&i.effect&&r.cullMode) {
    i.effect.setCullMode(r.cullMode);
  }

  n.setMaterial(0,i);
}setMeshColor(e,t){
  e.color = t;
  let r=t.clone();
  r.a = e.opacity;
  i(e,r);
}getMeshColor(e){return e.color}setNodeOpacity(e,t){
  e.opacity = t;
  let r=e.color;
  r.a = t;
  i(e,r);
}getNodeOpacity(e){return e.opacity}getRaycastResults(e,n,i){
  let s = t._camera.getRay(cc.v3(n,i,1));

  let c = cc.geomUtils.intersect.raycast(e,s,(e,t,n)=>{let i=t.getComponent(r);if(i&&i.isDetectMesh){
    let r = t.getComponent(cc.MeshRenderer);
    let n = r.mesh._subMeshes;
    if (r&&r.mesh&&n&&n[0]._primitiveType===o.PT_TRIANGLES) {
      return cc.geomUtils.intersect.rayMesh(e,r.mesh)
    }
  }return n},function(e){return null!=e.getComponent(cc.MeshRenderer)&&false!==e.active;});

  c.ray = s;
  return c;
}getModel(e){return e.getComponent(cc.MeshRenderer)}updateVBAttr(e,t,r){e.setVertices(t,r)}getBoudingBox(e){let t=null;if (e instanceof cc.MeshRenderer) {
  let r=e.mesh;

  if (r) {
    t = n.fromPoints(n.create(),r._minPos,r._maxPos);
  }
} else {
  console.error("target is not a cc.MeshRenderer");
}return t}getRootBoneNode(e){let t=null;if (e instanceof cc.SkinnedMeshRenderer) {
  let r=e._joints;

  if (r&&r.length>0) {
    t = r[0];
  }
} else {
  console.error("target is not a cc.SkinnedMeshRenderer");
}return t}getRootBindPose(e){let t=null;if (e instanceof cc.SkinnedMeshRenderer) {
  let r=e.skeleton;

  if (r) {
    t = r.bindposes[0];
  }
} else {
  console.error("target is not a cc.SkinnedMeshRenderer");
}return t}getCameraData(e){let t=null;if (e instanceof cc.Camera) {
  t = {};

  if (e.ortho) {
    t.projection = a.ORTHO;
  } else {
    t.projection = a.PERSPECTIVE;
  }

  let r = cc.engine.getDesignResolutionSize();
  let n = e._camera;
  t.orthoHeight = n.getOrthoHeight();
  t.fov = 180*n.getFov()/Math.PI;
  t.aspect = r.width/r.height;
  t.near = e.nearClip;
  t.far = e.farClip;
} else {
  console.error("target is not a cc.Camera");
}return t}setCameraData(e,t){
  if (e instanceof cc.Camera) {
    if (t.fov) {
      e.fov = t.fov;
    }

    if (t.far) {
      e.farClip = t.far;
    }

    if (t.orthoHeight) {
      e.orthoSize = t.orthoHeight;
    }
  } else {
    console.error("target is not a cc.Camera");
  }
}getLightData(e){
  let t=null;

  if (e instanceof cc.Light) {
    (t={}).type = e.type;
    t.range = e.range;
    t.spotAngle = e.spotAngle;
  } else {
    console.error("target is not a cc.Light");
  }

  return t;
}setLightData(e,t){
  if (e instanceof cc.Light) {
    if (t.range) {
      e.range = t.range;
    }

    if (t.spotAngle) {
      e.spotAngle = t.spotAngle;
    }
  } else {
    console.error("target is not a cc.Light");
  }
}});