/// Typed route registry for the History group. Static paths are getters;
/// parameterised paths are methods that interpolate their segments.
class HistoryEndpoints {
  const HistoryEndpoints();

  /// GET /v1/history/eras
  String get listEras => '/v1/history/eras';

  /// GET /v1/history/occurrences
  String get listHistory => '/v1/history/occurrences';
}
