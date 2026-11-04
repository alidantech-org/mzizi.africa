import 'package:flutter/foundation.dart';

const _configuredApiBaseUrl = String.fromEnvironment('MZIZI_API_BASE_URL');

/// API origin shared by every mobile domain client.
///
/// Local browser and desktop launches target the host machine. Android
/// emulators use the special host gateway. Physical devices and deployments
/// should override this with a reachable origin using a Dart define.
String get defaultMziziApiBaseUrl {
  final configured = _configuredApiBaseUrl.trim();
  if (configured.isNotEmpty) return configured;

  if (!kIsWeb && defaultTargetPlatform == TargetPlatform.android) {
    return 'http://10.0.2.2:3000';
  }
  return 'http://127.0.0.1:3000';
}
