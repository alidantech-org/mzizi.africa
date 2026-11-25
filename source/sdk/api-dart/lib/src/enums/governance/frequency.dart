import 'package:json_annotation/json_annotation.dart';

/// Frequency
enum GovernanceFrequency {
  @JsonValue('annual')
  annual,
  @JsonValue('monthly')
  monthly,
  @JsonValue('on-event')
  onEvent,
  @JsonValue('per-term')
  perTerm,
  @JsonValue('quarterly')
  quarterly,
}
