import 'package:json_annotation/json_annotation.dart';

/// Site Status
enum ProductSiteStatus {
  @JsonValue('live')
  live,
  @JsonValue('planned')
  planned,
  @JsonValue('retired')
  retired,
}
