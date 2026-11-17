import 'package:json_annotation/json_annotation.dart';

/// Value Label Kind
enum ReferenceValueLabelKind {
  @JsonValue('abbreviation')
  abbreviation,
  @JsonValue('alternative')
  alternative,
  @JsonValue('definition')
  definition,
  @JsonValue('preferred')
  preferred,
}
