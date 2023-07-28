"use strict";
const i = require("fire-fs");
const r = require("fire-path");
const t = Editor.require("app://editor/share/build-utils");
var o = `\n    <h2></h2>\n    <section>\n         <ui-loader :hidden="!saving" style="background-color: rgba(0, 0, 0, 0.3);"></ui-loader>\n         <ui-prop name="${Editor.T(
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
)}" v-bind:error="commonNameError">\n            <ui-input class="flex-1"v-value="commonName"></ui-input>\n        </ui-prop>\n\n        <ui-prop name="Email Address" v-bind:error="emailError">\n            <ui-input class="flex-1"v-value="email"></ui-input>\n        </ui-prop>\n\n        <ui-prop name="${Editor.T(
  "xiaomi-runtime.save_certificate_path"
)}" v-bind:error="certificatePathError">\n            <ui-input v-value="certificatePath" class="flex-1" placeholder="${Editor.T(
  "xiaomi-runtime.select_save_certificate_path"
)}"></ui-input>\n            <ui-button class="tiny" v-on:confirm="onChooseCertificatePath">···</ui-button>\n        </ui-prop>\n\n    </section>\n\n    <footer class="group layout horizontal center">\n        <ui-button class="green" v-on:confirm="_onSaveClick">\n            ${Editor.T(
  "SHARED.save"
)}\n        </ui-button>\n    </footer>\n`;
Editor.Panel.extend({
  _vm: null,
  style:
    "\n    :host {\n        overflow: auto;\n    }\n\n    h2 {\n        margin: 20px 20px 0 20px;\n        font-size: 26px;\n        color: #DDD;\n        padding-bottom: 15px;\n        border-bottom: 1px solid #666;\n    }\n\n    section {\n        margin: 0 10px;\n        padding: 15px;\n    }\n\n    section .line {\n        margin: 8px 0;\n        border-bottom: 1px solid #666;\n    }\n\n    footer {\n        padding: 10px 25px;\n        justify-content: flex-end;\n    }\n\n    ui-prop[error] {\n        border-radius: 6px;\n        box-shadow: inset 0 0 20px 1px red;\n    }\n",
  template: o,
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
        certificatePath: Editor.Project.path,
        commonNameError: false,
        organizationalUnitError: false,
        organizationError: false,
        localityError: false,
        stateError: false,
        countryError: false,
        emailError: false,
        certificatePathError: false,
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
          },
        },
      },
      methods: {
        _getProjectPath() {
          let r = Editor.Project.path;
          i.ensureDirSync(r);
          return r;
        },
        onChooseCertificatePath(i) {
          i.stopPropagation();
          let r = Editor.Dialog.openFile({
            defaultPath: this._getProjectPath(),
            properties: ["openDirectory"],
            filters: [
              { name: Editor.T("xiaomi-runtime.select_save_certificate_path") },
            ],
          });

          if (r && r[0]) {
            this.certificatePath = r[0];
          }
        },
        _judgeEmpty(i, r) {
          var t = false;

          if (!(i && 0 != i.trim().length)) {
            t = true;
            Editor.error(Editor.T(`certificate.error.${r} Can't be empty`));
          }

          return t;
        },
        _onSaveClick(o) {
          o.stopPropagation();

          if (!(this.country && 2 == this.country.trim().length)) {
            this.countryError = true;

            Editor.error(
              Editor.T(
                `certificate.error.${Editor.T(
                  "KEYSTORE.country"
                )} only needs 2 letter code`
              )
            );
          }

          this.commonNameError = this._judgeEmpty(
              this.commonName,
              Editor.T("KEYSTORE.name")
            );

          this.organizationalUnitError = this._judgeEmpty(
              this.organizationalUnit,
              Editor.T("KEYSTORE.organizational_unit")
            );

          this.organizationError = this._judgeEmpty(
              this.organization,
              Editor.T("KEYSTORE.organization")
            );

          this.localityError = this._judgeEmpty(
              this.locality,
              Editor.T("KEYSTORE.locality")
            );

          this.stateError = this._judgeEmpty(
              this.state,
              Editor.T("KEYSTORE.state")
            );

          this.emailError = this._judgeEmpty(this.email, "email");

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

          if (
            (this.certificatePath)
          ) {
            let i = Editor.Profile.load("local://builder.json").get(
              "buildPath"
            );
            i = t.getAbsoluteBuildPath(i);
            if (this.certificatePath.startsWith(i)) {
              Editor.error("certificate can't be saved in the build path");
              return;
            }
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
          let n;
          let e;
          let a = this.certificatePath;

          if (!i.existsSync(a)) {
            i.ensureDirSync(a);
          }

          if ("win32" === process.platform) {
            let i = Editor.url(
              "packages://adapters/platforms/xiaomi/res/openSSLWin64/bin"
            );
            n = r.join(i, "openssl");
            e = { OPENSSL_CONF: r.join(i, "openssl.cfg") };
          } else {
            if (-1 === process.env.PATH.indexOf("/usr/bin/openssl")) {
              process.env.PATH += ":/usr/bin/openssl";
            }

            n = "openssl";
            e = process.env;
          }
          var s = this;
          var l = `${n} req -newkey rsa:2048 -nodes -keyout private.pem -x509 -days 3650 -out certificate.pem -subj ${`/C=${this.country}/ST=${this.state}/L=${this.locality}/O=${this.organization}/OU=${this.organizationalUnit}/CN=${this.commonName}/emailAddress=${this.email}`}`;
          s.saving = true;

          (0, require("child_process").exec)(
            `${l}`,
            { env: e, cwd: a },
            (i) => {
              s.saving = false;
              if (!i) {
                Editor.log(
                  Editor.T("xiaomi-runtime.build_certificate_complet")
                );

                Editor.Ipc.sendToWins(
                  "builder:events",
                  "certificate-created",
                  a
                );

                return;
              }
              Editor.error(
                Editor.T("xiaomi-runtime.build_certificate_fail") + i
              );
            }
          );
        },
      },
    });
  },
});
