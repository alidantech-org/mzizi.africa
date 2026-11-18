import 'package:json_annotation/json_annotation.dart';

/// Translation Method
enum LegalTranslationMethod {
  @JsonValue('assisted')
  assisted,
  @JsonValue('human')
  human,
  @JsonValue('machine')
  machine,
}
