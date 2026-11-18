import 'package:json_annotation/json_annotation.dart';

/// Review Status
enum LegalReviewStatus {
  @JsonValue('accepted')
  accepted,
  @JsonValue('proposed')
  proposed,
  @JsonValue('rejected')
  rejected,
  @JsonValue('reviewed')
  reviewed,
}
