import 'package:json_annotation/json_annotation.dart';

/// Code Channel
enum AuthCodeChannel {
  @JsonValue('email')
  email,
  @JsonValue('sms')
  sms,
}
