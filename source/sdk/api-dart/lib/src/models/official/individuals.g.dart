// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'individuals.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

OfficialIndividuals _$OfficialIndividualsFromJson(Map<String, dynamic> json) => OfficialIndividuals(
  birthDate: json['birthDate'] == null ? null : DateTime.parse(json['birthDate'] as String),
  birthYear: (json['birthYear'] as num?)?.toInt(),
  code: json['code'] as String,
  createdAt: DateTime.parse(json['createdAt'] as String),
  deathDate: json['deathDate'] == null ? null : DateTime.parse(json['deathDate'] as String),
  deathYear: (json['deathYear'] as num?)?.toInt(),
  deletedAt: json['deletedAt'] == null ? null : DateTime.parse(json['deletedAt'] as String),
  id: json['id'] as String,
  identityKind: $enumDecode(_$SharedIdentityKindEnumMap, json['identityKind']),
  updatedAt: DateTime.parse(json['updatedAt'] as String),
  version: (json['version'] as num).toInt(),
);

Map<String, dynamic> _$OfficialIndividualsToJson(OfficialIndividuals instance) => <String, dynamic>{
  'birthDate': ?instance.birthDate?.toIso8601String(),
  'birthYear': ?instance.birthYear,
  'code': instance.code,
  'createdAt': instance.createdAt.toIso8601String(),
  'deathDate': ?instance.deathDate?.toIso8601String(),
  'deathYear': ?instance.deathYear,
  'deletedAt': ?instance.deletedAt?.toIso8601String(),
  'id': instance.id,
  'identityKind': _$SharedIdentityKindEnumMap[instance.identityKind]!,
  'updatedAt': instance.updatedAt.toIso8601String(),
  'version': instance.version,
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
