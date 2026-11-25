import 'package:flutter_api_bridge/flutter_api_bridge.dart';
import 'package:mzizi_api/src/endpoints/civic_endpoints.dart';
import 'package:mzizi_api/src/models/civic/country_facilities.dart';
import 'package:mzizi_api/src/models/civic/country_tenders.dart';
import 'package:mzizi_api/src/models/civic/facility_collection.dart';
import 'package:mzizi_api/src/models/civic/place_projects.dart';
import 'package:mzizi_api/src/models/civic/project_collection.dart';
import 'package:mzizi_api/src/models/civic/project_detail.dart';
import 'package:mzizi_api/src/models/civic/project_key.dart';
import 'package:mzizi_api/src/models/civic/tender_collection.dart';
import 'package:mzizi_api/src/models/civic/tender_detail.dart';
import 'package:mzizi_api/src/models/civic/tender_key.dart';

/// Typed client for the Civic group. Every method runs through the package's
/// ApiConnection and tags its request with a stable operation ID.
class CivicFeature {
  const CivicFeature(this._connection);

  final ApiConnection _connection;

  static const _routes = CivicEndpoints();

  /// One project with its places and contracts.
  ///
  /// GET /v1/civic/projects/{code}
  Future<ApiResult<CivicProjectDetail>> getProject({required String code, ApiGetRequestOptions? options}) {
    return _connection.execute(
      GetRequest<CivicProjectDetail>(
        endpoint: _routes.getProject(code: code),
        options: (options ?? const ApiGetRequestOptions()).copyWith(operationId: 'civic.getProject'),
        fromJson: (json) => CivicProjectDetail.fromJson(Map<String, dynamic>.from((json as Map?) ?? const {})),
      ),
    );
  }

  /// One tender with every bid, cheapest first, including those that lost.
  ///
  /// GET /v1/civic/tenders/{code}
  Future<ApiResult<CivicTenderDetail>> getTender({required String code, ApiGetRequestOptions? options}) {
    return _connection.execute(
      GetRequest<CivicTenderDetail>(
        endpoint: _routes.getTender(code: code),
        options: (options ?? const ApiGetRequestOptions()).copyWith(operationId: 'civic.getTender'),
        fromJson: (json) => CivicTenderDetail.fromJson(Map<String, dynamic>.from((json as Map?) ?? const {})),
      ),
    );
  }

  /// A country's public facilities, optionally of one class.
  ///
  /// GET /v1/civic/facilities
  Future<ApiResult<CivicFacilityCollection>> listFacilities({CivicCountryFacilities? input, ApiGetRequestOptions? options}) {
    return _connection.execute(
      GetRequest<CivicFacilityCollection>(
        endpoint: _routes.listFacilities,
        options: (options ?? const ApiGetRequestOptions()).copyWith(operationId: 'civic.listFacilities'),
        query: input?.toJson(),
        fromJson: (json) => CivicFacilityCollection.fromJson(Map<String, dynamic>.from((json as Map?) ?? const {})),
      ),
    );
  }

  /// The projects that touch a place.
  ///
  /// GET /v1/civic/projects
  Future<ApiResult<CivicProjectCollection>> listPlaceProjects({CivicPlaceProjects? input, ApiGetRequestOptions? options}) {
    return _connection.execute(
      GetRequest<CivicProjectCollection>(
        endpoint: _routes.listPlaceProjects,
        options: (options ?? const ApiGetRequestOptions()).copyWith(operationId: 'civic.listPlaceProjects'),
        query: input?.toJson(),
        fromJson: (json) => CivicProjectCollection.fromJson(Map<String, dynamic>.from((json as Map?) ?? const {})),
      ),
    );
  }

  /// A country's tenders, newest first, optionally by status.
  ///
  /// GET /v1/civic/tenders
  Future<ApiResult<CivicTenderCollection>> listTenders({CivicCountryTenders? input, ApiGetRequestOptions? options}) {
    return _connection.execute(
      GetRequest<CivicTenderCollection>(
        endpoint: _routes.listTenders,
        options: (options ?? const ApiGetRequestOptions()).copyWith(operationId: 'civic.listTenders'),
        query: input?.toJson(),
        fromJson: (json) => CivicTenderCollection.fromJson(Map<String, dynamic>.from((json as Map?) ?? const {})),
      ),
    );
  }
}
