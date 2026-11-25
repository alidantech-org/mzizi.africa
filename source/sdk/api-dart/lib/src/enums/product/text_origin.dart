import 'package:json_annotation/json_annotation.dart';

/// Text Origin
enum ProductTextOrigin {
  @JsonValue('human')
  human,
  @JsonValue('machine')
  machine,
  @JsonValue('original')
  original,
}
