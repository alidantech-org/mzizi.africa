import 'package:json_annotation/json_annotation.dart';

/// Reference Method
enum LegalReferenceMethod {
  @JsonValue('human')
  human,
  @JsonValue('model')
  model,
  @JsonValue('parser')
  parser,
}
