"use strict";
Editor.Panel.extend({
  _vm: null,
  style:
    "\n    :host {\n        overflow: auto;\n    }\n\n    h2 {\n        margin: 20px 20px 0 20px;\n        font-size: 26px;\n        color: #DDD;\n        padding-bottom: 15px;\n        border-bottom: 1px solid #666;\n    }\n\n     h4 {\n        margin: 20px 20px 0 20px;\n        font-size: 20px;\n        color: #F00;\n        padding-bottom: 15px;\n        border-bottom: 1px solid #666;\n    }\n\n     h6 {\n        margin: 20px 20px 0 20px;\n        font-size: 18px;\n        color: #DDD;\n        padding-bottom: 15px;\n    }\n\n      h7{\n        margin: 23px 20px 0 20px;\n        font-size: 15px;\n        color: #DDD;\n        padding-bottom: 15px;\n    }\n       h8{\n        margin: 0px 0px 0 0px;\n        font-size: 15px;\n        color: #DDD;\n        padding-bottom: 15px;\n    }\n\n\n       span {\n        margin: 20px 20px 0 20px;\n        font-size: 26px;\n        color: #DDD;\n        padding-bottom: 15px;\n        border-bottom: 1px solid #666;\n    }\n\n    section {\n        margin: 0 10px;\n        padding: 15px;\n    }\n\n    section .line {\n        margin: 8px 0;\n        border-bottom: 1px solid #666;\n    }\n\n    footer {\n        padding: 10px 25px;\n        justify-content: flex-end;\n    }\n\n    ui-prop[error] {\n        border-radius: 6px;\n        box-shadow: inset 0 0 20px 1px red;\n    }\n",
  template:
    '\n    <section>\n       <ui-loader :hidden="!saving" style="background-color: rgba(0, 0, 0, 0.3);"></ui-loader>\n       <h4>{{warning}} </h4>\n\n       <h6>Fingerprint</h6>\n       <div>\n       <h8 class="flex-1">{{fingerprint}}</h8>\n       <ui-button class="tiny" v-on:confirm="_onCopyClick">copy</ui-button>\n       </div>\n\n       <h6>Private.pem</h6>\n       <h7>{{privatePemPath}}</h7>\n\n       <h6>Certificate.pem</h6>\n       <h7>{{certificatePemPath}}</h7>\n\n<ui-prop name="更多信息 <" foldable>\n\n    \x3c!--需要使用嵌套子组件的方式，将子组件放置在 class 样式为 child 的元素中--\x3e\n    <div class="child">\n        <ui-prop name="foldable test..." readonly type="string"></ui-prop>\n        <ui-prop name="foldable test..." readonly type="string"></ui-prop>\n    </div>\n</ui-prop>\n\n    </section>\n\n    <footer class="group layout horizontal center">\n        <ui-button class="green" v-on:confirm="_onCloseClick">\n           关闭\n        </ui-button>\n    </footer>\n',
  messages: {},
  run(n) {
    Editor.log("run======");
    this.finger = "无证书路径";
    this.privatePemPath = "无证书路径";
    this.certificatePemPath = "无证书路径";
    if (n && n.certificatePemPath && n.privatePemPath) {
      this.certificatePemPath = null;
      this.privatePemPath = null;

      if (n &&
        n.certificatePemPath) {
        this.certificatePemPath = n.certificatePemPath;
        Editor.log("certificatePemPath:" + this.certificatePemPath);
      }

      if (n &&
        n.privatePemPath) {
        this.privatePemPath = n.privatePemPath;
        Editor.log("privatePemPath:" + this.privatePemPath);
      }

      var t = require("child_process").exec;

      if ("win32" !== process.platform &&
          -1 === process.env.PATH.indexOf("/usr/local/bin/")) {
        process.env.PATH += ":/usr/local/bin/";
      }

      if ("win32" !== process.platform &&
        !fs.existsSync(path.join("/usr/local/bin/", "node"))) {
        Editor.log(new Error("查看证书指纹需要nodejs,请安装nodejs"));
        return;
      }
      var e = Editor.url("packages://huawei-runtime/package/print-cert-fp.js");
      var i = Editor.url("packages://huawei-runtime/package");
      var o = `node ${e}  ${this.certificatePemPath}`;
      Editor.log("cmdbatch:", o);

      t(o, { env: process.env, cwd: i }, (n, t) => {
        if (!n) {
          this.finger = t;
          Editor.log("stdoout:", t);

          this._vm = new window.Vue({
            el: this.shadowRoot,
            data: {
              warning: "Fingerprint包含工程相关信息，请勿随意传播",
              fingerprint: this.finger,
              privatePemPath: this.privatePemPath,
              certificatePemPath: this.certificatePemPath,
            },
            methods: {
              onChooseIconPath(n) {
                n.stopPropagation();
                let t = Editor.Dialog.openFile({
                  defaultPath:
                    Editor.Project && Editor.Project.path
                      ? Editor.Project.path
                      : Editor.projectInfo.path,
                  properties: ["openDirectory"],
                  filters: [{ name: "选择保存证书的路径" }],
                });

                if (t && t[0]) {
                  this.certificatePath = t[0];
                }
              },
              _onCloseClick(n) {
                Editor.Panel.close("huawei-runtime.fingerprint");
              },
              _onCopyClick() {},
            },
          });

          return;
        }
        Editor.log(new Error(`查看证书指纹错误：${n}`));
      });
    }
  },
});
