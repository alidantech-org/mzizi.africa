// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'countries.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

ReferenceCountries _$ReferenceCountriesFromJson(Map<String, dynamic> json) => ReferenceCountries(
  callingCode: json['callingCode'] as String?,
  code: json['code'] as String,
  createdAt: DateTime.parse(json['createdAt'] as String),
  currencyId: json['currencyId'] as String?,
  deletedAt: json['deletedAt'] == null ? null : DateTime.parse(json['deletedAt'] as String),
  designationTerm: json['designationTerm'] as String?,
  establishedOn: json['establishedOn'] == null ? null : DateTime.parse(json['establishedOn'] as String),
  id: json['id'] as String,
  identityKind: $enumDecode(_$SharedIdentityKindEnumMap, json['identityKind']),
  isoAlpha2: json['isoAlpha2'] as String?,
  isoAlpha3: json['isoAlpha3'] as String?,
  isoNumeric: json['isoNumeric'] as String?,
  recognitionTerm: json['recognitionTerm'] as String?,
  updatedAt: DateTime.parse(json['updatedAt'] as String),
  version: (json['version'] as num).toInt(),
);

Map<String, dynamic> _$ReferenceCountriesToJson(ReferenceCountries instance) => <String, dynamic>{
  'callingCode': ?instance.callingCode,
  'code': instance.code,
  'createdAt': instance.createdAt.toIso8601String(),
  'currencyId': ?instance.currencyId,
  'deletedAt': ?instance.deletedAt?.toIso8601String(),
  'designationTerm': ?instance.designationTerm,
  'establishedOn': ?instance.establishedOn?.toIso8601String(),
  'id': instance.id,
  'identityKind': _$SharedIdentityKindEnumMap[instance.identityKind]!,
  'isoAlpha2': ?instance.isoAlpha2,
  'isoAlpha3': ?instance.isoAlpha3,
  'isoNumeric': ?instance.isoNumeric,
  'recognitionTerm': ?instance.recognitionTerm,
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
