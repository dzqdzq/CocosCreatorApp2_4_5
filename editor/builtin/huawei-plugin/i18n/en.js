module.exports = {
  platform_name: "Huawei Quick Game",
  package: "App Package Name",
  package_hint: "Enter the application package name, such as: com.example.demo",
  name: "App Name",
  name_hint: "Enter an app name",
  desktop_icon: "Desktop Icon",
  desktop_icon_hint: "Select the path to the desktop icon",
  version_name: "App Version Name",
  version_name_hint: "Enter the application version name, such as: 1.0.0",
  version_number: "App Version Number",
  version_number_hint: "Enter the application version number, such as: 1",
  support_min_platform: "Supported Minimum Platform Version Number",
  support_min_platform_hint:
    "Enter the minimum supported platform version number, such as: 1035",
  custom_manifest_file_path: "Custom manifest file path (optional)",
  custom_manifest_file_path_hint: "Select the file path of the custom manifest",
  full_screen: "Whether full screen",
  screen_orientation: "Screen orientation",
  horizontal_screen: "Landscape",
  vertical_screen: "Portrait",
  small_packet_path: "Resource Server Address",
  small_packet_path_hint: "optional fields",
  keystore: "Keystore",
  use_debug_keystore: "Use the debug keystore",
  private_pem_path: "private.pem path",
  private_pem_path_hint: "Select the path of private.pem",
  certificate_pem_path: "certificate.pem path",
  certificate_pem_path_hint: "Select the path of certificate.pem",
  print_finger: "Console print certificate fingerprint",
  custom_manifest_data: "The custom manifest data is:",
  custom_manifest_data_error:
    "Custom manifest data is not in json format, and packaging will not contain custom manifest data.",
  zip_file_error: "Compression failed! error:",
  install_nodejs_before_build_rpk:
    "Packing rpk requires nodejs, please install nodejs",
  begin_install_npm:
    "Start installing the npm package that the game depends on, please be patient...",
  npm_installed_success:
    "The npm package that the fast game relies on is installed!",
  npm_install_fail:
    "The npm package installation that the fast game relies on fails! error:",
  rpk_installing: "Start building rpk packages...",
  rpk_install_fail: "rpk package build failed! error:",
  rpk_install_success: "The rpk package is built!",
  not_mainfest_data:
    "There is currently no custom mainfest file path, the build will not contain custom mainfest data",
  not_empty: "Can not be empty!",
  icon_not_exist: "Under the path, the picture does not exist!",
  signature_not_exist: "path does not exist",
  private_pem_path_error: "private.pem path is empty",
  certificate_pem_path_error: "certificate.pem path is empty",
  save_certificate_path: "save the certification path",
  select_save_certificate_path: "Choose the path to save the certificate",
  build_certificate_complet: "Generate certificate is complete!",
  build_certificate_fail: "Failed to generate the certificate! error:",
  custom_npm_path: "Custom node folder path",
  custom_npm_path_hint: "Choose a custom node folder path",
  custom_npm_path_config:
    "The custom node path is not empty, and the node path will be configured with a custom node path:",
  custom_npm_path_not_config:
    "No custom node path configured, node path will use system environment variable path",
  custom_npm_path_config_error: "Custom node path error, reselect",
  window_default_npm_path_error:
    "The system environment variable node folder path is incorrect. Please configure the system environment variable or customize the node path",
  mac_default_npm_path_error:
    "The read default node path is not found in /usr/local/bin/,please configure custom node folder path",
  choose_json_file: "Select the json file",
  choose_image: "Choose picture",
  select_certificate_path:
    "To view the certificate fingerprint, please select the certificate epath path first",
  install_nodejs_before_view_certificate:
    "Nodejs is required to view certificate fingerprints, please install nodejs or configure a custom NPM path",
  select_certificate_path_after_view_certificate:
    "To view the certificate fingerprint error, select the correct certificate epath path",
  certificate_fingerprint: "Certificate fingerprint:",
  certificate_fingerprint_error: "Printing certificate fingerprint error:",
  use_native_renderer: "use native renderer",
  pack_res_to_first_pack: "Start Scene Asset Bundle",
  pack_res_to_first_pack_contain_subpack_res_error:
    "There are sub-package resources in the first screen, the function may be abnormal",
  had_set_remote_without_tiny_mode:
    "The remote package is currently set and the resource server address is not set",
  cert_is_exist_error:
    "Note: The path to save the certificate already has a certificate",
};
