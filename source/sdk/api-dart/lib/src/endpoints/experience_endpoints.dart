/// Typed route registry for the Experience group. Static paths are getters;
/// parameterised paths are methods that interpolate their segments.
class ExperienceEndpoints {
  const ExperienceEndpoints();

  /// GET /v1/calendar
  String get getCalendar => '/v1/calendar';

  /// GET /v1/context
  String get getContext => '/v1/context';

  /// GET /v1/facilities/{code}
  String getFacility({required String code}) => '/v1/facilities/$code';

  /// GET /v1/facilities
  String get listFacilities => '/v1/facilities';

  /// GET /v1/facts
  String get listFacts => '/v1/facts';
}
