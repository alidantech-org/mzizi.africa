/// Typed route registry for the Geography group. Static paths are getters;
/// parameterised paths are methods that interpolate their segments.
class GeographyEndpoints {
  const GeographyEndpoints();

  /// GET /v1/geography/at
  String get findPlacesAtPoint => '/v1/geography/at';

  /// GET /v1/geography/outlines
  String get getOutline => '/v1/geography/outlines';

  /// GET /v1/geography/places/{code}
  String getPlace({required String code}) => '/v1/geography/places/$code';

  /// GET /v1/geography/child-outlines
  String get listChildOutlines => '/v1/geography/child-outlines';

  /// GET /v1/geography/children
  String get listChildren => '/v1/geography/children';

  /// GET /v1/geography/places
  String get listPlaces => '/v1/geography/places';
}
