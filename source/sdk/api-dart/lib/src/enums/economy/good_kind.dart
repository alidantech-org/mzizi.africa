import 'package:json_annotation/json_annotation.dart';

/// Good Kind
enum EconomyGoodKind {
  @JsonValue('good')
  good,
  @JsonValue('service')
  service,
  @JsonValue('works')
  works,
}
