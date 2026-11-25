import 'package:flutter_api_bridge/flutter_api_bridge.dart';
import 'package:mzizi_api/src/endpoints/statistics_endpoints.dart';
import 'package:mzizi_api/src/models/statistics/figure_collection.dart';
import 'package:mzizi_api/src/models/statistics/indicator_collection.dart';
import 'package:mzizi_api/src/models/statistics/indicator_detail.dart';
import 'package:mzizi_api/src/models/statistics/indicator_figure_collection.dart';
import 'package:mzizi_api/src/models/statistics/indicator_figures.dart';
import 'package:mzizi_api/src/models/statistics/indicator_key.dart';
import 'package:mzizi_api/src/models/statistics/indicator_window.dart';
import 'package:mzizi_api/src/models/statistics/observation_collection.dart';
import 'package:mzizi_api/src/models/statistics/observation_scope.dart';
import 'package:mzizi_api/src/models/statistics/place_figures.dart';

/// Typed client for the Statistics group. Every method runs through the package's
/// ApiConnection and tags its request with a stable operation ID.
class StatisticsFeature {
  const StatisticsFeature(this._connection);

  final ApiConnection _connection;

  static const _routes = StatisticsEndpoints();

  /// One indicator with the breakdowns it allows.
  ///
  /// GET /v1/statistics/indicators/{code}
  Future<ApiResult<StatisticsIndicatorDetail>> getIndicator({required String code, ApiGetRequestOptions? options}) {
    return _connection.execute(
      GetRequest<StatisticsIndicatorDetail>(
        endpoint: _routes.getIndicator(code: code),
        options: (options ?? const ApiGetRequestOptions()).copyWith(operationId: 'statistics.getIndicator'),
        fromJson: (json) => StatisticsIndicatorDetail.fromJson(Map<String, dynamic>.from((json as Map?) ?? const {})),
      ),
    );
  }

  /// The figures of one indicator for every place of a country, for maps and rankings.
  ///
  /// GET /v1/statistics/indicator-figures
  Future<ApiResult<StatisticsIndicatorFigureCollection>> listIndicatorFigures({
    StatisticsIndicatorFigures? input,
    ApiGetRequestOptions? options,
  }) {
    return _connection.execute(
      GetRequest<StatisticsIndicatorFigureCollection>(
        endpoint: _routes.listIndicatorFigures,
        options: (options ?? const ApiGetRequestOptions()).copyWith(operationId: 'statistics.listIndicatorFigures'),
        query: input?.toJson(),
        fromJson: (json) => StatisticsIndicatorFigureCollection.fromJson(Map<String, dynamic>.from((json as Map?) ?? const {})),
      ),
    );
  }

  /// Indicators with unit, decimals, frequency and names, optionally of one topic.
  ///
  /// GET /v1/statistics/indicators
  Future<ApiResult<StatisticsIndicatorCollection>> listIndicators({StatisticsIndicatorWindow? input, ApiGetRequestOptions? options}) {
    return _connection.execute(
      GetRequest<StatisticsIndicatorCollection>(
        endpoint: _routes.listIndicators,
        options: (options ?? const ApiGetRequestOptions()).copyWith(operationId: 'statistics.listIndicators'),
        query: input?.toJson(),
        fromJson: (json) => StatisticsIndicatorCollection.fromJson(Map<String, dynamic>.from((json as Map?) ?? const {})),
      ),
    );
  }

  /// Every published observation behind a place's figures: other sources and revision history.
  ///
  /// GET /v1/statistics/observations
  Future<ApiResult<StatisticsObservationCollection>> listObservations({StatisticsObservationScope? input, ApiGetRequestOptions? options}) {
    return _connection.execute(
      GetRequest<StatisticsObservationCollection>(
        endpoint: _routes.listObservations,
        options: (options ?? const ApiGetRequestOptions()).copyWith(operationId: 'statistics.listObservations'),
        query: input?.toJson(),
        fromJson: (json) => StatisticsObservationCollection.fromJson(Map<String, dynamic>.from((json as Map?) ?? const {})),
      ),
    );
  }

  /// The figures to show for one place, optionally of one indicator, newest period first.
  ///
  /// GET /v1/statistics/figures
  Future<ApiResult<StatisticsFigureCollection>> listPlaceFigures({StatisticsPlaceFigures? input, ApiGetRequestOptions? options}) {
    return _connection.execute(
      GetRequest<StatisticsFigureCollection>(
        endpoint: _routes.listPlaceFigures,
        options: (options ?? const ApiGetRequestOptions()).copyWith(operationId: 'statistics.listPlaceFigures'),
        query: input?.toJson(),
        fromJson: (json) => StatisticsFigureCollection.fromJson(Map<String, dynamic>.from((json as Map?) ?? const {})),
      ),
    );
  }
}
