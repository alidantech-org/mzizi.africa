// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'address_match.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

IdentityAddressMatch _$IdentityAddressMatchFromJson(Map<String, dynamic> json) => IdentityAddressMatch(
  addressId: json['addressId'] as String,
  canonicalId: json['canonicalId'] as String?,
  code: json['code'] as String,
  identityId: json['identityId'] as String,
  kind: $enumDecode(_$SharedIdentityKindEnumMap, json['kind']),
  parentId: json['parentId'] as String?,
  sectionTerm: json['sectionTerm'] as String?,
  toYear: (json['toYear'] as num?)?.toInt(),
);

Map<String, dynamic> _$IdentityAddressMatchToJson(IdentityAddressMatch instance) => <String, dynamic>{
  'addressId': instance.addressId,
  'canonicalId': ?instance.canonicalId,
  'code': instance.code,
  'identityId': instance.identityId,
  'kind': _$SharedIdentityKindEnumMap[instance.kind]!,
  'parentId': ?instance.parentId,
  'sectionTerm': ?instance.sectionTerm,
  'toYear': ?instance.toYear,
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
