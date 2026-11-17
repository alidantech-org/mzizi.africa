import 'package:json_annotation/json_annotation.dart';
import '../enums/value_relation_kind.dart';
import 'association.dart';
import 'value.dart';

part 'value_relation.g.dart';

/// A directed, typed, time-aware relation between classification values; supports multi-parent and cross-scheme taxonomy, such as a regional label that maps to a broader global kind.
@JsonSerializable(includeIfNull: false)
class ValueRelation {
  const ValueRelation({
    required this.createdAt,
    this.deletedAt,
    required this.id,
    required this.relationKind,
    required this.sourceValueId,
    required this.targetValueId,
    this.validFrom,
    this.validUntil,
  });
  final DateTime createdAt;
  final DateTime? deletedAt;
  final String id;
  final ValueRelationKind relationKind;
  final String sourceValueId;
  final String targetValueId;
  final DateTime? validFrom;
  final DateTime? validUntil;

  factory ValueRelation.fromJson(Map<String, dynamic> json) => _$ValueRelationFromJson(json);

  Map<String, dynamic> toJson() => _$ValueRelationToJson(this);
}