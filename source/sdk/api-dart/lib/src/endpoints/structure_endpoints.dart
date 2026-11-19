/// Typed route registry for the Structure group. Static paths are getters;
/// parameterised paths are methods that interpolate their segments.
class StructureEndpoints {
  const StructureEndpoints();

  /// GET /v1/structure/context
  String get getCountryContext => '/v1/structure/context';

  /// GET /v1/structure
  String get getStructureScreen => '/v1/structure';
}
