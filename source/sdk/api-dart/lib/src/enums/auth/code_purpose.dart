import 'package:json_annotation/json_annotation.dart';

/// Code Purpose
enum AuthCodePurpose {
  @JsonValue('change')
  change,
  @JsonValue('signin')
  signin,
  @JsonValue('signup')
  signup,
}
