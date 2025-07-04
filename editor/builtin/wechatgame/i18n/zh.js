module.exports = {
  platform_name: "微信小游戏",
  client_path_error: "找不到微信开发程序路径 [%{path}]。",
  remote_server_address: "资源服务器地址",
  remote_server_address_tips:
    "用于下载远程资源的服务器地址，由于微信小游戏限制原生包为 4MB，如果超过的话可以把构建后的 remote 目录存放到服务器进行下载",
  sub_context: "开放数据域代码目录",
  sub_context_tips:
    "该目录需要包含自身的文件名，构建后会自动配置到 game.json 中。",
  separate_engine: "允许分离引擎",
  separate_engine_tips:
    "该功能是通过共享全局引擎，来减小每个小游戏的首包大小。启用后，如果引擎在手机中已经有缓存，首包下载时将会自动剔除引擎文件，加载手机中缓存的完整版引擎。如果手机中没有缓存，将会加载完整首包，完整首包里会包含剔除后的引擎（该功能仅支持 Cocos Creator 正式版本和非调试模式）",
};
