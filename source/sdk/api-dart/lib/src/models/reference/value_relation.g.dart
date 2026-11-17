// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'value_relation.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

ReferenceValueRelation _$ReferenceValueRelationFromJson(Map<String, dynamic> json) => ReferenceValueRelation(
  createdAt: DateTime.parse(json['createdAt'] as String),
  deletedAt: json['deletedAt'] == null ? null : DateTime.parse(json['deletedAt'] as String),
  id: json['id'] as String,
  relationKind: $enumDecode(_$ReferenceValueRelationKindEnumMap, json['relationKind']),
  sourceValueId: json['sourceValueId'] as String,
  targetValueId: json['targetValueId'] as String,
  validFrom: json['validFrom'] == null ? null : DateTime.parse(json['validFrom'] as String),
  validUntil: json['validUntil'] == null ? null : DateTime.parse(json['validUntil'] as String),
);

Map<String, dynamic> _$ReferenceValueRelationToJson(ReferenceValueRelation instance) => <String, dynamic>{
  'createdAt': instance.createdAt.toIso8601String(),
  'deletedAt': ?instance.deletedAt?.toIso8601String(),
  'id': instance.id,
  'relationKind': _$ReferenceValueRelationKindEnumMap[instance.relationKind]!,
  'sourceValueId': instance.sourceValueId,
  'targetValueId': instance.targetValueId,
  'validFrom': ?instance.validFrom?.toIso8601String(),
  'validUntil': ?instance.validUntil?.toIso8601String(),
};

const _$ReferenceValueRelationKindEnumMap = {
  ReferenceValueRelationKind.broaderThan: 'broader_than',
  ReferenceValueRelationKind.narrowerThan: 'narrower_than',
  ReferenceValueRelationKind.relatedTo: 'related_to',
};
