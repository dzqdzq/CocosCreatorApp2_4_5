"use strict";
let e = {};
module.exports = e;
e.position = require("./elements/transform/position-gizmo");
e.rotation = require("./elements/transform/rotation-gizmo");
e.scale = require("./elements/transform/scale-gizmo");
e.components = {};

e.components[
    "cc.LightComponent"
  ] = require("./elements/components/light-component-gizmo");

e.components[
    "cc.ModelComponent"
  ] = require("./elements/components/model-component-gizmo");

e.components[
    "cc.SkinningModelComponent"
  ] = require("./elements/components/skinning-model-component-gizmo");

e.components[
    "cc.CameraComponent"
  ] = require("./elements/components/camera-component-gizmo");

e.components[
    "cc.ParticleSystem3D"
  ] = require("./elements/components/particle-system-component-gizmo");

e.components[
    "cc.BoxCollider3D"
  ] = require("./elements/components/colliders/box-collider-component-gizmo");

e.components[
    "cc.SphereCollider3D"
  ] = require("./elements/components/colliders/sphere-collider-component-gizmo");
