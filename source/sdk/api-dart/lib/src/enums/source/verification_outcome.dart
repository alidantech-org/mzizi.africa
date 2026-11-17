import 'package:json_annotation/json_annotation.dart';

/// Verification Outcome
enum SourceVerificationOutcome {
  @JsonValue('contradicted')
  contradicted,
  @JsonValue('disputed')
  disputed,
  @JsonValue('insufficient')
  insufficient,
  @JsonValue('supported')
  supported,
}
