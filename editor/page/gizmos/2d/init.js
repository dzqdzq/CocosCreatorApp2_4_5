(() => {
  "use strict";
  Editor.GizmosUtils = require("./utils");
  Editor.Gizmo = require("./elements/gizmo");
  _Scene.gizmos.position = require("./elements/transform/position-gizmo");
  _Scene.gizmos.rotate = require("./elements/transform/rotation-gizmo");
  _Scene.gizmos.scale = require("./elements/transform/scale-gizmo");
  _Scene.gizmos.rect = require("./elements/rect-gizmo");
  _Scene.gizmos.trajectory = require("./elements/trajectory");
  _Scene.gizmos["cc.Node"] = require("./elements/node-gizmo");
  _Scene.gizmos.components = {};

  _Scene.gizmos.components[
      "cc.ParticleSystem"
    ] = require("./elements/particle-gizmo");

  _Scene.gizmos.components[
      "cc.BoxCollider"
    ] = require("./elements/collider/box-collider-gizmo");

  _Scene.gizmos.components[
      "cc.CircleCollider"
    ] = require("./elements/collider/circle-collider-gizmo");

  _Scene.gizmos.components[
      "cc.PolygonCollider"
    ] = require("./elements/collider/polygon-collider-gizmo");

  _Scene.gizmos.components[
      "cc.BoxCollider3D"
    ] = require("./elements/collider/box-collider-3d-gizmo");

  _Scene.gizmos.components[
      "cc.SphereCollider3D"
    ] = require("./elements/collider/sphere-collider-3d-gizmo");

  _Scene.gizmos.components[
      "cc.PhysicsCircleCollider"
    ] = require("./elements/collider/circle-collider-gizmo");

  _Scene.gizmos.components[
      "cc.PhysicsChainCollider"
    ] = require("./elements/collider/chain-collider-gizmo");

  _Scene.gizmos.components[
      "cc.PhysicsBoxCollider"
    ] = require("./elements/collider/box-collider-gizmo");

  _Scene.gizmos.components[
      "cc.PhysicsPolygonCollider"
    ] = require("./elements/collider/polygon-collider-gizmo");

  _Scene.gizmos.components[
      "cc.RevoluteJoint"
    ] = require("./elements/joint/revolute-joint-gizmo");

  _Scene.gizmos.components[
      "cc.DistanceJoint"
    ] = require("./elements/joint/distance-joint-gizmo");

  _Scene.gizmos.components[
      "cc.MotorJoint"
    ] = require("./elements/joint/motor-joint-gizmo");

  _Scene.gizmos.components[
      "cc.PrismaticJoint"
    ] = require("./elements/joint/prismatic-joint-gizmo");

  _Scene.gizmos.components[
      "cc.WeldJoint"
    ] = require("./elements/joint/weld-joint-gizmo");

  _Scene.gizmos.components[
      "cc.WheelJoint"
    ] = require("./elements/joint/wheel-joint-gizmo");

  _Scene.gizmos.components[
      "cc.RopeJoint"
    ] = require("./elements/joint/rope-joint-gizmo");

  _Scene.gizmos.components[
      "cc.MeshRenderer"
    ] = require("./elements/components/mesh-renderer-gizmo");

  _Scene.gizmos.components[
      "cc.SkinnedMeshRenderer"
    ] = require("./elements/components/skinned-mesh-renderer-gizmo");

  _Scene.gizmos.components[
      "cc.Camera"
    ] = require("./elements/components/camera-gizmo");

  _Scene.gizmos.components[
      "cc.Light"
    ] = require("./elements/components/light-component-gizmo");

  _Scene.gizmos.components[
      "cc.ParticleSystem3D"
    ] = require("./elements/components/particle-system-component-gizmo");
})();
