module.exports = {
  platform_name: "ByteDance Mini Game",
  client_path_error:
    "Can not launch ByteDance game develop program, file doesn't exist in path: %{path}.",
  remote_server_address: "Resource Server Address",
  remote_server_address_tips:
    "The address of the server used to download the remote resources. Because the ByteDance game limits the native package size to 4MB, if it is greater than that, please upload 'remote' folder to the server for download.",
  sub_context: "Open Data Context Root",
  sub_context_tips:
    "The Open Data Context is also called Sub Domain. Here is the code directory that specifies the open data context. It is automatically configured in game.json.",
  separate_engine: "Separate Engine",
  separate_engine_tips:
    "This feature reduces the size of the first package for each mini-game by sharing the global engine. When enabled, if the engine already has a cache in the phone, the first package download will automatically remove the engine file and load the full version of the engine cached in the phone. If there is no cache in the phone, the full first package will be loaded, and the complete first package will contain the culled engine (this feature only supports the official version of Cocos Creator and non-debug mode)",
};
