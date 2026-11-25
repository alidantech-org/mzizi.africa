import 'package:json_annotation/json_annotation.dart';

/// Verdict
enum CommunityVerdict {
  @JsonValue('fail')
  fail,
  @JsonValue('flag')
  flag,
  @JsonValue('pass')
  pass,
}
