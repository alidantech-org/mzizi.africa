// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'identifiers.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

IdentityIdentifiers _$IdentityIdentifiersFromJson(Map<String, dynamic> json) => IdentityIdentifiers(
  createdAt: DateTime.parse(json['createdAt'] as String),
  deletedAt: json['deletedAt'] == null ? null : DateTime.parse(json['deletedAt'] as String),
  fromYear: (json['fromYear'] as num?)?.toInt(),
  id: json['id'] as String,
  identityId: json['identityId'] as String,
  identityKind: $enumDecode(_$SharedIdentityKindEnumMap, json['identityKind']),
  issuerId: json['issuerId'] as String?,
  namespace: json['namespace'] as String?,
  schemeTerm: json['schemeTerm'] as String,
  toYear: (json['toYear'] as num?)?.toInt(),
  updatedAt: DateTime.parse(json['updatedAt'] as String),
  value: json['value'] as String,
  version: (json['version'] as num).toInt(),
);

Map<String, dynamic> _$IdentityIdentifiersToJson(IdentityIdentifiers instance) => <String, dynamic>{
  'createdAt': instance.createdAt.toIso8601String(),
  'deletedAt': ?instance.deletedAt?.toIso8601String(),
  'fromYear': ?instance.fromYear,
  'id': instance.id,
  'identityId': instance.identityId,
  'identityKind': _$SharedIdentityKindEnumMap[instance.identityKind]!,
  'issuerId': ?instance.issuerId,
  'namespace': ?instance.namespace,
  'schemeTerm': instance.schemeTerm,
  'toYear': ?instance.toYear,
  'updatedAt': instance.updatedAt.toIso8601String(),
  'value': instance.value,
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
