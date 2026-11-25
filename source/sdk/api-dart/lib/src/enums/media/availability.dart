import 'package:json_annotation/json_annotation.dart';

/// Availability
enum MediaAvailability {
  @JsonValue('live')
  live,
  @JsonValue('removed')
  removed,
  @JsonValue('unavailable')
  unavailable,
}
