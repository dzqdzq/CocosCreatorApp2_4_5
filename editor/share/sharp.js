let r;
r = Editor.dev ? "sharp" : Editor.url("unpack://utils/sharp");
module.exports = require(r);
