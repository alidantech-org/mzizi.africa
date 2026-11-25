/// Typed route registry for the Event group. Static paths are getters;
/// parameterised paths are methods that interpolate their segments.
class EventEndpoints {
  const EventEndpoints();

  /// GET /v1/event/occurrences
  String get listOccurrences => '/v1/event/occurrences';
}
