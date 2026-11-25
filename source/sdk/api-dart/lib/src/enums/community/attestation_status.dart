import 'package:json_annotation/json_annotation.dart';

/// Attestation Status
enum CommunityAttestationStatus {
  @JsonValue('failed')
  failed,
  @JsonValue('none')
  none,
  @JsonValue('passed')
  passed,
  @JsonValue('unavailable')
  unavailable,
}
