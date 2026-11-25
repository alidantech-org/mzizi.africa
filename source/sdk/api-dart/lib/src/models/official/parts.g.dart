// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'parts.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

OfficialParts _$OfficialPartsFromJson(Map<String, dynamic> json) => OfficialParts(
  createdAt: DateTime.parse(json['createdAt'] as String),
  deletedAt: json['deletedAt'] == null ? null : DateTime.parse(json['deletedAt'] as String),
  id: json['id'] as String,
  nameId: json['nameId'] as String,
  nameKind: $enumDecode(_$SharedIdentityKindEnumMap, json['nameKind']),
  part: $enumDecode(_$OfficialNamePartEnumMap, json['part']),
  position: (json['position'] as num).toInt(),
  text: json['text'] as String,
);

Map<String, dynamic> _$OfficialPartsToJson(OfficialParts instance) => <String, dynamic>{
  'createdAt': instance.createdAt.toIso8601String(),
  'deletedAt': ?instance.deletedAt?.toIso8601String(),
  'id': instance.id,
  'nameId': instance.nameId,
  'nameKind': _$SharedIdentityKindEnumMap[instance.nameKind]!,
  'part': _$OfficialNamePartEnumMap[instance.part]!,
  'position': instance.position,
  'text': instance.text,
};

const _$SharedIdentityKindEnumMap = {
  SharedIdentityKind.app: 'app',
  SharedIdentityKind.bill: 'bill',
  SharedIdentityKind.coalition: 'coalition',
  SharedIdentityKind.collection: 'collection',
  SharedIdentityKind.country: 'country',
  SharedIdentityKind.currency: 'currency',
  SharedIdentityKind.debt: 'debt',
  SharedIdentityKind.election: 'election',
  SharedIdentityKind.entity: 'entity',
  SharedIdentityKind.era: 'era',
  SharedIdentityKind.event: 'event',
  SharedIdentityKind.feature: 'feature',
  SharedIdentityKind.function: 'function',
  SharedIdentityKind.fund: 'fund',
  SharedIdentityKind.hierarchy: 'hierarchy',
  SharedIdentityKind.indicator: 'indicator',
  SharedIdentityKind.individual: 'individual',
  SharedIdentityKind.instrument: 'instrument',
  SharedIdentityKind.language: 'language',
  SharedIdentityKind.level: 'level',
  SharedIdentityKind.metric: 'metric',
  SharedIdentityKind.occurrence: 'occurrence',
  SharedIdentityKind.office: 'office',
  SharedIdentityKind.position: 'position',
  SharedIdentityKind.procedure: 'procedure',
  SharedIdentityKind.procurement: 'procurement',
  SharedIdentityKind.product: 'product',
  SharedIdentityKind.project: 'project',
  SharedIdentityKind.service: 'service',
  SharedIdentityKind.timezone: 'timezone',
  SharedIdentityKind.unit: 'unit',
};

const _$OfficialNamePartEnumMap = {
  OfficialNamePart.family: 'family',
  OfficialNamePart.given: 'given',
  OfficialNamePart.middle: 'middle',
  OfficialNamePart.prefix: 'prefix',
  OfficialNamePart.suffix: 'suffix',
};
