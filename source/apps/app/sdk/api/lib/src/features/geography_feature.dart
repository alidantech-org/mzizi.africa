import 'package:flutter_api_bridge/flutter_api_bridge.dart';
import '../models/feature_collection.dart';
import '../models/feature_window.dart';

/// Typed client for the Geography group. Every method runs through the package's
/// ApiConnection and tags its request with a stable operation ID.
class GeographyFeature {
  const GeographyFeature(this._connection);

  final ApiConnection _connection;

  static const _routes = GeographyEndpoints();

  /// Browse geographic features with their names, optionally of one type or by code prefix.
  ///
  /// GET /v1/geography/features
  Future<ApiResult<FeatureCollection>> browseFeatures({
    FeatureWindow? input,
    ApiGetRequestOptions? options,
  }) {
    return _connection.execute(
      GetRequest<FeatureCollection>(
        endpoint: _routes.browseFeatures,
        options: (options ?? const ApiGetRequestOptions()).copyWith(operationId: 'geography.browseFeatures'),
        query: input?.toJson(),
        fromJson: (json) => FeatureCollection.fromJson(Map<String, dynamic>.from((json as Map?) ?? const {})),
      ),
    );
  }
}