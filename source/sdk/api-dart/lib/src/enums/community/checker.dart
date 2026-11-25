import 'package:json_annotation/json_annotation.dart';

/// Checker
enum CommunityChecker {
  @JsonValue('ai')
  ai,
  @JsonValue('human')
  human,
  @JsonValue('rules')
  rules,
}
