import 'package:json_annotation/json_annotation.dart';

/// Translation Method
enum LegalTranslationMethod {
  @JsonValue('human')
  human,
  @JsonValue('machine')
  machine,
}
