import 'package:json_annotation/json_annotation.dart';

/// Provision Kind
enum LegalProvisionKind {
  @JsonValue('article')
  article,
  @JsonValue('chapter')
  chapter,
  @JsonValue('clause')
  clause,
  @JsonValue('definition')
  definition,
  @JsonValue('item')
  item,
  @JsonValue('paragraph')
  paragraph,
  @JsonValue('part')
  part,
  @JsonValue('preamble')
  preamble,
  @JsonValue('schedule')
  schedule,
  @JsonValue('subparagraph')
  subparagraph,
}
