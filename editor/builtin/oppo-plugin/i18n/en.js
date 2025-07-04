module.exports = {
  platform_name: "OPPO Mini Game",
  package: "Game Package Name",
  package_hint: "Enter the name of the game package, such as: com.example.demo",
  name: "Game Name",
  name_hint: "enter the name of the game",
  desktop_icon: "Desktop Icon",
  desktop_icon_hint: "Select the path to the desktop icon",
  version_name: "Game version name",
  version_name_hint: "Enter the game version name, such as: 1.0.0",
  version_number: "Game version number",
  version_number_hint: "Enter the game version number, such as: 1",
  support_min_platform: "Supported Minimum Platform Version Number",
  support_min_platform_hint:
    "Enter the minimum supported platform version number, such as: 1011",
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
    "The npm package that the min game relies on is installed!",
  npm_install_fail:
    "The npm package installation that the min game relies on fails! error:",
  rpk_installing: "Start building rpk packages...",
  rpk_install_fail: "rpk package build failed!",
  rpk_install_success:
    "The rpk package is built and the location is generated:",
  not_mainfest_data:
    "There is currently no custom mainfest file path, the build will not contain custom mainfest data",
  not_empty: "Can not be empty!",
  icon_not_exist: "Under the path, the picture does not exist!",
  signature_not_exist: "path does not exist",
  private_pem_path_error: "private.pem path is empty",
  certificate_pem_path_error: "certificate.pem path is empty",
  select_pic: "Select Image",
  building_subpack_rpk: "Start building sub-package rpk...",
  build_subpack_rpk_error: "building sub-package rpk failed! ",
  build_subpack_rpk_complet: "building sub-package rpk is completed! position:",
  package_name_error:
    "Please enter the correct package name: start with a letter and cannot contain characters -",
  build_certificate_complet: "Generate certificate is complete!",
  build_certificate_fail: "Failed to generate the certificate! error:",
  build_certificate_complet: "Generate certificate is complete!",
  build_certificate_fail: "Failed to generate the certificate! error:",
  save_certificate_path: "Save the certification path",
  select_save_certificate_path:
    "Please choose the path to save the certificate",
  custom_npm_path: "Custom npm folder path",
  custom_npm_path_hint: "Choose a custom npm folder path",
  custom_npm_path_config:
    "The custom npm path is not empty, and the npm path will be configured with a custom npm path:",
  custom_npm_path_not_config:
    "No custom npm path configured, npm path will use system environment variable path",
  custom_npm_path_config_error: "Custom npm path error, reselect",
  not_install_nodejs_windows_error:
    "The system environment variable node path is incorrect. Please configure the system environment variable or customize the node path",
  not_install_nodejs_mac_error:
    "The read default node path is not found in /usr/local/bin/,please configure custom node folder path",
  pack_res_to_first_pack: "Start Scene Asset Bundle",
  pack_res_to_first_pack_contain_subpack_res_error:
    "There are sub-package resources in the first screen, the function may be abnormal",
  had_set_remote_without_tiny_mode:
    "The remote package is currently set and the resource server address is not set",
  cert_is_exist_error:
    "Note: The path to save the certificate already has a certificate",
  separate_engine: "Separate Engine",
  separate_engine_begin_hint: "separate engine begin",
  separate_engine_end_hint: "separate engine end",
};
