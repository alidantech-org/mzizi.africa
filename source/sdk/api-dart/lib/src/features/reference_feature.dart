import 'package:flutter_api_bridge/flutter_api_bridge.dart';
import 'package:mzizi_api/src/endpoints/reference_endpoints.dart';
import 'package:mzizi_api/src/models/reference/country_collection.dart';
import 'package:mzizi_api/src/models/reference/country_detail.dart';
import 'package:mzizi_api/src/models/reference/country_key.dart';
import 'package:mzizi_api/src/models/reference/country_scope.dart';
import 'package:mzizi_api/src/models/reference/currency_collection.dart';
import 'package:mzizi_api/src/models/reference/hierarchy_collection.dart';
import 'package:mzizi_api/src/models/reference/language_collection.dart';
import 'package:mzizi_api/src/models/reference/reference_window.dart';
import 'package:mzizi_api/src/models/reference/unit_collection.dart';

/// Typed client for the Reference group. Every method runs through the package's
/// ApiConnection and tags its request with a stable operation ID.
class ReferenceFeature {
  const ReferenceFeature(this._connection);

  final ApiConnection _connection;

  static const _routes = ReferenceEndpoints();

  /// One country by code, with its locales in fallback order.
  ///
  /// GET /v1/reference/countries/{code}
  Future<ApiResult<ReferenceCountryDetail>> getCountry({required String code, ApiGetRequestOptions? options}) {
    return _connection.execute(
      GetRequest<ReferenceCountryDetail>(
        endpoint: _routes.getCountry(code: code),
        options: (options ?? const ApiGetRequestOptions()).copyWith(operationId: 'reference.getCountry'),
        fromJson: (json) => ReferenceCountryDetail.fromJson(Map<String, dynamic>.from((json as Map?) ?? const {})),
      ),
    );
  }

  /// Countries with their ISO codes, calling code, currency and all names.
  ///
  /// GET /v1/reference/countries
  Future<ApiResult<ReferenceCountryCollection>> listCountries({ReferenceReferenceWindow? input, ApiGetRequestOptions? options}) {
    return _connection.execute(
      GetRequest<ReferenceCountryCollection>(
        endpoint: _routes.listCountries,
        options: (options ?? const ApiGetRequestOptions()).copyWith(operationId: 'reference.listCountries'),
        query: input?.toJson(),
        fromJson: (json) => ReferenceCountryCollection.fromJson(Map<String, dynamic>.from((json as Map?) ?? const {})),
      ),
    );
  }

  /// Currencies with their ISO codes and minor units.
  ///
  /// GET /v1/reference/currencies
  Future<ApiResult<ReferenceCurrencyCollection>> listCurrencies({ReferenceReferenceWindow? input, ApiGetRequestOptions? options}) {
    return _connection.execute(
      GetRequest<ReferenceCurrencyCollection>(
        endpoint: _routes.listCurrencies,
        options: (options ?? const ApiGetRequestOptions()).copyWith(operationId: 'reference.listCurrencies'),
        query: input?.toJson(),
        fromJson: (json) => ReferenceCurrencyCollection.fromJson(Map<String, dynamic>.from((json as Map?) ?? const {})),
      ),
    );
  }

  /// How one country divides itself: its hierarchies over time, each with its levels in depth order.
  ///
  /// GET /v1/reference/hierarchies
  Future<ApiResult<ReferenceHierarchyCollection>> listHierarchies({ReferenceCountryScope? input, ApiGetRequestOptions? options}) {
    return _connection.execute(
      GetRequest<ReferenceHierarchyCollection>(
        endpoint: _routes.listHierarchies,
        options: (options ?? const ApiGetRequestOptions()).copyWith(operationId: 'reference.listHierarchies'),
        query: input?.toJson(),
        fromJson: (json) => ReferenceHierarchyCollection.fromJson(Map<String, dynamic>.from((json as Map?) ?? const {})),
      ),
    );
  }

  /// Languages with their ISO codes, direction and names.
  ///
  /// GET /v1/reference/languages
  Future<ApiResult<ReferenceLanguageCollection>> listLanguages({ReferenceReferenceWindow? input, ApiGetRequestOptions? options}) {
    return _connection.execute(
      GetRequest<ReferenceLanguageCollection>(
        endpoint: _routes.listLanguages,
        options: (options ?? const ApiGetRequestOptions()).copyWith(operationId: 'reference.listLanguages'),
        query: input?.toJson(),
        fromJson: (json) => ReferenceLanguageCollection.fromJson(Map<String, dynamic>.from((json as Map?) ?? const {})),
      ),
    );
  }

  /// Units of measurement with their symbols and conversions.
  ///
  /// GET /v1/reference/units
  Future<ApiResult<ReferenceUnitCollection>> listUnits({ReferenceReferenceWindow? input, ApiGetRequestOptions? options}) {
    return _connection.execute(
      GetRequest<ReferenceUnitCollection>(
        endpoint: _routes.listUnits,
        options: (options ?? const ApiGetRequestOptions()).copyWith(operationId: 'reference.listUnits'),
        query: input?.toJson(),
        fromJson: (json) => ReferenceUnitCollection.fromJson(Map<String, dynamic>.from((json as Map?) ?? const {})),
      ),
    );
  }
}
