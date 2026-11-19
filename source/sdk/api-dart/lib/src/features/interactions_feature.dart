import 'package:flutter_api_bridge/flutter_api_bridge.dart';
import 'package:mzizi_api/src/endpoints/interactions_endpoints.dart';
import 'package:mzizi_api/src/models/interactions/engagement.dart';
import 'package:mzizi_api/src/models/interactions/engagement_input.dart';
import 'package:mzizi_api/src/models/interactions/like_input.dart';
import 'package:mzizi_api/src/models/interactions/recorded.dart';
import 'package:mzizi_api/src/models/interactions/view_input.dart';

/// Typed client for the Interactions group. Every method runs through the package's
/// ApiConnection and tags its request with a stable operation ID.
class InteractionsFeature {
  const InteractionsFeature(this._connection);

  final ApiConnection _connection;

  static const _routes = InteractionsEndpoints();

  /// How many likes a subject has, and whether this device has liked it. Views are counted and not returned.
  ///
  /// GET /v1/engagement
  Future<ApiResult<InteractionsEngagement>> getEngagement({InteractionsEngagementInput? input, ApiGetRequestOptions? options}) {
    return _connection.execute(
      GetRequest<InteractionsEngagement>(
        endpoint: _routes.getEngagement,
        options: (options ?? const ApiGetRequestOptions()).copyWith(operationId: 'interactions.getEngagement'),
        query: input?.toJson(),
        fromJson: (json) => InteractionsEngagement.fromJson(Map<String, dynamic>.from((json as Map?) ?? const {})),
      ),
    );
  }

  /// This device likes a subject; liking twice changes nothing.
  ///
  /// POST /v1/likes
  Future<ApiResult<InteractionsEngagement>> like({required InteractionsLikeInput body, ApiRequestOptions? options}) {
    return _connection.execute(
      PostRequest<InteractionsEngagement>(
        endpoint: _routes.like,
        options: (options ?? const ApiRequestOptions()).copyWith(operationId: 'interactions.like'),
        body: body.toJson(),
        fromJson: (json) => InteractionsEngagement.fromJson(Map<String, dynamic>.from((json as Map?) ?? const {})),
      ),
    );
  }

  /// A subject was viewed; one view per visitor per day.
  ///
  /// POST /v1/views
  Future<ApiResult<InteractionsRecorded>> recordView({required InteractionsViewInput body, ApiRequestOptions? options}) {
    return _connection.execute(
      PostRequest<InteractionsRecorded>(
        endpoint: _routes.recordView,
        options: (options ?? const ApiRequestOptions()).copyWith(operationId: 'interactions.recordView'),
        body: body.toJson(),
        fromJson: (json) => InteractionsRecorded.fromJson(Map<String, dynamic>.from((json as Map?) ?? const {})),
      ),
    );
  }

  /// This device withdraws its like.
  ///
  /// POST /v1/likes/remove
  Future<ApiResult<InteractionsEngagement>> unlike({required InteractionsLikeInput body, ApiRequestOptions? options}) {
    return _connection.execute(
      PostRequest<InteractionsEngagement>(
        endpoint: _routes.unlike,
        options: (options ?? const ApiRequestOptions()).copyWith(operationId: 'interactions.unlike'),
        body: body.toJson(),
        fromJson: (json) => InteractionsEngagement.fromJson(Map<String, dynamic>.from((json as Map?) ?? const {})),
      ),
    );
  }
}
