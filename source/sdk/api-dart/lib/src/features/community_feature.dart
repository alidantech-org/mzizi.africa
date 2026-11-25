import 'package:flutter_api_bridge/flutter_api_bridge.dart';
import 'package:mzizi_api/src/endpoints/community_endpoints.dart';
import 'package:mzizi_api/src/models/community/identity_posts.dart';
import 'package:mzizi_api/src/models/community/post_collection.dart';
import 'package:mzizi_api/src/models/community/recorded.dart';
import 'package:mzizi_api/src/models/community/view_input.dart';

/// Typed client for the Community group. Every method runs through the package's
/// ApiConnection and tags its request with a stable operation ID.
class CommunityFeature {
  const CommunityFeature(this._connection);

  final ApiConnection _connection;

  static const _routes = CommunityEndpoints();

  /// Contributions about a named thing, newest first. The implementation returns published posts only.
  ///
  /// GET /v1/community/posts
  Future<ApiResult<CommunityPostCollection>> listPosts({CommunityIdentityPosts? input, ApiGetRequestOptions? options}) {
    return _connection.execute(
      GetRequest<CommunityPostCollection>(
        endpoint: _routes.listPosts,
        options: (options ?? const ApiGetRequestOptions()).copyWith(operationId: 'community.listPosts'),
        query: input?.toJson(),
        fromJson: (json) => CommunityPostCollection.fromJson(Map<String, dynamic>.from((json as Map?) ?? const {})),
      ),
    );
  }

  /// A named thing or article was viewed; one view per visitor per day.
  ///
  /// POST /v1/community/views
  Future<ApiResult<CommunityRecorded>> recordView({required CommunityViewInput body, ApiRequestOptions? options}) {
    return _connection.execute(
      PostRequest<CommunityRecorded>(
        endpoint: _routes.recordView,
        options: (options ?? const ApiRequestOptions()).copyWith(operationId: 'community.recordView'),
        body: body.toJson(),
        fromJson: (json) => CommunityRecorded.fromJson(Map<String, dynamic>.from((json as Map?) ?? const {})),
      ),
    );
  }
}
