import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/enums/reference/value_relation_kind.dart';
import 'package:mzizi_api/src/models/reference/value.dart';
import 'package:mzizi_api/src/models/shared/association.dart';

part 'value_relation.g.dart';

/// A directed, typed, time-aware relation between classification values; supports multi-parent and cross-scheme taxonomy, such as a regional label that maps to a broader global kind.
@JsonSerializable(includeIfNull: false)
class ReferenceValueRelation {
  const ReferenceValueRelation({
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
  final ReferenceValueRelationKind relationKind;
  final String sourceValueId;
  final String targetValueId;
  final DateTime? validFrom;
  final DateTime? validUntil;

  factory ReferenceValueRelation.fromJson(Map<String, dynamic> json) => _$ReferenceValueRelationFromJson(json);

  Map<String, dynamic> toJson() => _$ReferenceValueRelationToJson(this);
}
