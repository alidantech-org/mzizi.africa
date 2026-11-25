import 'package:flutter_api_bridge/flutter_api_bridge.dart';
import 'package:mzizi_api/src/endpoints/history_endpoints.dart';
import 'package:mzizi_api/src/models/history/country_timeline.dart';
import 'package:mzizi_api/src/models/history/era_collection.dart';
import 'package:mzizi_api/src/models/history/history_collection.dart';

/// Typed client for the History group. Every method runs through the package's
/// ApiConnection and tags its request with a stable operation ID.
class HistoryFeature {
  const HistoryFeature(this._connection);

  final ApiConnection _connection;

  static const _routes = HistoryEndpoints();

  /// A country's named eras in time order.
  ///
  /// GET /v1/history/eras
  Future<ApiResult<HistoryEraCollection>> listEras({HistoryCountryTimeline? input, ApiGetRequestOptions? options}) {
    return _connection.execute(
      GetRequest<HistoryEraCollection>(
        endpoint: _routes.listEras,
        options: (options ?? const ApiGetRequestOptions()).copyWith(operationId: 'history.listEras'),
        query: input?.toJson(),
        fromJson: (json) => HistoryEraCollection.fromJson(Map<String, dynamic>.from((json as Map?) ?? const {})),
      ),
    );
  }

  /// A country's historical occurrences in time order.
  ///
  /// GET /v1/history/occurrences
  Future<ApiResult<HistoryHistoryCollection>> listHistory({HistoryCountryTimeline? input, ApiGetRequestOptions? options}) {
    return _connection.execute(
      GetRequest<HistoryHistoryCollection>(
        endpoint: _routes.listHistory,
        options: (options ?? const ApiGetRequestOptions()).copyWith(operationId: 'history.listHistory'),
        query: input?.toJson(),
        fromJson: (json) => HistoryHistoryCollection.fromJson(Map<String, dynamic>.from((json as Map?) ?? const {})),
      ),
    );
  }
}
