import 'package:flutter_api_bridge/flutter_api_bridge.dart';
import 'package:mzizi_api/src/endpoints/geography_endpoints.dart';
import 'package:mzizi_api/src/models/geography/feature_collection.dart';
import 'package:mzizi_api/src/models/geography/feature_detail.dart';
import 'package:mzizi_api/src/models/geography/feature_key.dart';
import 'package:mzizi_api/src/models/geography/feature_window.dart';

/// Typed client for the Geography group. Every method runs through the package's
/// ApiConnection and tags its request with a stable operation ID.
class GeographyFeature {
  const GeographyFeature(this._connection);

  final ApiConnection _connection;

  static const _routes = GeographyEndpoints();

  /// Browse geographic features with their names, optionally of one type or by code prefix.
  ///
  /// GET /v1/geography/features
  Future<ApiResult<GeographyFeatureCollection>> browseFeatures({GeographyFeatureWindow? input, ApiGetRequestOptions? options}) {
    return _connection.execute(
      GetRequest<GeographyFeatureCollection>(
        endpoint: _routes.browseFeatures,
        options: (options ?? const ApiGetRequestOptions()).copyWith(operationId: 'geography.browseFeatures'),
        query: input?.toJson(),
        fromJson: (json) => GeographyFeatureCollection.fromJson(Map<String, dynamic>.from((json as Map?) ?? const {})),
      ),
    );
  }

  /// One geographic feature with its names.
  ///
  /// GET /v1/geography/features/{featureId}
  Future<ApiResult<GeographyFeatureDetail>> getFeature({required String featureId, ApiGetRequestOptions? options}) {
    return _connection.execute(
      GetRequest<GeographyFeatureDetail>(
        endpoint: _routes.getFeature(featureId: featureId),
        options: (options ?? const ApiGetRequestOptions()).copyWith(operationId: 'geography.getFeature'),
        fromJson: (json) => GeographyFeatureDetail.fromJson(Map<String, dynamic>.from((json as Map?) ?? const {})),
      ),
    );
  }
}
