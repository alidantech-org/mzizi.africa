// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'identity_detail.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

IdentityIdentityDetail _$IdentityIdentityDetailFromJson(Map<String, dynamic> json) => IdentityIdentityDetail(
  code: json['code'] as String,
  identifiers: (json['identifiers'] as List<dynamic>).map((e) => IdentityIdentityDetailIdentifiers.fromJson(e as Map<String, dynamic>)).toList(),
  identityId: json['identityId'] as String,
  kind: $enumDecode(_$SharedIdentityKindEnumMap, json['kind']),
  names: (json['names'] as List<dynamic>).map((e) => IdentityIdentityDetailNames.fromJson(e as Map<String, dynamic>)).toList(),
);

Map<String, dynamic> _$IdentityIdentityDetailToJson(IdentityIdentityDetail instance) => <String, dynamic>{
  'code': instance.code,
  'identifiers': instance.identifiers,
  'identityId': instance.identityId,
  'kind': _$SharedIdentityKindEnumMap[instance.kind]!,
  'names': instance.names,
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
