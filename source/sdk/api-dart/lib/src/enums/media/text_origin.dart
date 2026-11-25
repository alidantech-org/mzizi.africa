import 'package:json_annotation/json_annotation.dart';

/// Text Origin
enum MediaTextOrigin {
  @JsonValue('human')
  human,
  @JsonValue('machine')
  machine,
  @JsonValue('original')
  original,
}
