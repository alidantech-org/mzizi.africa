import 'package:json_annotation/json_annotation.dart';

/// Location Check
enum CommunityLocationCheck {
  @JsonValue('inside')
  inside,
  @JsonValue('near')
  near,
  @JsonValue('outside')
  outside,
  @JsonValue('suspected-mock')
  suspectedMock,
  @JsonValue('unavailable')
  unavailable,
}
