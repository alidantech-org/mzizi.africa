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
export 'package:mzizi_api/src/client.dart';
export 'package:mzizi_api/src/features/auth_feature.dart';
export 'package:mzizi_api/src/features/geography_feature.dart';
export 'package:mzizi_api/src/features/governance_feature.dart';
export 'package:mzizi_api/src/features/reference_feature.dart';
export 'package:mzizi_api/src/endpoints/auth_endpoints.dart';
export 'package:mzizi_api/src/endpoints/geography_endpoints.dart';
export 'package:mzizi_api/src/endpoints/governance_endpoints.dart';
export 'package:mzizi_api/src/endpoints/reference_endpoints.dart';
export 'package:mzizi_api/src/models/auth/account_collection.dart';
export 'package:mzizi_api/src/models/auth/account_read.dart';
export 'package:mzizi_api/src/models/auth/account_summary.dart';
export 'package:mzizi_api/src/models/auth/account_window.dart';
export 'package:mzizi_api/src/models/auth/accounts.dart';
export 'package:mzizi_api/src/models/auth/delegation_roles.dart';
export 'package:mzizi_api/src/models/auth/delegations.dart';
export 'package:mzizi_api/src/models/auth/invitations.dart';
export 'package:mzizi_api/src/models/auth/login_identities.dart';
export 'package:mzizi_api/src/models/auth/memberships.dart';
export 'package:mzizi_api/src/models/auth/permissions.dart';
export 'package:mzizi_api/src/models/auth/role_assignments.dart';
export 'package:mzizi_api/src/models/auth/role_permissions.dart';
export 'package:mzizi_api/src/models/auth/roles.dart';
export 'package:mzizi_api/src/models/auth/scopes.dart';
export 'package:mzizi_api/src/models/filesystem/file_extensions.dart';
export 'package:mzizi_api/src/models/filesystem/file_versions.dart';
export 'package:mzizi_api/src/models/filesystem/files.dart';
export 'package:mzizi_api/src/models/filesystem/folders.dart';
export 'package:mzizi_api/src/models/filesystem/media.dart';
export 'package:mzizi_api/src/models/filesystem/taggings.dart';
export 'package:mzizi_api/src/models/filesystem/tags.dart';
export 'package:mzizi_api/src/models/geography/assets.dart';
export 'package:mzizi_api/src/models/geography/changes.dart';
export 'package:mzizi_api/src/models/geography/classifications.dart';
export 'package:mzizi_api/src/models/geography/feature_collection.dart';
export 'package:mzizi_api/src/models/geography/feature_detail.dart';
export 'package:mzizi_api/src/models/geography/feature_detail_names.dart';
export 'package:mzizi_api/src/models/geography/feature_entry.dart';
export 'package:mzizi_api/src/models/geography/feature_entry_names.dart';
export 'package:mzizi_api/src/models/geography/feature_geometry.dart';
export 'package:mzizi_api/src/models/geography/feature_geometry_collection.dart';
export 'package:mzizi_api/src/models/geography/feature_key.dart';
export 'package:mzizi_api/src/models/geography/feature_kind.dart';
export 'package:mzizi_api/src/models/geography/feature_kind_collection.dart';
export 'package:mzizi_api/src/models/geography/feature_window.dart';
export 'package:mzizi_api/src/models/geography/features.dart';
export 'package:mzizi_api/src/models/geography/geometries.dart';
export 'package:mzizi_api/src/models/geography/geometry_window.dart';
export 'package:mzizi_api/src/models/geography/identifiers.dart';
export 'package:mzizi_api/src/models/geography/names.dart';
export 'package:mzizi_api/src/models/geography/relationships.dart';
export 'package:mzizi_api/src/models/governance/authority_scopes.dart';
export 'package:mzizi_api/src/models/governance/holders.dart';
export 'package:mzizi_api/src/models/governance/institution_collection.dart';
export 'package:mzizi_api/src/models/governance/institution_detail.dart';
export 'package:mzizi_api/src/models/governance/institution_detail_mandates.dart';
export 'package:mzizi_api/src/models/governance/institution_detail_names.dart';
export 'package:mzizi_api/src/models/governance/institution_detail_offices.dart';
export 'package:mzizi_api/src/models/governance/institution_entry.dart';
export 'package:mzizi_api/src/models/governance/institution_entry_names.dart';
export 'package:mzizi_api/src/models/governance/institution_key.dart';
export 'package:mzizi_api/src/models/governance/institution_window.dart';
export 'package:mzizi_api/src/models/governance/institutions.dart';
export 'package:mzizi_api/src/models/governance/mandates.dart';
export 'package:mzizi_api/src/models/governance/office_detail.dart';
export 'package:mzizi_api/src/models/governance/office_detail_holders.dart';
export 'package:mzizi_api/src/models/governance/office_detail_holders_names.dart';
export 'package:mzizi_api/src/models/governance/office_key.dart';
export 'package:mzizi_api/src/models/governance/offices.dart';
export 'package:mzizi_api/src/models/governance/relationships.dart';
export 'package:mzizi_api/src/models/official/branding.dart';
export 'package:mzizi_api/src/models/official/contacts.dart';
export 'package:mzizi_api/src/models/official/entities.dart';
export 'package:mzizi_api/src/models/official/identifiers.dart';
export 'package:mzizi_api/src/models/official/individuals.dart';
export 'package:mzizi_api/src/models/official/names.dart';
export 'package:mzizi_api/src/models/official/relationships.dart';
export 'package:mzizi_api/src/models/reference/country.dart';
export 'package:mzizi_api/src/models/reference/found_member.dart';
export 'package:mzizi_api/src/models/reference/language.dart';
export 'package:mzizi_api/src/models/reference/language_name.dart';
export 'package:mzizi_api/src/models/reference/member_collection.dart';
export 'package:mzizi_api/src/models/reference/member_entry.dart';
export 'package:mzizi_api/src/models/reference/member_key.dart';
export 'package:mzizi_api/src/models/reference/member_window.dart';
export 'package:mzizi_api/src/models/reference/pattern.dart';
export 'package:mzizi_api/src/models/reference/scheme.dart';
export 'package:mzizi_api/src/models/reference/scheme_collection.dart';
export 'package:mzizi_api/src/models/reference/scheme_entry.dart';
export 'package:mzizi_api/src/models/reference/scheme_window.dart';
export 'package:mzizi_api/src/models/reference/topic.dart';
export 'package:mzizi_api/src/models/reference/unit.dart';
export 'package:mzizi_api/src/models/reference/value.dart';
export 'package:mzizi_api/src/models/reference/value_label.dart';
export 'package:mzizi_api/src/models/reference/value_relation.dart';
export 'package:mzizi_api/src/models/shared/api_error.dart';
export 'package:mzizi_api/src/models/shared/association.dart';
export 'package:mzizi_api/src/models/shared/base_entity.dart';
export 'package:mzizi_api/src/models/shared/base_query.dart';
export 'package:mzizi_api/src/models/shared/coded_created.dart';
export 'package:mzizi_api/src/models/shared/coded_entity.dart';
export 'package:mzizi_api/src/models/shared/coded_historical_entity.dart';
export 'package:mzizi_api/src/models/shared/coded_identified.dart';
export 'package:mzizi_api/src/models/shared/coded_subject_entity.dart';
export 'package:mzizi_api/src/models/shared/coded_validity_entity.dart';
export 'package:mzizi_api/src/models/shared/coded_validity_subject_entity.dart';
export 'package:mzizi_api/src/models/shared/created.dart';
export 'package:mzizi_api/src/models/shared/entity.dart';
export 'package:mzizi_api/src/models/shared/historical_validity_entity.dart';
export 'package:mzizi_api/src/models/shared/identified.dart';
export 'package:mzizi_api/src/models/shared/immutable.dart';
export 'package:mzizi_api/src/models/shared/page_window.dart';
export 'package:mzizi_api/src/models/shared/paginated_response.dart';
export 'package:mzizi_api/src/models/shared/pagination_meta.dart';
export 'package:mzizi_api/src/models/shared/subject_reference.dart';
export 'package:mzizi_api/src/models/shared/timestamped.dart';
export 'package:mzizi_api/src/models/shared/validity_entity.dart';
export 'package:mzizi_api/src/models/source/addresses.dart';
export 'package:mzizi_api/src/models/source/artifacts.dart';
export 'package:mzizi_api/src/models/source/attributions.dart';
export 'package:mzizi_api/src/models/source/captures.dart';
export 'package:mzizi_api/src/models/source/citations.dart';
export 'package:mzizi_api/src/models/source/discoveries.dart';
export 'package:mzizi_api/src/models/source/domains.dart';
export 'package:mzizi_api/src/models/source/editions.dart';
export 'package:mzizi_api/src/models/source/products.dart';
export 'package:mzizi_api/src/models/source/publishers.dart';
export 'package:mzizi_api/src/models/source/relationships.dart';
export 'package:mzizi_api/src/models/source/sources.dart';
export 'package:mzizi_api/src/models/source/verifications.dart';
export 'package:mzizi_api/src/enums/auth/account_status.dart';
export 'package:mzizi_api/src/enums/auth/auth_action.dart';
export 'package:mzizi_api/src/enums/auth/auth_actor_kind.dart';
export 'package:mzizi_api/src/enums/auth/membership_status.dart';
export 'package:mzizi_api/src/enums/filesystem/access.dart';
export 'package:mzizi_api/src/enums/filesystem/retention.dart';
export 'package:mzizi_api/src/enums/reference/language_name_kind.dart';
export 'package:mzizi_api/src/enums/reference/value_label_kind.dart';
export 'package:mzizi_api/src/enums/reference/value_relation_kind.dart';
export 'package:mzizi_api/src/enums/shared/sort_direction.dart';
export 'package:mzizi_api/src/enums/shared/subject_table.dart';
export 'package:mzizi_api/src/enums/source/address_kind.dart';
export 'package:mzizi_api/src/enums/source/http_method.dart';
export 'package:mzizi_api/src/enums/source/source_kind.dart';
export 'package:mzizi_api/src/enums/source/verification_outcome.dart';

/// Root facade for the generated Mzizi Api package.
///
/// Applications import only this package. It owns a named flutter_api_bridge connection and
/// exposes the typed client and safe session controls.
class MziziApi {
  MziziApi._(ApiConnection connection) : client = MziziApiClient(connection);

  static const String connectionKey = 'mzizi_api';

  static MziziApi? _instance;

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
  }) => configure(
    ApiBridgeConfig(baseUri: baseUri, auth: auth, defaultHeaders: defaultHeaders),
    replace: replace,
  );

  static ApiConnection get connection => FlutterApiBridge.requireConnection(connectionKey);

  static ApiAuth get auth => connection.auth;

  /// Starts or switches the user session after login; changing it clears the previous cache.
  static Future<void> initializeUserSession({required String sessionId, String? bearerToken, Map<String, String>? authHeaders}) =>
      connection.initializeUserSession(sessionId: sessionId, bearerToken: bearerToken, authHeaders: authHeaders);

  static Future<void> clearActiveSessionCache() => connection.clearActiveSessionCache();

  static Future<void> clearAllCache() => connection.clearAllCache();

  /// Clears the cache, credentials and persistent cookies.
  static Future<void> logout() async {
    await connection.logout();
    _instance = null;
  }

  static MziziApi get instance => _instance ??= MziziApi._(connection);

  static Future<void> dispose() async {
    _instance = null;
    await FlutterApiBridge.removeConnection(connectionKey);
  }

  final MziziApiClient client;
}
