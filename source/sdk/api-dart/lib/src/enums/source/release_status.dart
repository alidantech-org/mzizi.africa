import 'package:json_annotation/json_annotation.dart';

/// Release Status
enum SourceReleaseStatus {
  @JsonValue('approved')
  approved,
  @JsonValue('retired')
  retired,
  @JsonValue('withdrawn')
  withdrawn,
}
