import 'package:json_annotation/json_annotation.dart';

/// Value Relation Kind
enum ValueRelationKind {
  @JsonValue('broader_than')
  broaderThan,
  @JsonValue('narrower_than')
  narrowerThan,
  @JsonValue('related_to')
  relatedTo;
}