/// Typed route registry for the Source group. Static paths are getters;
/// parameterised paths are methods that interpolate their segments.
class SourceEndpoints {
  const SourceEndpoints();

  /// GET /v1/source/evidence
  String get listEvidence => '/v1/source/evidence';

  /// GET /v1/source/sources
  String get listSources => '/v1/source/sources';
}
