// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'provisions.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

LegalProvisions _$LegalProvisionsFromJson(Map<String, dynamic> json) => LegalProvisions(
  code: json['code'] as String,
  createdAt: DateTime.parse(json['createdAt'] as String),
  deletedAt: json['deletedAt'] == null ? null : DateTime.parse(json['deletedAt'] as String),
  designation: json['designation'] as String,
  id: json['id'] as String,
  instrumentId: json['instrumentId'] as String,
  kind: $enumDecode(_$LegalProvisionKindEnumMap, json['kind']),
  parentId: json['parentId'] as String?,
  position: (json['position'] as num).toInt(),
  updatedAt: DateTime.parse(json['updatedAt'] as String),
  version: (json['version'] as num).toInt(),
);

Map<String, dynamic> _$LegalProvisionsToJson(LegalProvisions instance) => <String, dynamic>{
  'code': instance.code,
  'createdAt': instance.createdAt.toIso8601String(),
  'deletedAt': ?instance.deletedAt?.toIso8601String(),
  'designation': instance.designation,
  'id': instance.id,
  'instrumentId': instance.instrumentId,
  'kind': _$LegalProvisionKindEnumMap[instance.kind]!,
  'parentId': ?instance.parentId,
  'position': instance.position,
  'updatedAt': instance.updatedAt.toIso8601String(),
  'version': instance.version,
};

const _$LegalProvisionKindEnumMap = {
  LegalProvisionKind.article: 'article',
  LegalProvisionKind.chapter: 'chapter',
  LegalProvisionKind.clause: 'clause',
  LegalProvisionKind.definition: 'definition',
  LegalProvisionKind.item: 'item',
  LegalProvisionKind.paragraph: 'paragraph',
  LegalProvisionKind.partValue: 'part',
  LegalProvisionKind.preamble: 'preamble',
  LegalProvisionKind.schedule: 'schedule',
  LegalProvisionKind.subparagraph: 'subparagraph',
};
