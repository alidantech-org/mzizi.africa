import 'package:flutter/foundation.dart' show kIsWeb;

/// App configuration. Scaffolded by Dryv once; this file belongs to the app.
abstract final class AppConfig {
  static const String _defined = String.fromEnvironment(
    'API_URL',
    defaultValue: 'https://mz-api.alidantech.org',
  );

  /// The public API. A web build served from an alidantech.org host always talks to it; every other build uses
  /// `--dart-define=API_URL=...` (default: the public API).
  static const String liveApi = 'https://mz-api.alidantech.org';

  static String get apiBaseUrl =>
      kIsWeb && Uri.base.host.endsWith('.alidantech.org') ? liveApi : _defined;
}
