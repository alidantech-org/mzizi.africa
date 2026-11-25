import 'package:flutter_api_bridge/flutter_api_bridge.dart';
import 'package:mzizi_api/src/endpoints/geography_endpoints.dart';
import 'package:mzizi_api/src/models/geography/child_collection.dart';
import 'package:mzizi_api/src/models/geography/child_outline_collection.dart';
import 'package:mzizi_api/src/models/geography/child_window.dart';
import 'package:mzizi_api/src/models/geography/feature_key.dart';
import 'package:mzizi_api/src/models/geography/feature_window.dart';
import 'package:mzizi_api/src/models/geography/outline_collection.dart';
import 'package:mzizi_api/src/models/geography/outline_window.dart';
import 'package:mzizi_api/src/models/geography/place_at_point.dart';
import 'package:mzizi_api/src/models/geography/place_collection.dart';
import 'package:mzizi_api/src/models/geography/place_detail.dart';
import 'package:mzizi_api/src/models/geography/point_query.dart';

/// Typed client for the Geography group. Every method runs through the package's
/// ApiConnection and tags its request with a stable operation ID.
class GeographyFeature {
  const GeographyFeature(this._connection);

  final ApiConnection _connection;

  static const _routes = GeographyEndpoints();

  /// The places whose subdivided pieces contain a point ("where am I?"), smallest first.
  ///
  /// GET /v1/geography/at
  Future<ApiResult<GeographyPlaceAtPoint>> findPlacesAtPoint({GeographyPointQuery? input, ApiGetRequestOptions? options}) {
    return _connection.execute(
      GetRequest<GeographyPlaceAtPoint>(
        endpoint: _routes.findPlacesAtPoint,
        options: (options ?? const ApiGetRequestOptions()).copyWith(operationId: 'geography.findPlacesAtPoint'),
        query: input?.toJson(),
        fromJson: (json) => GeographyPlaceAtPoint.fromJson(Map<String, dynamic>.from((json as Map?) ?? const {})),
      ),
    );
  }

  /// The prepared outline of a place for one zoom band, with its bounding box and centre.
  ///
  /// GET /v1/geography/outlines
  Future<ApiResult<GeographyOutlineCollection>> getOutline({GeographyOutlineWindow? input, ApiGetRequestOptions? options}) {
    return _connection.execute(
      GetRequest<GeographyOutlineCollection>(
        endpoint: _routes.getOutline,
        options: (options ?? const ApiGetRequestOptions()).copyWith(operationId: 'geography.getOutline'),
        query: input?.toJson(),
        fromJson: (json) => GeographyOutlineCollection.fromJson(Map<String, dynamic>.from((json as Map?) ?? const {})),
      ),
    );
  }

  /// One place by code with its dated parent links in every hierarchy.
  ///
  /// GET /v1/geography/places/{code}
  Future<ApiResult<GeographyPlaceDetail>> getPlace({required String code, ApiGetRequestOptions? options}) {
    return _connection.execute(
      GetRequest<GeographyPlaceDetail>(
        endpoint: _routes.getPlace(code: code),
        options: (options ?? const ApiGetRequestOptions()).copyWith(operationId: 'geography.getPlace'),
        fromJson: (json) => GeographyPlaceDetail.fromJson(Map<String, dynamic>.from((json as Map?) ?? const {})),
      ),
    );
  }

  /// Prepared outlines of the places inside a place, for drawing a map of its divisions.
  ///
  /// GET /v1/geography/child-outlines
  Future<ApiResult<GeographyChildOutlineCollection>> listChildOutlines({GeographyChildWindow? input, ApiGetRequestOptions? options}) {
    return _connection.execute(
      GetRequest<GeographyChildOutlineCollection>(
        endpoint: _routes.listChildOutlines,
        options: (options ?? const ApiGetRequestOptions()).copyWith(operationId: 'geography.listChildOutlines'),
        query: input?.toJson(),
        fromJson: (json) => GeographyChildOutlineCollection.fromJson(Map<String, dynamic>.from((json as Map?) ?? const {})),
      ),
    );
  }

  /// The current places directly inside a place, optionally in one hierarchy and at one level.
  ///
  /// GET /v1/geography/children
  Future<ApiResult<GeographyChildCollection>> listChildren({GeographyChildWindow? input, ApiGetRequestOptions? options}) {
    return _connection.execute(
      GetRequest<GeographyChildCollection>(
        endpoint: _routes.listChildren,
        options: (options ?? const ApiGetRequestOptions()).copyWith(operationId: 'geography.listChildren'),
        query: input?.toJson(),
        fromJson: (json) => GeographyChildCollection.fromJson(Map<String, dynamic>.from((json as Map?) ?? const {})),
      ),
    );
  }

  /// Places with all their names, optionally of one kind or by code prefix.
  ///
  /// GET /v1/geography/places
  Future<ApiResult<GeographyPlaceCollection>> listPlaces({GeographyFeatureWindow? input, ApiGetRequestOptions? options}) {
    return _connection.execute(
      GetRequest<GeographyPlaceCollection>(
        endpoint: _routes.listPlaces,
        options: (options ?? const ApiGetRequestOptions()).copyWith(operationId: 'geography.listPlaces'),
        query: input?.toJson(),
        fromJson: (json) => GeographyPlaceCollection.fromJson(Map<String, dynamic>.from((json as Map?) ?? const {})),
      ),
    );
  }
}
