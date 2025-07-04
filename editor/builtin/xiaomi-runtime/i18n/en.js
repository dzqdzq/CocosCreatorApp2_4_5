module.exports = {
  platform_name: "Xiaomi Quick Game",
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
    "Enter the minimum supported platform version number, such as: 1050",
  custom_manifest_file_path: "Custom manifest file path (optional)",
  custom_manifest_file_path_hint: "Select the file path of the custom manifest",
  full_screen: "Whether full screen",
  screen_orientation: "Screen Orientation",
  horizontal_screen: "Landscape",
  vertical_screen: "Portrait",
  small_packet_path: "Resource Server Address",
  small_packet_path_hint:
    "Please upload 'remote' folder to this server after build.",
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
  log_level: "Print log level",
  select_pic: "Select Image",
  select_certificate_pem_path: " Enter the certificate.pem path",
  select_private_pem_path: " Enter the private.pem path",
  save_certificate_path: "Enter the certification path",
  select_save_certificate_path: "choose the path to save the certificate",
  not_install_nodejs_windows_error:
    "Export Vivo game The project directory is complete. Since you have not installed or configured the nodejs environment variable, you cannot build the rpk package!",
  not_install_nodejs_mac_error:
    "Export Vivo game The project directory is complete. Since you have not installed nodejs, you cannot build the rpk package!",
  installing_npm_network:
    "Start installing the npm package that the game depends on, please be patient... (requires network)",
  build_certificate_complet: "Generate certificate is complete!",
  build_certificate_fail: "Failed to generate the certificate! error:",
  custom_npm_path: "Custom npm folder path",
  custom_npm_path_hint: "Choose a custom npm folder path",
  custom_npm_path_config:
    "The custom npm path is not empty, and the npm path will be configured with a custom npm path:",
  custom_npm_path_not_config:
    "No custom npm path configured, npm path will use system environment variable path",
  custom_npm_path_config_error: "Custom npm path error, reselect",
  qr_code_generating: "QR code is being generated, please wait",
  debug_scan_qr_code:
    "Open the scan installation of the fast application debugger, you can debug",
  buidBeforePreview:
    "Before you preview, please complete the build in the build panel.",
  not_install_nodejs_windows_error_before_preview:
    "Preview needs to install and configure the nodejs environment or custom npm path!",
  not_install_nodejs_mac_error_before_preview:
    "Preview needs to install and configure the nodejs environment or custom npm path!",
  starting_server: "Starting debug server",
  start_server_error: "Start debug server error",
  debug_btn: "Debug Game",
};
