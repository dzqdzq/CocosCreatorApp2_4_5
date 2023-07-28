const n = require("@cloudbase/manager-node");
const t = require("fs");
const e = require("./utils");
const a = require("compressing");
const i = require("request");
const r = '\n{\n  "name": "#{func_name}",\n  "version": "1.0.0",\n  "main": "index.js",\n  "dependencies": {\n    "@cloudbase/node-sdk": "^2.5.0"\n  }\n}\n';
const o = "\n'use strict';\nconst tcb = require('@cloudbase/node-sdk');\nconst app = tcb.init();\nconst auth = app.auth();\nconst db = app.database();\nexports.main = async (event, context) => {\n  console.log(\"Hello World\");\n  console.log(event);\n  console.log(event[\"non-exist\"]);\n  console.log(context);\n  return event;\n};\n";
const c = "\nResources:\n  #{env_id}:\n    Type: TencentCloud::Serverless::Namespace\n    #{func_name}:\n      Properties:\n        CodeUri: .\n        Description: ''\n        Environment:\n          Variables: {}\n        Events: {}\n        Handler: index.main\n        MemorySize: 256\n        Role: TCB_QcsRole\n        Runtime: Nodejs10.15\n        Timeout: 20\n        VpcConfig:\n          SubnetId: ''\n          VpcId: ''\n      Type: TencentCloud::Serverless::Function\n";

module.exports = {
  inited: false,
  app: {},
  onError(n) {
    if (this.onTCBError) {
      this.onTCBError(n);
    }
  },
  async init(t) {
    this.app = null;
    try {
      this.app = new n(t);
    } catch (n) {
      return;
    }
    var a = await this.app.env.listEnvs().catch((n) => this.onError(n));
    this.app.getEnvironmentManager().remove("");
    if ((a)) {
      for (var i of a.EnvList) this.app.getEnvironmentManager().add(i.EnvId);
      var r = e.getCurrentEnvId();

      if ("undefinedenv" === r) {
        r = a.EnvList[0] && a.EnvList[0].EnvId;
      }

      this.app.getEnvironmentManager().switchEnv(r);
      this.inited = true;
    }
  },
  switchEnv(n) {
    return this.app.getEnvironmentManager().switchEnv(n);
  },
  async listEnvs() {
    return await this.app.env.listEnvs().catch((n) => this.onError(n));
  },
  async createEnv(n, t = "postpay", e = "") {
    return await this.app.env
      .createEnv({ name: n, paymentMode: t, channel: e })
      .catch((n) => this.onError(n));
  },
  async getEnvAuthDomains() {
    return await this.app.env.getEnvAuthDomains().catch((n) => this.onError(n));
  },
  async createEnvDomain(n) {
    return await this.app.env.createEnvDomain(n).catch((n) => this.onError(n));
  },
  async deleteEnvDomain(n) {
    return await this.app.env.deleteEnvDomain(n).catch((n) => this.onError(n));
  },
  async getEnvInfo() {
    return await this.app.env.getEnvInfo().catch((n) => this.onError(n));
  },
  async updateEnvInfo(n) {
    return await this.app.env.updateEnvInfo(n).catch((n) => this.onError(n));
  },
  async getLoginConfigList() {
    return await this.app.env
      .getLoginConfigList()
      .catch((n) => this.onError(n));
  },
  async createLoginConfig(n, t, e) {
    return await this.app.env
      .createLoginConfig(n, t, e)
      .catch((n) => this.onError(n));
  },
  async updateLoginConfig(n, t = "ENABLE", e = "", a = "") {
    return await this.app.env
      .updateLoginConfig(n, t, e, a)
      .catch((n) => this.onError(n));
  },
  async createCustomLoginKeys() {
    return await this.app.env.createCustomLoginKeys();
  },
  async listFunctions() {
    return (
      await this.app.functions
        .getFunctionList(50, 0)
        .catch((n) => this.onError(n))
    ).Functions;
  },
  async createFunction(n, a, i, s) {
    var u = await this.getEnvInfo();
    if (
      0 ===
      (await this.listFunctions()).filter((t) => t.FunctionName === n.name)
        .length
    ) {
      (function (n, a, i) {
        var s = `${n}/${a}`;

        if (!t.existsSync(s)) {
          e.mkdirs(s);
          t.writeFileSync(`${s}/package.json`, r.replace(/#{func_name}/g, a));
          t.writeFileSync(`${s}/index.js`, o.replace(/#{env_id}/g, i));

          t.writeFileSync(
            `${s}/template.ymal`,
            c.replace(/#{env_id}/g, i).replace(/#{func_name}/g, a)
          );

          console.log("创建成功");
        }
      })(a, n.name, u.EnvInfo.EnvId);
      var p = await this.app.functions
        .createFunction({
          func: n,
          functionRootPath: a,
          force: i,
          base64Code: s,
        })
        .catch((n) => this.onError(n));
      await this.downloadFunction(n.name, a);
      return { res: p, isCreate: true };
    }
    return { res: await this.downloadFunction(n.name, a), isCreate: false };
  },
  async downloadFunction(n, e) {
    var r = await this.app.functions
        .getFunctionDownloadUrl(n)
        .catch((n) => this.onError(n));

    var o = `${e}/${n}.zip`;
    return new Promise((c, s) => {
      (function (n, e, a) {
        var r = 0;
        var o = 0;
        var c = 0;

        var s = i({
          method: "GET",
          uri: n,
          agentOptions: { ciphers: "ALL", secureProtocol: "TLSv1_method" },
        });

        var u = t.createWriteStream(e);
        s.pipe(u);

        s.on("response", (n) => {
          if (200 !== n.statusCode) {
            a(new Error(n.statusMessage), null);
            return;
          }
          r = parseInt(n.headers["content-length"], 10);
        });

        s.on("data", (n) => {
          var t = (((o += n.length) / r) * 100) | 0;

          if (c !== t) {
            c = t;
            a(null, { status: "downloading", progress: t });
          }
        });

        s.on("complete", () => {
          a(null, { status: "complete", progress: c });
        });

        s.on("error", (n) => {
          a(n, null);
        });
      })(r.Url, o, (i, r) => {
        if (!(i || "complete" !== r.status)) {
          a.zip
            .uncompress(o, `${e}/${n}/`)
            .then(() => {
            if (t.existsSync(o)) {
              t.unlinkSync(o);
            }

            c();
          })
            .catch((n) => {});
        }
      });
    });
  },
  async updateFunctionCode(n, t, e) {
    var a = n.name;
    return 0 ===
      (await this.listFunctions()).filter((n) => n.FunctionName === a).length
      ? await this.app.functions
          .createFunction({
            func: {
              name: a,
              timeout: 20,
              envVariables: {},
              runtime: "Nodejs8.9",
              installDependency: true,
              isWaitInstall: true,
              triggers: [],
              ignore: [],
            },
            functionRootPath: `${t}/`,
            force: true,
            base64Code: e,
          })
          .catch((n) => this.onError(n))
      : await this.app.functions
          .updateFunctionCode({ func: n, functionRootPath: t, base64Code: e })
          .catch((n) => this.onError(n));
  },
  async updateFunctionConfig(n) {
    return await this.app.functions
      .updateFunctionConfig(n)
      .catch((n) => this.onError(n));
  },
  async deleteFunction(n) {
    return await this.app.functions
      .deleteFunction(n)
      .catch((n) => this.onError(n));
  },
  async getFunctionDetail(n) {
    return await this.app.functions
      .getFunctionDetail(n)
      .catch((n) => this.onError(n));
  },
  async invokeFunction(n, t) {
    return await this.app.functions
      .invokeFunction(n, t)
      .catch((n) => this.onError(n));
  },
  async getFunctionLogs(n) {
    return await this.app.functions
      .getFunctionLogs(n)
      .catch((n) => this.onError(n));
  },
  async copyFunction(n, t, e = "", a = false) {
    return await this.app.functions
      .copyFunction(n, t, e, a)
      .catch((n) => this.onError(n));
  },
  async createFunctionTriggers(n, t) {
    return await this.app.functions
      .createFunctionTriggers(n, t)
      .catch((n) => this.onError(n));
  },
  async deleteFunctionTrigger(n, t) {
    return await this.app.functions
      .deleteFunctionTrigger(n, t)
      .catch((n) => this.onError(n));
  },
  async createSafetySource(n, t = "") {
    if ("undefinedenv" !== t) {
      if (!(null !== t && "" !== t)) {
        t = this.app.env.envId;
      }

      await this.app
        .commonService()
        .call({
          Action: "CreateSafetySource",
          Param: { EnvId: t, AppName: n },
        })
        .catch((n) => this.onError(n));

      return (await this.describeSafetySource()).Data.filter(
        (t) => t.AppName === n
      )[0];
    }
  },
  async describeSafetySource(n) {
    if ("undefinedenv" !== n) {
      if (!(null !== n && "" !== n)) {
        n = this.app.env.envId;
      }

      return await this.app
        .commonService()
        .call({
          Action: "DescribeSafetySource",
          Param: { EnvId: n, Offset: 0, Limit: 100 },
        })
        .catch((n) => this.onError(n));
    }
  },
  async describeSafetySourceSecretKey(n, t = "") {
    if ("undefinedenv" !== t) {
      if (!(null !== t && "" !== t)) {
        t = this.app.env.envId;
      }

      return await this.app
        .commonService()
        .call({
          Action: "DescribeSafetySourceSecretKey",
          Param: { EnvId: t, ItemId: n },
        })
        .catch((n) => this.onError(n));
    }
  },
  async deleteSafetySource(n, t = "") {
    if ("undefinedenv" !== t) {
      if (!(null !== t && "" !== t)) {
        t = this.app.env.envId;
      }

      return await this.app
        .commonService()
        .call({
          Action: "DeleteSafetySource",
          Param: { EnvId: t, ItemId: n },
        })
        .catch((n) => this.onError(n));
    }
  },
};
