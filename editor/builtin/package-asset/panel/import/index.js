var e = require("fire-fs");
var t = require("fire-path");
var s = Editor.require("packages://package-asset/utils.js");
var a = Editor.require("packages://package-asset/parse/import.js");
Editor.require("packages://package-asset/lib/jszip-utils.min.js");
Editor.require("packages://package-asset/lib/jszip.min.js");
const r=Editor.require("packages://package-asset/panel/common/asset-item.js");
Vue.component("package-asset-item",r);

Editor.Panel.extend({style:e.readFileSync(Editor.url("packages://package-asset/panel/style.css"))+"",template:e.readFileSync(Editor.url("packages://package-asset/panel/import/panel.html"))+"",ready(){
  s.init(this.profiles);

  this._vm = new window.Vue({el:this.shadowRoot,created(){
    this.outPath = t.join(Editor.Project.path,"assets");
    this.folderPath = "";
    this._lastfolderPath = "";
  },data:{outPath:"",folderPath:"",filetree:[],progress:0,progressState:s.T("IMPORT_ASSET.progress_state_wait")},watch:{folderPath:{handler(e){
    s.save("import-folder-path",e);
    if (!e) {
      this.filetree = null;
      this.progressState = s.T("IMPORT_ASSET.progress_state_wait");
      return;
    }
    console.time();

    a.analyticalZip(e,(e,t)=>{
      console.timeEnd();
      if (e) {
        this.folderPath = this._lastfolderPath;
        return;
      }
      this.filetree = t;
      this.progressState = s.T("IMPORT_ASSET.progress_state_ready");
    });
  }}},methods:{T:s.T,_isDisabled(){return""===this.folderPath||""===this.outPath||!this.filetree.selected},onChooseImportFolder(){s.showImportZipDialog((e,t)=>{
    this._lastfolderPath = this.folderPath;
    this.folderPath = t;
  })},onChooseOutFolder(){s.showImportOutPathDialog((e,t)=>{this.outPath = t;})},onImport(){a.importZip(this.outPath,this.filetree,e=>{
    this.progress = e.curProgress/e.total*100;
    this.progressState = e.outStrLog;
  })}}});
}});