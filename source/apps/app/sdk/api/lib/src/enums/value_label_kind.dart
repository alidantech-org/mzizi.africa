import 'package:json_annotation/json_annotation.dart';

/// Value Label Kind
enum ValueLabelKind {
  @JsonValue('abbreviation')
  abbreviation,
  @JsonValue('alternative')
  alternative,
  @JsonValue('definition')
  definition,
  @JsonValue('preferred')
  preferred;
}