import 'package:flutter_api_bridge/flutter_api_bridge.dart';
import 'package:mzizi_api/src/endpoints/frontend_endpoints.dart';
import 'package:mzizi_api/src/models/frontend/copy_bundle.dart';
import 'package:mzizi_api/src/models/frontend/copy_request.dart';
import 'package:mzizi_api/src/models/frontend/home_request.dart';
import 'package:mzizi_api/src/models/frontend/home_screen.dart';
import 'package:mzizi_api/src/models/frontend/institution_request.dart';
import 'package:mzizi_api/src/models/frontend/institution_screen.dart';
import 'package:mzizi_api/src/models/frontend/place_request.dart';
import 'package:mzizi_api/src/models/frontend/place_screen.dart';
import 'package:mzizi_api/src/models/frontend/ranking_request.dart';
import 'package:mzizi_api/src/models/frontend/ranking_screen.dart';
import 'package:mzizi_api/src/models/frontend/search_request.dart';
import 'package:mzizi_api/src/models/frontend/search_results.dart';

/// Typed client for the Frontend group. Every method runs through the package's
/// ApiConnection and tags its request with a stable operation ID.
class FrontendFeature {
  const FrontendFeature(this._connection);

  final ApiConnection _connection;

  static const _routes = FrontendEndpoints();

  /// The interface messages of an app in the reader's language, falling back per key to English.
  ///
  /// GET /v1/frontend/copy
  Future<ApiResult<FrontendCopyBundle>> getCopyBundle({FrontendCopyRequest? input, ApiGetRequestOptions? options}) {
    return _connection.execute(
      GetRequest<FrontendCopyBundle>(
        endpoint: _routes.getCopyBundle,
        options: (options ?? const ApiGetRequestOptions()).copyWith(operationId: 'frontend.getCopyBundle'),
        query: input?.toJson(),
        fromJson: (json) => FrontendCopyBundle.fromJson(Map<String, dynamic>.from((json as Map?) ?? const {})),
      ),
    );
  }

  /// The home screen: served countries and the languages offered, localized.
  ///
  /// GET /v1/frontend/home
  Future<ApiResult<FrontendHomeScreen>> getHomeScreen({FrontendHomeRequest? input, ApiGetRequestOptions? options}) {
    return _connection.execute(
      GetRequest<FrontendHomeScreen>(
        endpoint: _routes.getHomeScreen,
        options: (options ?? const ApiGetRequestOptions()).copyWith(operationId: 'frontend.getHomeScreen'),
        query: input?.toJson(),
        fromJson: (json) => FrontendHomeScreen.fromJson(Map<String, dynamic>.from((json as Map?) ?? const {})),
      ),
    );
  }

  /// An institution page: its name, arm and offices with their current holders.
  ///
  /// GET /v1/frontend/institution
  Future<ApiResult<FrontendInstitutionScreen>> getInstitutionScreen({FrontendInstitutionRequest? input, ApiGetRequestOptions? options}) {
    return _connection.execute(
      GetRequest<FrontendInstitutionScreen>(
        endpoint: _routes.getInstitutionScreen,
        options: (options ?? const ApiGetRequestOptions()).copyWith(operationId: 'frontend.getInstitutionScreen'),
        query: input?.toJson(),
        fromJson: (json) => FrontendInstitutionScreen.fromJson(Map<String, dynamic>.from((json as Map?) ?? const {})),
      ),
    );
  }

  /// Everything a place page shows in one call: name, breadcrumb, divisions, headline figures, leaders, projects, upcoming events and articles. Without a place, the country itself.
  ///
  /// GET /v1/frontend/place
  Future<ApiResult<FrontendPlaceScreen>> getPlaceScreen({FrontendPlaceRequest? input, ApiGetRequestOptions? options}) {
    return _connection.execute(
      GetRequest<FrontendPlaceScreen>(
        endpoint: _routes.getPlaceScreen,
        options: (options ?? const ApiGetRequestOptions()).copyWith(operationId: 'frontend.getPlaceScreen'),
        query: input?.toJson(),
        fromJson: (json) => FrontendPlaceScreen.fromJson(Map<String, dynamic>.from((json as Map?) ?? const {})),
      ),
    );
  }

  /// One indicator across the places of a country, ranked, for one year (latest when omitted).
  ///
  /// GET /v1/frontend/ranking
  Future<ApiResult<FrontendRankingScreen>> getRankingScreen({FrontendRankingRequest? input, ApiGetRequestOptions? options}) {
    return _connection.execute(
      GetRequest<FrontendRankingScreen>(
        endpoint: _routes.getRankingScreen,
        options: (options ?? const ApiGetRequestOptions()).copyWith(operationId: 'frontend.getRankingScreen'),
        query: input?.toJson(),
        fromJson: (json) => FrontendRankingScreen.fromJson(Map<String, dynamic>.from((json as Map?) ?? const {})),
      ),
    );
  }

  /// Named things whose names start with the text, localized and told apart by their parent place.
  ///
  /// GET /v1/frontend/search
  Future<ApiResult<FrontendSearchResults>> searchScreen({FrontendSearchRequest? input, ApiGetRequestOptions? options}) {
    return _connection.execute(
      GetRequest<FrontendSearchResults>(
        endpoint: _routes.searchScreen,
        options: (options ?? const ApiGetRequestOptions()).copyWith(operationId: 'frontend.searchScreen'),
        query: input?.toJson(),
        fromJson: (json) => FrontendSearchResults.fromJson(Map<String, dynamic>.from((json as Map?) ?? const {})),
      ),
    );
  }
}
