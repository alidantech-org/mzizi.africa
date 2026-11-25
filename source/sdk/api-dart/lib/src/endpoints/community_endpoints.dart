/// Typed route registry for the Community group. Static paths are getters;
/// parameterised paths are methods that interpolate their segments.
class CommunityEndpoints {
  const CommunityEndpoints();

  /// GET /v1/community/posts
  String get listPosts => '/v1/community/posts';

  /// POST /v1/community/views
  String get recordView => '/v1/community/views';
}
