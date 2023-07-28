"use strict";
var r = require("path");
var i = require("fs-extra");

var t = `\n    <h2></h2>\n    <section v-show="isCertExistError">\n      <p  v-bind:error="isCertExistError">${Editor.T(
  "huawei-runtime.cert_is_exist_error"
)}</p>\n       </section>\n    <section>\n    <section>\n         <ui-loader :hidden="!saving" style="background-color: rgba(0, 0, 0, 0.3);"></ui-loader>\n         <ui-prop name="${Editor.T(
  "KEYSTORE.country"
)}" v-bind:error="countryError">\n            <ui-input class="flex-1"v-value="country"></ui-input>\n        </ui-prop>\n\n         <ui-prop name="${Editor.T(
  "KEYSTORE.state"
)}" v-bind:error="stateError">\n            <ui-input class="flex-1"v-value="state"></ui-input>\n        </ui-prop>\n\n        <div class="line"></div>\n\n       <ui-prop name="${Editor.T(
  "KEYSTORE.locality"
)}" v-bind:error="localityError">\n            <ui-input class="flex-1"v-value="locality"></ui-input>\n        </ui-prop>\n\n        <ui-prop name="${Editor.T(
  "KEYSTORE.organization"
)}" v-bind:error="organizationError">\n            <ui-input class="flex-1"v-value="organization"></ui-input>\n        </ui-prop>\n\n         <ui-prop name="${Editor.T(
  "KEYSTORE.organizational_unit"
)}" v-bind:error="organizationalUnitError">\n            <ui-input class="flex-1"v-value="organizationalUnit"></ui-input>\n        </ui-prop>\n\n        <div class="line"></div>\n\n       <ui-prop name="${Editor.T(
  "KEYSTORE.name"
)}" v-bind:error="commonNameError">\n            <ui-input class="flex-1"v-value="commonName"></ui-input>\n        </ui-prop>\n\n        <ui-prop name="Email Address" v-bind:error="emailError">\n            <ui-input class="flex-1"v-value="email"></ui-input>\n        </ui-prop>\n\n         <ui-prop name="${Editor.T(
  "huawei-runtime.save_certificate_path"
)}" v-bind:error="certificatePathError">\n        <ui-input v-value="certificatePath" class="flex-1" placeholder="${Editor.T(
  "huawei-runtime.select_save_certificate_path"
)}"></ui-input>\n        <ui-button class="tiny" v-on:confirm="onChooseIconPath">···</ui-button>\n\n    </section>\n\n    <footer class="group layout horizontal center">\n        <ui-button class="green" v-on:confirm="_onSaveClick">\n            ${Editor.T(
  "SHARED.save"
)}\n        </ui-button>\n    </footer>\n`;

Editor.Panel.extend({
  _vm: null,
  style:
    "\n    :host {\n        overflow: auto;\n    }\n\n    p {\n        justify-content: center;\n        margin: 0 20px;\n        font-size: 20px;\n        color: red;\n        padding-bottom: 15px;\n        border-bottom: 1px solid #666;\n    }\n\n    h2 {\n        margin: 20px 20px 0 20px;\n        font-size: 26px;\n        color: #DDD;\n        padding-bottom: 15px;\n        border-bottom: 1px solid #666;\n    }\n\n    section {\n        margin: 0 10px;\n        padding: 15px;\n    }\n\n    section .line {\n        margin: 8px 0;\n        border-bottom: 1px solid #666;\n    }\n\n    footer {\n        padding: 10px 25px;\n        justify-content: flex-end;\n    }\n\n    ui-prop[error] {\n        border-radius: 6px;\n        box-shadow: inset 0 0 20px 1px red;\n    }\n",
  template: t,
  messages: {},
  ready() {
    window.abc = this._vm = new window.Vue({
      el: this.shadowRoot,
      data: {
        commonName: "",
        saving: false,
        organizationalUnit: "",
        organization: "",
        locality: "",
        state: "",
        country: "",
        email: "",
        certificatePath:
          Editor.Project && Editor.Project.path
            ? Editor.Project.path
            : Editor.projectInfo.path || "",
        commonNameError: false,
        organizationalUnitError: false,
        organizationError: false,
        localityError: false,
        stateError: false,
        countryError: false,
        emailError: false,
        certificatePathError: false,
        isCertExistError: false,
      },
      created: function () {
        this._checkCertExist();
      },
      watch: {
        commonName: {
          handler() {
            this.commonNameError = false;
          },
        },
        organizationalUnit: {
          handler() {
            this.organizationalUnitError = false;
          },
        },
        organization: {
          handler() {
            this.organizationError = false;
          },
        },
        locality: {
          handler() {
            this.localityError = false;
          },
        },
        state: {
          handler() {
            this.stateError = false;
          },
        },
        country: {
          handler() {
            this.countryError = false;
          },
        },
        email: {
          handler() {
            this.emailError = false;
          },
        },
        certificatePath: {
          handler() {
            this.certificatePathError = false;
            this._checkCertExist();
          },
        },
      },
      methods: {
        _checkCertExist() {
          var t = r.join(this.certificatePath, "certificate.pem");
          var o = r.join(this.certificatePath, "private.pem");
          this.isCertExistError = i.existsSync(t) || i.existsSync(o);
        },
        _getProjectPath: () =>
          Editor.Project && Editor.Project.path
            ? Editor.Project.path
            : Editor.projectInfo.path,
        onChooseIconPath(r) {
          r.stopPropagation();
          let i = Editor.Dialog.openFile({
            defaultPath: this._getProjectPath(),
            properties: ["openDirectory"],
            filters: [
              { name: Editor.T("huawei-runtime.select_save_certificate_path") },
            ],
          });

          if (i && i[0]) {
            this.certificatePath = i[0];
          }
        },
        _onSaveClick(r) {
          r.stopPropagation();

          if (!(this.country && 2 == this.country.length)) {
            this.countryError = true;

            Editor.error(
              Editor.T(
                `certificate.error.${Editor.T(
                  "KEYSTORE.country"
                )} only needs 2 letter code`
              )
            );
          }

          if (!this.commonName) {
            this.commonNameError = true;
          }

          if (!this.organizationalUnit) {
            this.organizationalUnitError = true;
          }

          if (!this.organization) {
            this.organizationError = true;
          }

          if (!this.locality) {
            this.localityError = true;
          }

          if (!this.state) {
            this.stateError = true;
          }

          if (!this.email) {
            this.emailError = true;
          }

          if (!this.certificatePath) {
            this.certificatePathError = true;
          }

          if (require("fs").existsSync(this.certificatePath)) {
            this.certificatePathError = false;
          } else {
            this.certificatePathError = true;
          }

          if (!(
            this.commonName ||
            this.organizationalUnit ||
            this.organization ||
            this.locality ||
            this.state ||
            this.country ||
            this.certificatePath
          )) {
            Editor.error(Editor.T("certificate.error.publish_empty"));
            return;
          }
          if (this.passwordError ||
          this.confirmPasswordError ||
          this.aliasError ||
          this.aliasPasswordError ||
          this.confirmAliasPasswordError ||
          this.validityError ||
          this.commonNameError ||
          this.organizationalUnitError ||
          this.organizationError ||
          this.localityError ||
          this.stateError ||
          this.countryError ||
          this.certificatePathError) {
            return;
          }
          let i = this.certificatePath;
          if (i && -1 !== i) {
            if (-1 === process.env.PATH.indexOf("/usr/bin/openssl")) {
              process.env.PATH += ":/usr/bin/openssl";
            }

            var t = this;
            var o = `/C=${this.country}/ST=${this.state}/L=${this.locality}/O=${this.organization}/OU=${this.organizationalUnit}/CN=${this.commonName}/emailAddress=${this.email}`;

            var n = require("path").join(
              Editor.url(
                "packages://runtime-adapters/common/openSSLWin64/bin"
              ),
              "openssl"
            );

            var e = `${
              "win32" === process.platform ? n : "openssl"
            } req -newkey rsa:2048 -nodes -keyout private.pem -x509 -days 3650 -out certificate.pem -subj ${o}`;

            t.saving = true;

            var a = require("path").join(
                Editor.url(
                  "packages://runtime-adapters/common/openSSLWin64/bin"
                ),
                "openssl.cfg"
              );

            var s = "win32" === process.platform
              ? { OPENSSL_CONF: a }
              : process.env;

            (0, require("child_process").exec)(
              `${e}`,
              { env: s, cwd: i },
              (r) => {
                t.saving = false;
                if (r) {
                  Editor.error(
                    Editor.T("huawei-runtime.build_certificate_fail") + r
                  );

                  return;
                }

                Editor.log(
                  Editor.T("huawei-runtime.build_certificate_complet")
                );

                Editor.Ipc.sendToWins(
                  "builder:events",
                  "certificate-created",
                  i
                );

                Editor.Panel.close("huawei-runtime");
              }
            );
          }
        },
      },
    });
  },
});
