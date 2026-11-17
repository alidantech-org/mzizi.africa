import 'package:json_annotation/json_annotation.dart';

/// Account Status
enum AuthAccountStatus {
  @JsonValue('active')
  active,
  @JsonValue('closed')
  closed,
  @JsonValue('suspended')
  suspended,
}
