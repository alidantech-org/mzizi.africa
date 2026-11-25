import 'package:json_annotation/json_annotation.dart';

/// Release Status
enum ProductReleaseStatus {
  @JsonValue('live')
  live,
  @JsonValue('paused')
  paused,
  @JsonValue('preparing')
  preparing,
  @JsonValue('withdrawn')
  withdrawn,
}
