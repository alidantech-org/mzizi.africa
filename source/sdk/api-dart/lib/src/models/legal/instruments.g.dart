// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'instruments.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

LegalInstruments _$LegalInstrumentsFromJson(Map<String, dynamic> json) => LegalInstruments(
  code: json['code'] as String,
  createdAt: DateTime.parse(json['createdAt'] as String),
  deletedAt: json['deletedAt'] == null ? null : DateTime.parse(json['deletedAt'] as String),
  enactedOn: json['enactedOn'] == null ? null : DateTime.parse(json['enactedOn'] as String),
  fromYear: (json['fromYear'] as num?)?.toInt(),
  id: json['id'] as String,
  identityKind: $enumDecode(_$SharedIdentityKindEnumMap, json['identityKind']),
  issuerId: json['issuerId'] as String?,
  jurisdictionId: json['jurisdictionId'] as String?,
  kindTerm: json['kindTerm'] as String,
  publishedOn: json['publishedOn'] == null ? null : DateTime.parse(json['publishedOn'] as String),
  statusTerm: json['statusTerm'] as String?,
  toYear: (json['toYear'] as num?)?.toInt(),
  updatedAt: DateTime.parse(json['updatedAt'] as String),
  version: (json['version'] as num).toInt(),
);

Map<String, dynamic> _$LegalInstrumentsToJson(LegalInstruments instance) => <String, dynamic>{
  'code': instance.code,
  'createdAt': instance.createdAt.toIso8601String(),
  'deletedAt': ?instance.deletedAt?.toIso8601String(),
  'enactedOn': ?instance.enactedOn?.toIso8601String(),
  'fromYear': ?instance.fromYear,
  'id': instance.id,
  'identityKind': _$SharedIdentityKindEnumMap[instance.identityKind]!,
  'issuerId': ?instance.issuerId,
  'jurisdictionId': ?instance.jurisdictionId,
  'kindTerm': instance.kindTerm,
  'publishedOn': ?instance.publishedOn?.toIso8601String(),
  'statusTerm': ?instance.statusTerm,
  'toYear': ?instance.toYear,
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
