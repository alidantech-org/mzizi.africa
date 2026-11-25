import 'package:json_annotation/json_annotation.dart';

/// Name Kind
enum EconomyNameKind {
  @JsonValue('alternative')
  alternative,
  @JsonValue('plural')
  plural,
  @JsonValue('preferred')
  preferred,
  @JsonValue('short')
  short,
}
