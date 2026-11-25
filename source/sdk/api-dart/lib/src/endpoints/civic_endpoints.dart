/// Typed route registry for the Civic group. Static paths are getters;
/// parameterised paths are methods that interpolate their segments.
class CivicEndpoints {
  const CivicEndpoints();

  /// GET /v1/civic/projects/{code}
  String getProject({required String code}) => '/v1/civic/projects/$code';

  /// GET /v1/civic/tenders/{code}
  String getTender({required String code}) => '/v1/civic/tenders/$code';

  /// GET /v1/civic/facilities
  String get listFacilities => '/v1/civic/facilities';

  /// GET /v1/civic/projects
  String get listPlaceProjects => '/v1/civic/projects';

  /// GET /v1/civic/tenders
  String get listTenders => '/v1/civic/tenders';
}
