import 'package:json_annotation/json_annotation.dart';

/// Text Origin
enum LegislatureTextOrigin {
  @JsonValue('human')
  human,
  @JsonValue('machine')
  machine,
  @JsonValue('original')
  original,
}
