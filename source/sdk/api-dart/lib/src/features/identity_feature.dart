import 'package:flutter_api_bridge/flutter_api_bridge.dart';
import 'package:mzizi_api/src/endpoints/identity_endpoints.dart';
import 'package:mzizi_api/src/models/identity/address_key.dart';
import 'package:mzizi_api/src/models/identity/address_matches.dart';
import 'package:mzizi_api/src/models/identity/identity_detail.dart';
import 'package:mzizi_api/src/models/identity/identity_key.dart';
import 'package:mzizi_api/src/models/identity/name_matches.dart';
import 'package:mzizi_api/src/models/identity/name_search.dart';

/// Typed client for the Identity group. Every method runs through the package's
/// ApiConnection and tags its request with a stable operation ID.
class IdentityFeature {
  const IdentityFeature(this._connection);

  final ApiConnection _connection;

  static const _routes = IdentityEndpoints();

  /// One named thing by code, with all its names and public identifiers.
  ///
  /// GET /v1/identity/things/{code}
  Future<ApiResult<IdentityIdentityDetail>> getIdentity({required String code, ApiGetRequestOptions? options}) {
    return _connection.execute(
      GetRequest<IdentityIdentityDetail>(
        endpoint: _routes.getIdentity(code: code),
        options: (options ?? const ApiGetRequestOptions()).copyWith(operationId: 'identity.getIdentity'),
        fromJson: (json) => IdentityIdentityDetail.fromJson(Map<String, dynamic>.from((json as Map?) ?? const {})),
      ),
    );
  }

  /// The named things a readable address segment opens in a country, current addresses first.
  ///
  /// GET /v1/identity/addresses
  Future<ApiResult<IdentityAddressMatches>> resolveAddress({IdentityAddressKey? input, ApiGetRequestOptions? options}) {
    return _connection.execute(
      GetRequest<IdentityAddressMatches>(
        endpoint: _routes.resolveAddress,
        options: (options ?? const ApiGetRequestOptions()).copyWith(operationId: 'identity.resolveAddress'),
        query: input?.toJson(),
        fromJson: (json) => IdentityAddressMatches.fromJson(Map<String, dynamic>.from((json as Map?) ?? const {})),
      ),
    );
  }

  /// Named things whose names start with the text, in any language.
  ///
  /// GET /v1/identity/search
  Future<ApiResult<IdentityNameMatches>> searchNames({IdentityNameSearch? input, ApiGetRequestOptions? options}) {
    return _connection.execute(
      GetRequest<IdentityNameMatches>(
        endpoint: _routes.searchNames,
        options: (options ?? const ApiGetRequestOptions()).copyWith(operationId: 'identity.searchNames'),
        query: input?.toJson(),
        fromJson: (json) => IdentityNameMatches.fromJson(Map<String, dynamic>.from((json as Map?) ?? const {})),
      ),
    );
  }
}
