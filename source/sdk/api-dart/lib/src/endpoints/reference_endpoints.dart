/// Typed route registry for the Reference group. Static paths are getters;
/// parameterised paths are methods that interpolate their segments.
class ReferenceEndpoints {
  const ReferenceEndpoints();

  /// GET /v1/reference/values
  String get browseSchemeMembers => '/v1/reference/values';

  /// GET /v1/reference/schemes
  String get browseSchemes => '/v1/reference/schemes';

  /// GET /v1/reference/lookup
  String get lookupMember => '/v1/reference/lookup';
}
