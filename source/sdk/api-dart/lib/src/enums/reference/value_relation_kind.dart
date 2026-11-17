import 'package:json_annotation/json_annotation.dart';

/// Value Relation Kind
enum ReferenceValueRelationKind {
  @JsonValue('broader_than')
  broaderThan,
  @JsonValue('narrower_than')
  narrowerThan,
  @JsonValue('related_to')
  relatedTo,
}
