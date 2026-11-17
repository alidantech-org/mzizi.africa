import 'package:json_annotation/json_annotation.dart';
import 'features.dart';
import 'historical_validity_entity.dart';
import 'value.dart';

part 'relationships.g.dart';

/// A typed, dated directed relationship between features; separate rows allow overlapping administrative, electoral, statistical and other systems.
@JsonSerializable(includeIfNull: false)
class Relationships {
  const Relationships({
    required this.createdAt,
    this.deletedAt,
    required this.id,
    required this.objectFeatureId,
    required this.relationshipKindId,
    required this.subjectFeatureId,
    required this.systemId,
    required this.updatedAt,
    this.validFrom,
    this.validFromEarliest,
    this.validFromLatest,
    this.validUntil,
    this.validUntilEarliest,
    this.validUntilLatest,
    required this.version,
  });
  final DateTime createdAt;
  final DateTime? deletedAt;
  final String id;
  final String objectFeatureId;
  final String relationshipKindId;
  final String subjectFeatureId;
  final String systemId;
  final DateTime updatedAt;
  final DateTime? validFrom;
  final DateTime? validFromEarliest;
  final DateTime? validFromLatest;
  final DateTime? validUntil;
  final DateTime? validUntilEarliest;
  final DateTime? validUntilLatest;
  final int version;

  factory Relationships.fromJson(Map<String, dynamic> json) => _$RelationshipsFromJson(json);

  Map<String, dynamic> toJson() => _$RelationshipsToJson(this);
}