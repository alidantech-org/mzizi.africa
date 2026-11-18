/// Typed route registry for the Insights group. Static paths are getters;
/// parameterised paths are methods that interpolate their segments.
class InsightsEndpoints {
  const InsightsEndpoints();

  /// GET /v1/browse
  String get browsePlaces => '/v1/browse';

  /// GET /v1/elections/{electionId}
  String getElection({required String electionId}) => '/v1/elections/$electionId';

  /// GET /v1/statistics/indicators/{indicatorCode}/map
  String getIndicatorMap({required String indicatorCode}) => '/v1/statistics/indicators/$indicatorCode/map';

  /// GET /v1/statistics/indicators/{indicatorCode}/series
  String getIndicatorSeries({required String indicatorCode}) => '/v1/statistics/indicators/$indicatorCode/series';

  /// GET /v1/leaders/{id}
  String getLeaderProfile({required String id}) => '/v1/leaders/$id';

  /// GET /v1/leaderboards/{metricCode}
  String getLeaderboard({required String metricCode}) => '/v1/leaderboards/$metricCode';

  /// GET /v1/motions/{code}
  String getMotion({required String code}) => '/v1/motions/$code';

  /// GET /v1/projects/near
  String get getNearbyProjects => '/v1/projects/near';

  /// GET /v1/parties/{code}
  String getParty({required String code}) => '/v1/parties/$code';

  /// GET /v1/civic/places/{featureId}
  String getPlaceCivic({required String featureId}) => '/v1/civic/places/$featureId';

  /// GET /v1/elections/places/{featureId}
  String getPlaceElections({required String featureId}) => '/v1/elections/places/$featureId';

  /// GET /v1/statistics/places/{featureId}
  String getPlaceStatistics({required String featureId}) => '/v1/statistics/places/$featureId';

  /// GET /v1/projects/{code}
  String getProject({required String code}) => '/v1/projects/$code';

  /// GET /v1/search
  String get globalSearch => '/v1/search';

  /// GET /v1/elections
  String get listElections => '/v1/elections';

  /// GET /v1/leaderboards
  String get listLeaderboardMetrics => '/v1/leaderboards';

  /// GET /v1/motions
  String get listMotions => '/v1/motions';

  /// GET /v1/parties
  String get listParties => '/v1/parties';

  /// GET /v1/tenders
  String get listTenders => '/v1/tenders';
}
