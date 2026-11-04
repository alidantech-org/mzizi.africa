import Flutter
import UIKit

@main
@objc class AppDelegate: FlutterAppDelegate, FlutterImplicitEngineDelegate {
  override func application(
    _ application: UIApplication,
    didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]?
  ) -> Bool {
    return super.application(application, didFinishLaunchingWithOptions: launchOptions)
  }

  func didInitializeImplicitFlutterEngine(_ engineBridge: FlutterImplicitEngineBridge) {
    GeneratedPluginRegistrant.register(with: engineBridge.pluginRegistry)
    let registrar = engineBridge.pluginRegistry.registrar(forPlugin: "MziziOnboarding")
    let channel = FlutterMethodChannel(
      name: "africa.mzizi/onboarding",
      binaryMessenger: registrar.messenger()
    )
    channel.setMethodCallHandler { call, result in
      let key = "mzizi.onboarding.complete.v1"
      switch call.method {
      case "isComplete":
        result(UserDefaults.standard.bool(forKey: key))
      case "markComplete":
        UserDefaults.standard.set(true, forKey: key)
        result(nil)
      default:
        result(FlutterMethodNotImplemented)
      }
    }
  }
}
