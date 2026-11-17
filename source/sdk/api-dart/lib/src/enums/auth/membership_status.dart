import 'package:json_annotation/json_annotation.dart';

/// Membership Status
enum AuthMembershipStatus {
  @JsonValue('active')
  active,
  @JsonValue('expired')
  expired,
  @JsonValue('pending')
  pending,
  @JsonValue('revoked')
  revoked,
  @JsonValue('suspended')
  suspended,
}
