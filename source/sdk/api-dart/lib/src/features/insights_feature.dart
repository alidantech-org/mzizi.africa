import 'package:flutter_api_bridge/flutter_api_bridge.dart';
import 'package:mzizi_api/src/endpoints/insights_endpoints.dart';
import 'package:mzizi_api/src/models/insights/board_input.dart';
import 'package:mzizi_api/src/models/insights/browse_input.dart';
import 'package:mzizi_api/src/models/insights/code_input.dart';
import 'package:mzizi_api/src/models/insights/election_detail.dart';
import 'package:mzizi_api/src/models/insights/election_input.dart';
import 'package:mzizi_api/src/models/insights/election_list.dart';
import 'package:mzizi_api/src/models/insights/id_input.dart';
import 'package:mzizi_api/src/models/insights/indicator_map.dart';
import 'package:mzizi_api/src/models/insights/indicator_series.dart';
import 'package:mzizi_api/src/models/insights/leader_profile.dart';
import 'package:mzizi_api/src/models/insights/leaderboard.dart';
import 'package:mzizi_api/src/models/insights/leaderboard_metric_list.dart';
import 'package:mzizi_api/src/models/insights/map_input.dart';
import 'package:mzizi_api/src/models/insights/motion_detail.dart';
import 'package:mzizi_api/src/models/insights/motion_list.dart';
import 'package:mzizi_api/src/models/insights/motions_input.dart';
import 'package:mzizi_api/src/models/insights/nearby_input.dart';
import 'package:mzizi_api/src/models/insights/nearby_projects.dart';
import 'package:mzizi_api/src/models/insights/party_detail.dart';
import 'package:mzizi_api/src/models/insights/party_list.dart';
import 'package:mzizi_api/src/models/insights/place_browse.dart';
import 'package:mzizi_api/src/models/insights/place_civic.dart';
import 'package:mzizi_api/src/models/insights/place_elections.dart';
import 'package:mzizi_api/src/models/insights/place_only.dart';
import 'package:mzizi_api/src/models/insights/place_statistics.dart';
import 'package:mzizi_api/src/models/insights/project_detail.dart';
import 'package:mzizi_api/src/models/insights/search_query.dart';
import 'package:mzizi_api/src/models/insights/search_results.dart';
import 'package:mzizi_api/src/models/insights/series_input.dart';
import 'package:mzizi_api/src/models/insights/tender_input.dart';
import 'package:mzizi_api/src/models/insights/tender_list.dart';

/// Typed client for the Insights group. Every method runs through the package's
/// ApiConnection and tags its request with a stable operation ID.
class InsightsFeature {
  const InsightsFeature(this._connection);

  final ApiConnection _connection;

  static const _routes = InsightsEndpoints();

  /// The country's hierarchy one level at a time (county, constituency, ward, town, village), with the path to the current unit.
  ///
  /// GET /v1/browse
  Future<ApiResult<InsightsPlaceBrowse>> browsePlaces({InsightsBrowseInput? input, ApiGetRequestOptions? options}) {
    return _connection.execute(
      GetRequest<InsightsPlaceBrowse>(
        endpoint: _routes.browsePlaces,
        options: (options ?? const ApiGetRequestOptions()).copyWith(operationId: 'insights.browsePlaces'),
        query: input?.toJson(),
        fromJson: (json) => InsightsPlaceBrowse.fromJson(Map<String, dynamic>.from((json as Map?) ?? const {})),
      ),
    );
  }

  /// One election: its contests, and results by unit under a parent, for tables and heat maps.
  ///
  /// GET /v1/elections/{electionId}
  Future<ApiResult<InsightsElectionDetail>> getElection({
    required String electionId,
    String? parentFeatureId,
    String? contestKind,
    ApiGetRequestOptions? options,
  }) {
    return _connection.execute(
      GetRequest<InsightsElectionDetail>(
        endpoint: _routes.getElection(electionId: electionId),
        options: (options ?? const ApiGetRequestOptions()).copyWith(operationId: 'insights.getElection'),
        query: <String, Object?>{
          if (parentFeatureId != null) 'parentFeatureId': parentFeatureId,
          if (contestKind != null) 'contestKind': contestKind,
        },
        fromJson: (json) => InsightsElectionDetail.fromJson(Map<String, dynamic>.from((json as Map?) ?? const {})),
      ),
    );
  }

  /// One indicator's latest value for each unit under a parent, for a heat map.
  ///
  /// GET /v1/statistics/indicators/{indicatorCode}/map
  Future<ApiResult<InsightsIndicatorMap>> getIndicatorMap({
    required String indicatorCode,
    String? parentFeatureId,
    String? kindCode,
    ApiGetRequestOptions? options,
  }) {
    return _connection.execute(
      GetRequest<InsightsIndicatorMap>(
        endpoint: _routes.getIndicatorMap(indicatorCode: indicatorCode),
        options: (options ?? const ApiGetRequestOptions()).copyWith(operationId: 'insights.getIndicatorMap'),
        query: <String, Object?>{if (parentFeatureId != null) 'parentFeatureId': parentFeatureId, if (kindCode != null) 'kindCode': kindCode},
        fromJson: (json) => InsightsIndicatorMap.fromJson(Map<String, dynamic>.from((json as Map?) ?? const {})),
      ),
    );
  }

  /// One indicator over time for one place, optionally broken down.
  ///
  /// GET /v1/statistics/indicators/{indicatorCode}/series
  Future<ApiResult<InsightsIndicatorSeries>> getIndicatorSeries({
    required String indicatorCode,
    String? featureId,
    ApiGetRequestOptions? options,
  }) {
    return _connection.execute(
      GetRequest<InsightsIndicatorSeries>(
        endpoint: _routes.getIndicatorSeries(indicatorCode: indicatorCode),
        options: (options ?? const ApiGetRequestOptions()).copyWith(operationId: 'insights.getIndicatorSeries'),
        query: <String, Object?>{if (featureId != null) 'featureId': featureId},
        fromJson: (json) => InsightsIndicatorSeries.fromJson(Map<String, dynamic>.from((json as Map?) ?? const {})),
      ),
    );
  }

  /// A leader: offices, contacts, media, voting and attendance record, the fund they oversee and evidence.
  ///
  /// GET /v1/leaders/{id}
  Future<ApiResult<InsightsLeaderProfile>> getLeaderProfile({required String id, ApiGetRequestOptions? options}) {
    return _connection.execute(
      GetRequest<InsightsLeaderProfile>(
        endpoint: _routes.getLeaderProfile(id: id),
        options: (options ?? const ApiGetRequestOptions()).copyWith(operationId: 'insights.getLeaderProfile'),
        fromJson: (json) => InsightsLeaderProfile.fromJson(Map<String, dynamic>.from((json as Map?) ?? const {})),
      ),
    );
  }

  /// Places (or leaders, parties) ranked by one metric, within a parent area and a level.
  ///
  /// GET /v1/leaderboards/{metricCode}
  Future<ApiResult<InsightsLeaderboard>> getLeaderboard({
    required String metricCode,
    String? kindCode,
    String? parentFeatureId,
    int? limit,
    ApiGetRequestOptions? options,
  }) {
    return _connection.execute(
      GetRequest<InsightsLeaderboard>(
        endpoint: _routes.getLeaderboard(metricCode: metricCode),
        options: (options ?? const ApiGetRequestOptions()).copyWith(operationId: 'insights.getLeaderboard'),
        query: <String, Object?>{
          if (kindCode != null) 'kindCode': kindCode,
          if (parentFeatureId != null) 'parentFeatureId': parentFeatureId,
          if (limit != null) 'limit': limit,
        },
        fromJson: (json) => InsightsLeaderboard.fromJson(Map<String, dynamic>.from((json as Map?) ?? const {})),
      ),
    );
  }

  /// One motion with the position of every member (yes, no, abstained, absent), the law or budget it concerns and the tally.
  ///
  /// GET /v1/motions/{code}
  Future<ApiResult<InsightsMotionDetail>> getMotion({required String code, ApiGetRequestOptions? options}) {
    return _connection.execute(
      GetRequest<InsightsMotionDetail>(
        endpoint: _routes.getMotion(code: code),
        options: (options ?? const ApiGetRequestOptions()).copyWith(operationId: 'insights.getMotion'),
        fromJson: (json) => InsightsMotionDetail.fromJson(Map<String, dynamic>.from((json as Map?) ?? const {})),
      ),
    );
  }

  /// Projects close to a position, nearest first, with status, who built them and the money, so a visitor sees what affects them.
  ///
  /// GET /v1/projects/near
  Future<ApiResult<InsightsNearbyProjects>> getNearbyProjects({InsightsNearbyInput? input, ApiGetRequestOptions? options}) {
    return _connection.execute(
      GetRequest<InsightsNearbyProjects>(
        endpoint: _routes.getNearbyProjects,
        options: (options ?? const ApiGetRequestOptions()).copyWith(operationId: 'insights.getNearbyProjects'),
        query: input?.toJson(),
        fromJson: (json) => InsightsNearbyProjects.fromJson(Map<String, dynamic>.from((json as Map?) ?? const {})),
      ),
    );
  }

  /// One party: members list, votes obtained by election and fund allocation.
  ///
  /// GET /v1/parties/{code}
  Future<ApiResult<InsightsPartyDetail>> getParty({required String code, ApiGetRequestOptions? options}) {
    return _connection.execute(
      GetRequest<InsightsPartyDetail>(
        endpoint: _routes.getParty(code: code),
        options: (options ?? const ApiGetRequestOptions()).copyWith(operationId: 'insights.getParty'),
        fromJson: (json) => InsightsPartyDetail.fromJson(Map<String, dynamic>.from((json as Map?) ?? const {})),
      ),
    );
  }

  /// Civic delivery in a place: fund allocations and spending by class and year, projects with locations, infrastructure and leadership.
  ///
  /// GET /v1/civic/places/{featureId}
  Future<ApiResult<InsightsPlaceCivic>> getPlaceCivic({required String featureId, ApiGetRequestOptions? options}) {
    return _connection.execute(
      GetRequest<InsightsPlaceCivic>(
        endpoint: _routes.getPlaceCivic(featureId: featureId),
        options: (options ?? const ApiGetRequestOptions()).copyWith(operationId: 'insights.getPlaceCivic'),
        fromJson: (json) => InsightsPlaceCivic.fromJson(Map<String, dynamic>.from((json as Map?) ?? const {})),
      ),
    );
  }

  /// Elections in a place over time: who won, with what votes, turnout and the registration trend.
  ///
  /// GET /v1/elections/places/{featureId}
  Future<ApiResult<InsightsPlaceElections>> getPlaceElections({required String featureId, ApiGetRequestOptions? options}) {
    return _connection.execute(
      GetRequest<InsightsPlaceElections>(
        endpoint: _routes.getPlaceElections(featureId: featureId),
        options: (options ?? const ApiGetRequestOptions()).copyWith(operationId: 'insights.getPlaceElections'),
        fromJson: (json) => InsightsPlaceElections.fromJson(Map<String, dynamic>.from((json as Map?) ?? const {})),
      ),
    );
  }

  /// Population and other statistics of a place, by topic, with history, breakdowns and comparison to its parents.
  ///
  /// GET /v1/statistics/places/{featureId}
  Future<ApiResult<InsightsPlaceStatistics>> getPlaceStatistics({required String featureId, ApiGetRequestOptions? options}) {
    return _connection.execute(
      GetRequest<InsightsPlaceStatistics>(
        endpoint: _routes.getPlaceStatistics(featureId: featureId),
        options: (options ?? const ApiGetRequestOptions()).copyWith(operationId: 'insights.getPlaceStatistics'),
        fromJson: (json) => InsightsPlaceStatistics.fromJson(Map<String, dynamic>.from((json as Map?) ?? const {})),
      ),
    );
  }

  /// One project: where, who is responsible, the money, the procurement, pictures and evidence.
  ///
  /// GET /v1/projects/{code}
  Future<ApiResult<InsightsProjectDetail>> getProject({required String code, ApiGetRequestOptions? options}) {
    return _connection.execute(
      GetRequest<InsightsProjectDetail>(
        endpoint: _routes.getProject(code: code),
        options: (options ?? const ApiGetRequestOptions()).copyWith(operationId: 'insights.getProject'),
        fromJson: (json) => InsightsProjectDetail.fromJson(Map<String, dynamic>.from((json as Map?) ?? const {})),
      ),
    );
  }

  /// One search over places, leaders, parties, projects, tenders, indicators, sources and laws; every hit says what it is.
  ///
  /// GET /v1/search
  Future<ApiResult<InsightsSearchResults>> globalSearch({InsightsSearchQuery? input, ApiGetRequestOptions? options}) {
    return _connection.execute(
      GetRequest<InsightsSearchResults>(
        endpoint: _routes.globalSearch,
        options: (options ?? const ApiGetRequestOptions()).copyWith(operationId: 'insights.globalSearch'),
        query: input?.toJson(),
        fromJson: (json) => InsightsSearchResults.fromJson(Map<String, dynamic>.from((json as Map?) ?? const {})),
      ),
    );
  }

  /// Every election the system knows, newest first.
  ///
  /// GET /v1/elections
  Future<ApiResult<InsightsElectionList>> listElections({ApiGetRequestOptions? options}) {
    return _connection.execute(
      GetRequest<InsightsElectionList>(
        endpoint: _routes.listElections,
        options: (options ?? const ApiGetRequestOptions()).copyWith(operationId: 'insights.listElections'),
        fromJson: (json) => InsightsElectionList.fromJson(Map<String, dynamic>.from((json as Map?) ?? const {})),
      ),
    );
  }

  /// What places can be ranked by: statistics, finance, civic delivery, procurement and elections.
  ///
  /// GET /v1/leaderboards
  Future<ApiResult<InsightsLeaderboardMetricList>> listLeaderboardMetrics({ApiGetRequestOptions? options}) {
    return _connection.execute(
      GetRequest<InsightsLeaderboardMetricList>(
        endpoint: _routes.listLeaderboardMetrics,
        options: (options ?? const ApiGetRequestOptions()).copyWith(operationId: 'insights.listLeaderboardMetrics'),
        fromJson: (json) => InsightsLeaderboardMetricList.fromJson(Map<String, dynamic>.from((json as Map?) ?? const {})),
      ),
    );
  }

  /// Motions, bills and decisions of public bodies, newest first.
  ///
  /// GET /v1/motions
  Future<ApiResult<InsightsMotionList>> listMotions({InsightsMotionsInput? input, ApiGetRequestOptions? options}) {
    return _connection.execute(
      GetRequest<InsightsMotionList>(
        endpoint: _routes.listMotions,
        options: (options ?? const ApiGetRequestOptions()).copyWith(operationId: 'insights.listMotions'),
        query: input?.toJson(),
        fromJson: (json) => InsightsMotionList.fromJson(Map<String, dynamic>.from((json as Map?) ?? const {})),
      ),
    );
  }

  /// Political parties ranked by members, votes and fund allocation.
  ///
  /// GET /v1/parties
  Future<ApiResult<InsightsPartyList>> listParties({ApiGetRequestOptions? options}) {
    return _connection.execute(
      GetRequest<InsightsPartyList>(
        endpoint: _routes.listParties,
        options: (options ?? const ApiGetRequestOptions()).copyWith(operationId: 'insights.listParties'),
        fromJson: (json) => InsightsPartyList.fromJson(Map<String, dynamic>.from((json as Map?) ?? const {})),
      ),
    );
  }

  /// Tenders and contracts: open, ongoing, closed, awarded and complete, with suppliers, plus transparency information.
  ///
  /// GET /v1/tenders
  Future<ApiResult<InsightsTenderList>> listTenders({InsightsTenderInput? input, ApiGetRequestOptions? options}) {
    return _connection.execute(
      GetRequest<InsightsTenderList>(
        endpoint: _routes.listTenders,
        options: (options ?? const ApiGetRequestOptions()).copyWith(operationId: 'insights.listTenders'),
        query: input?.toJson(),
        fromJson: (json) => InsightsTenderList.fromJson(Map<String, dynamic>.from((json as Map?) ?? const {})),
      ),
    );
  }
}
