let s={};
s[s.fail=0] = "fail";
s[s.success=1] = "success";
s[s.getSecretError=2] = "getSecretError";
s[s.fileNotExists=3] = "fileNotExists";
s[s.fileTooLarge=4] = "fileTooLarge";
exports.ErrorCode = s;
class e{constructor(){this.code = s.fail;}}
exports.CommonRet = e;
exports.AccessTokenRet = class extends e{};
exports.UploadUrlRet = class extends e{};
exports.UploadRet = class extends e{};
exports.UpdateAPKRet = class extends e{};
exports.AppInfo = class{constructor(s){}};
exports.AuditInfo = class{constructor(s){}};
exports.AppInfoRet = class extends e{};