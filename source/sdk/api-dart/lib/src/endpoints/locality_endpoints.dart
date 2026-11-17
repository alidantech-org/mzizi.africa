/// Typed route registry for the Locality group. Static paths are getters;
/// parameterised paths are methods that interpolate their segments.
class LocalityEndpoints {
  const LocalityEndpoints();

  /// GET /v1/sources
  String get browseSources => '/v1/sources';

  /// GET /v1/evidence/{citationId}
  String getEvidence({required String citationId}) => '/v1/evidence/$citationId';

  /// GET /v1/locality/{featureId}
  String getLocality({required String featureId}) => '/v1/locality/$featureId';

  /// GET /v1/languages
  String get listLanguages => '/v1/languages';

  /// GET /v1/locality/at
  String get resolveLocality => '/v1/locality/at';

  /// GET /v1/locality/search
  String get searchLocalities => '/v1/locality/search';
}
