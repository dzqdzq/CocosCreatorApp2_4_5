const a = require("../../package.json");
module.exports = {
  PLATFORM: "huawei-agc",
  PROFILE: "local://channel-upload-tools.json",
  MAX_HISTORY_LENGTH: 5,
  PLUGIN_ID: 1027,
  PLUGIN_SECRET: "3561d0f39ca8157f9fb6324912aa2cf3573a2b41",
  PLUGIN_NAME: a.name,
  LOGIN_TYPE: { client: "client", oauth: "oauth" },
};
