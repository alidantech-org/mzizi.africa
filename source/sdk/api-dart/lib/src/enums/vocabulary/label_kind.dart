import 'package:json_annotation/json_annotation.dart';

/// Label Kind
enum VocabularyLabelKind {
  @JsonValue('abbreviation')
  abbreviation,
  @JsonValue('alternative')
  alternative,
  @JsonValue('definition')
  definition,
  @JsonValue('plural')
  plural,
  @JsonValue('preferred')
  preferred,
  @JsonValue('short')
  short,
}
