/// Typed route registry for the Statistics group. Static paths are getters;
/// parameterised paths are methods that interpolate their segments.
class StatisticsEndpoints {
  const StatisticsEndpoints();

  /// GET /v1/statistics/indicators/{code}
  String getIndicator({required String code}) => '/v1/statistics/indicators/$code';

  /// GET /v1/statistics/indicator-figures
  String get listIndicatorFigures => '/v1/statistics/indicator-figures';

  /// GET /v1/statistics/indicators
  String get listIndicators => '/v1/statistics/indicators';

  /// GET /v1/statistics/observations
  String get listObservations => '/v1/statistics/observations';

  /// GET /v1/statistics/figures
  String get listPlaceFigures => '/v1/statistics/figures';
}
