import 'package:flutter_api_bridge/flutter_api_bridge.dart';
import 'package:mzizi_api/src/endpoints/locality_endpoints.dart';
import 'package:mzizi_api/src/models/locality/citation_input.dart';
import 'package:mzizi_api/src/models/locality/evidence_detail.dart';
import 'package:mzizi_api/src/models/locality/language_list.dart';
import 'package:mzizi_api/src/models/locality/locality_matches.dart';
import 'package:mzizi_api/src/models/locality/locality_profile.dart';
import 'package:mzizi_api/src/models/locality/place_input.dart';
import 'package:mzizi_api/src/models/locality/position_input.dart';
import 'package:mzizi_api/src/models/locality/search_input.dart';
import 'package:mzizi_api/src/models/locality/source_collection.dart';
import 'package:mzizi_api/src/models/locality/source_search_input.dart';

/// Typed client for the Locality group. Every method runs through the package's
/// ApiConnection and tags its request with a stable operation ID.
class LocalityFeature {
  const LocalityFeature(this._connection);

  final ApiConnection _connection;

  static const _routes = LocalityEndpoints();

  /// The data sources behind the platform, with their publisher and how many artifacts and citations each has.
  ///
  /// GET /v1/sources
  Future<ApiResult<LocalitySourceCollection>> browseSources({LocalitySourceSearchInput? input, ApiGetRequestOptions? options}) {
    return _connection.execute(
      GetRequest<LocalitySourceCollection>(
        endpoint: _routes.browseSources,
        options: (options ?? const ApiGetRequestOptions()).copyWith(operationId: 'locality.browseSources'),
        query: input?.toJson(),
        fromJson: (json) => LocalitySourceCollection.fromJson(Map<String, dynamic>.from((json as Map?) ?? const {})),
      ),
    );
  }

  /// One citation with its source, edition, quoted text and the files it points at.
  ///
  /// GET /v1/evidence/{citationId}
  Future<ApiResult<LocalityEvidenceDetail>> getEvidence({required String citationId, ApiGetRequestOptions? options}) {
    return _connection.execute(
      GetRequest<LocalityEvidenceDetail>(
        endpoint: _routes.getEvidence(citationId: citationId),
        options: (options ?? const ApiGetRequestOptions()).copyWith(operationId: 'locality.getEvidence'),
        fromJson: (json) => LocalityEvidenceDetail.fromJson(Map<String, dynamic>.from((json as Map?) ?? const {})),
      ),
    );
  }

  /// The same place document for a known feature, for visitors who pick a place by name instead of position.
  ///
  /// GET /v1/locality/{featureId}
  Future<ApiResult<LocalityLocalityProfile>> getLocality({required String featureId, LocalityPlaceInput? input, ApiGetRequestOptions? options}) {
    return _connection.execute(
      GetRequest<LocalityLocalityProfile>(
        endpoint: _routes.getLocality(featureId: featureId),
        options: (options ?? const ApiGetRequestOptions()).copyWith(operationId: 'locality.getLocality'),
        query: input?.toJson(),
        fromJson: (json) => LocalityLocalityProfile.fromJson(Map<String, dynamic>.from((json as Map?) ?? const {})),
      ),
    );
  }

  /// The languages the system can serve names and labels in, for a language picker.
  ///
  /// GET /v1/languages
  Future<ApiResult<LocalityLanguageList>> listLanguages({ApiGetRequestOptions? options}) {
    return _connection.execute(
      GetRequest<LocalityLanguageList>(
        endpoint: _routes.listLanguages,
        options: (options ?? const ApiGetRequestOptions()).copyWith(operationId: 'locality.listLanguages'),
        fromJson: (json) => LocalityLanguageList.fromJson(Map<String, dynamic>.from((json as Map?) ?? const {})),
      ),
    );
  }

  /// Who and what serves the place at a position: the containing units, the office holders scoped to them, procurement there, media and the evidence for each claim, in the requested language.
  ///
  /// GET /v1/locality/at
  Future<ApiResult<LocalityLocalityProfile>> resolveLocality({LocalityPositionInput? input, ApiGetRequestOptions? options}) {
    return _connection.execute(
      GetRequest<LocalityLocalityProfile>(
        endpoint: _routes.resolveLocality,
        options: (options ?? const ApiGetRequestOptions()).copyWith(operationId: 'locality.resolveLocality'),
        query: input?.toJson(),
        fromJson: (json) => LocalityLocalityProfile.fromJson(Map<String, dynamic>.from((json as Map?) ?? const {})),
      ),
    );
  }

  /// Places whose name matches the text, in any language, narrowest units first.
  ///
  /// GET /v1/locality/search
  Future<ApiResult<LocalityLocalityMatches>> searchLocalities({LocalitySearchInput? input, ApiGetRequestOptions? options}) {
    return _connection.execute(
      GetRequest<LocalityLocalityMatches>(
        endpoint: _routes.searchLocalities,
        options: (options ?? const ApiGetRequestOptions()).copyWith(operationId: 'locality.searchLocalities'),
        query: input?.toJson(),
        fromJson: (json) => LocalityLocalityMatches.fromJson(Map<String, dynamic>.from((json as Map?) ?? const {})),
      ),
    );
  }
}
