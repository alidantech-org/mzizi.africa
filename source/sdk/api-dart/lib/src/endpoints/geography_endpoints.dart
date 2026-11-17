/// Typed route registry for the Geography group. Static paths are getters;
/// parameterised paths are methods that interpolate their segments.
class GeographyEndpoints {
  const GeographyEndpoints();

  /// GET /v1/geography/feature-kinds
  String get browseFeatureKinds => '/v1/geography/feature-kinds';

  /// GET /v1/geography/features
  String get browseFeatures => '/v1/geography/features';

  /// GET /v1/geography/geometries
  String get browseGeometries => '/v1/geography/geometries';

  /// GET /v1/geography/features/{featureId}
  String getFeature({required String featureId}) => '/v1/geography/features/$featureId';

  /// GET /v1/geography/features/{featureId}/geometries
  String listFeatureGeometries({required String featureId}) => '/v1/geography/features/$featureId/geometries';
}
