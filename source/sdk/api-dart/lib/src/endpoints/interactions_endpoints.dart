/// Typed route registry for the Interactions group. Static paths are getters;
/// parameterised paths are methods that interpolate their segments.
class InteractionsEndpoints {
  const InteractionsEndpoints();

  /// GET /v1/engagement
  String get getEngagement => '/v1/engagement';

  /// POST /v1/likes
  String get like => '/v1/likes';

  /// POST /v1/views
  String get recordView => '/v1/views';

  /// POST /v1/likes/remove
  String get unlike => '/v1/likes/remove';
}
