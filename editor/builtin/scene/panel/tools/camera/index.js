const e = require("./camera-settings");
const t = require("./2d");
const i = require("./3d");
const n = cc.color(255,0,0,89.25);
const r = cc.color(0,0,255,89.25);
const s = cc.color().fromHEX("#555555");
let a=[.25,.33,.5,.67,.75,.8,.9,1,1.1,1.25,1.5,1.75,2,3,4,5];
const o = cc.gfx;
const c = new o.VertexFormat([{name:o.ATTR_POSITION,type:o.ATTR_TYPE_FLOAT32,num:2},{name:o.ATTR_COLOR,type:o.ATTR_TYPE_UINT8,num:4,normalize:true}]);
let h = Editor.require("app://editor/page/gizmos/utils/transform-tool-data");

let p = {_camera:null,_is2D:true,_operating:null,_operating2D:null,_operating3D:null,_scale:1,get is2D(){return h.is2D},set is2D(e){
  h.is2D = e;

  if (this._operating) {
    this._operating.setActive(false);
  }

  this._operating = e?this._operating2D:this._operating3D;
  this._operating.setActive(true);
  this._camera.ortho = e;
  this.updateCameraSettings();

  if (e) {
    this._gridRenderer.getMaterial(0).effect.setDepth(false);
    this._gridNode.eulerAngles = cc.v3(0,0,0);
  } else {
    this._gridRenderer.getMaterial(0).effect.setDepth(true);
    this._gridNode.eulerAngles = cc.v3(90,0,0);
  }

  this._operating.updateCamera();
},get scale(){return h.scale2D},set scale(e){h.scale2D = e;},get setting(){return this._operating2D&&_Scene.view.$grid?{is2D:this.is2D,operating2D:{scale:this.scale,xAxis:_Scene.view.$grid.xAxisOffset,yAxis:_Scene.view.$grid.yAxisOffset},operating3D:{eye:this._operating3D.eye.clone(),rotation:this._operating3D.rotation.clone()}}:null},set setting(e){
  if (e) {
    this._operating2D.initPosition(e.operating2D.xAxis,e.operating2D.yAxis,e.operating2D.scale);
    this._operating3D.eye.set(e.operating3D.eye);
    this._operating3D.rotation.set(e.operating3D.rotation);
    this.is2D = e.is2D;
    this._operating.updateCamera();
  }
},updateCameraSettings(){
  this._camera.nearClip = this._operating.settings.nearClip;
  this._camera.farClip = this._operating.settings.farClip;
},init(){
  this._camera = this.createCamera();
  this._operating2D = new t;
  this._operating3D = new i;
  this._operating = this._operating2D;
  this._operating3D.init(this);
  this._operating2D.init(this);
  this._initGrid();
  this.is2D = true;
  cc.engine.on("design-resolution-changed",this.onDesignResolutionChanged,this);
  e.onCameraInited(this);
},onDesignResolutionChanged(){this._operating.updateCamera()},onSceneLaunched(){this.adjustToCenter(20)},zoomUp(){let e=this.scale;for (let t=0; t<a.length; t++) {
  if (e<a[t]) {
    return this._operating.zoomTo(a[t])
  }
}},zoomDown(){let e=this.scale;for (let t=a.length-1; t>=0; t--) {
  if (e>a[t]) {
    return this._operating.zoomTo(a[t])
  }
}},zoomReset(){this._operating.zoomTo(1)},createCamera(){
  let e=new cc.Node("Editor Scene Camera");
  e.is3DNode = true;
  let t=e.addComponent(cc.Camera);
  t.alignWithScreen = false;
  t._init();
  t.nearClip = .1;
  t.farClip = 4096;
  t._camera.setStages(["opaque","transparent"]);
  t._camera._cullingMask = 4294967295;
  cc.renderer.scene.addCamera(t._camera);
  return t;
},update(){
  this._updateGrid();
  this._camera.node.position = this._operating.eye;
  this._camera.node.setRotation(this._operating.rotation);
  this._camera.beforeDraw();
  cc.engine.repaintInEditMode();
},_updateGrid(){
  let e = this._gridMesh;
  let t = cc.gfx;
  if (!e) {
    return;
  }
  let i = [];
  let a = [];
  let o = [];
  this._operating._updateGrid(i,a,s,1e6);
  i.push(cc.v2(-1e6,0));
  i.push(cc.v2(1e6,0));
  a.push(n);
  a.push(n);
  i.push(cc.v2(0,-1e6));
  i.push(cc.v2(0,1e6));
  a.push(r);
  a.push(r);
  for (let e=0; e<i.length; e++) {
    o.push(e);
  }
  e.init(c,i.length);
  e.setVertices(t.ATTR_POSITION,i);
  e.setVertices(t.ATTR_COLOR,a);
  e.setIndices(o);
  e.setPrimitiveType(t.PT_LINES);
},_initGrid(){
  let e=new cc.Mesh;
  this._gridMesh = e;
  this._updateGrid();
  let t = new cc.Node("Scene Grid");
  let i = t.addComponent(cc.MeshRenderer);
  i.mesh = e;
  t.is3DNode = true;
  t.parent = _Scene.view.backgroundNode;
  t.zIndex = -cc.macro.MAX_ZINDEX;
  this._gridRenderer = i;
  this._gridNode = t;
}};

["onMouseDown","onMouseWheel","onMouseMove","onMouseUp","onKeyDown","onKeyUp","onResize","adjustSceneToNodes","adjustToCenter"].forEach(e=>{p[e] = function(){return this._operating[e].apply(this._operating,arguments)};});
module.exports = p;