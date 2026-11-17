import 'package:flutter_api_bridge/flutter_api_bridge.dart';

import 'src/client.dart';

export 'package:flutter_api_bridge/flutter_api_bridge.dart'
    show
        ApiAuth,
        ApiBridgeConfig,
        ApiCacheConfig,
        ApiConnection,
        ApiGetRequestOptions,
        ApiLogger,
        ApiLoggingConfig,
        ApiRequestOptions,
        ApiResult,
        ApiRetryConfig,
        AuthStrategy,
        BearerStrategy,
        CookieStrategy,
        DeveloperApiLogger,
        NoAuthStrategy;
export 'src/client.dart';
export 'src/features/geography_feature.dart';
export 'src/endpoints/geography_endpoints.dart';
export 'src/models/changes.dart';
export 'src/models/classifications.dart';
export 'src/models/datasets.dart';
export 'src/models/feature_collection.dart';
export 'src/models/feature_detail.dart';
export 'src/models/feature_detail_names.dart';
export 'src/models/feature_entry.dart';
export 'src/models/feature_entry_names.dart';
export 'src/models/feature_key.dart';
export 'src/models/feature_window.dart';
export 'src/models/features.dart';
export 'src/models/geometries.dart';
export 'src/models/identifiers.dart';
export 'src/models/names.dart';
export 'src/models/relationships.dart';
export 'src/models/country.dart';
export 'src/models/found_member.dart';
export 'src/models/member_collection.dart';
export 'src/models/member_entry.dart';
export 'src/models/member_key.dart';
export 'src/models/member_window.dart';
export 'src/models/pattern.dart';
export 'src/models/scheme.dart';
export 'src/models/scheme_collection.dart';
export 'src/models/scheme_entry.dart';
export 'src/models/scheme_window.dart';
export 'src/models/topic.dart';
export 'src/models/unit.dart';
export 'src/models/value.dart';
export 'src/models/value_label.dart';
export 'src/models/value_relation.dart';
export 'src/models/api_error.dart';
export 'src/models/association.dart';
export 'src/models/base_entity.dart';
export 'src/models/base_query.dart';
export 'src/models/coded_created.dart';
export 'src/models/coded_entity.dart';
export 'src/models/coded_historical_entity.dart';
export 'src/models/coded_identified.dart';
export 'src/models/coded_validity_entity.dart';
export 'src/models/created.dart';
export 'src/models/entity.dart';
export 'src/models/historical_validity_entity.dart';
export 'src/models/identified.dart';
export 'src/models/immutable.dart';
export 'src/models/page_window.dart';
export 'src/models/paginated_response.dart';
export 'src/models/pagination_meta.dart';
export 'src/models/timestamped.dart';
export 'src/models/validity_entity.dart';
export 'src/enums/value_label_kind.dart';
export 'src/enums/value_relation_kind.dart';
export 'src/enums/sort_direction.dart';

/// Root facade for the generated Mzizi App package.
///
/// Applications import only this package. It owns a named flutter_api_bridge connection and
/// exposes the typed client and safe session controls.
class MziziApp {
  MziziApp._(ApiConnection connection) : client = MziziAppClient(connection);

  static const String connectionKey = 'mzizi_app';

  static MziziApp? _instance;

  /// Configures the package with the full transport configuration.
  static Future<void> configure(ApiBridgeConfig config, {bool replace = true}) async {
    await FlutterApiBridge.configure(key: connectionKey, config: config, replace: replace);
    _instance = null;
  }

  /// Configures the package with production defaults.
  static Future<void> initialize({
    required Uri baseUri,
    AuthStrategy auth = const CookieStrategy(),
    Map<String, String> defaultHeaders = const <String, String>{},
    bool replace = true,
  }) =>
      configure(ApiBridgeConfig(baseUri: baseUri, auth: auth, defaultHeaders: defaultHeaders), replace: replace);

  static ApiConnection get connection => FlutterApiBridge.requireConnection(connectionKey);

  static ApiAuth get auth => connection.auth;

  /// Starts or switches the user session after login; changing it clears the previous cache.
  static Future<void> initializeUserSession({
    required String sessionId,
    String? bearerToken,
    Map<String, String>? authHeaders,
  }) =>
      connection.initializeUserSession(sessionId: sessionId, bearerToken: bearerToken, authHeaders: authHeaders);

  static Future<void> clearActiveSessionCache() => connection.clearActiveSessionCache();

  static Future<void> clearAllCache() => connection.clearAllCache();

  /// Clears the cache, credentials and persistent cookies.
  static Future<void> logout() async {
    await connection.logout();
    _instance = null;
  }

  static MziziApp get instance => _instance ??= MziziApp._(connection);

  static Future<void> dispose() async {
    _instance = null;
    await FlutterApiBridge.removeConnection(connectionKey);
  }

  final MziziAppClient client;
}