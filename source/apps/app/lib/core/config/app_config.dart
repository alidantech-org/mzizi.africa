/// App configuration. Scaffolded by Dryv once; this file belongs to the app.
abstract final class AppConfig {
  /// The API base URL: `flutter run --dart-define=API_URL=https://api.example.com`.
  static const String apiBaseUrl = String.fromEnvironment(
    'API_URL',
    defaultValue: 'http://127.0.0.1:8700',
  );
}
