// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'events.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

EventEvents _$EventEventsFromJson(Map<String, dynamic> json) => EventEvents(
  basisProvisionId: json['basisProvisionId'] as String?,
  calendarId: json['calendarId'] as String?,
  code: json['code'] as String,
  countryId: json['countryId'] as String?,
  createdAt: DateTime.parse(json['createdAt'] as String),
  deletedAt: json['deletedAt'] == null ? null : DateTime.parse(json['deletedAt'] as String),
  featureId: json['featureId'] as String?,
  id: json['id'] as String,
  identityKind: $enumDecode(_$SharedIdentityKindEnumMap, json['identityKind']),
  kindTerm: json['kindTerm'] as String,
  levelId: json['levelId'] as String?,
  organiserId: json['organiserId'] as String?,
  updatedAt: DateTime.parse(json['updatedAt'] as String),
  version: (json['version'] as num).toInt(),
);

Map<String, dynamic> _$EventEventsToJson(EventEvents instance) => <String, dynamic>{
  'basisProvisionId': ?instance.basisProvisionId,
  'calendarId': ?instance.calendarId,
  'code': instance.code,
  'countryId': ?instance.countryId,
  'createdAt': instance.createdAt.toIso8601String(),
  'deletedAt': ?instance.deletedAt?.toIso8601String(),
  'featureId': ?instance.featureId,
  'id': instance.id,
  'identityKind': _$SharedIdentityKindEnumMap[instance.identityKind]!,
  'kindTerm': instance.kindTerm,
  'levelId': ?instance.levelId,
  'organiserId': ?instance.organiserId,
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
