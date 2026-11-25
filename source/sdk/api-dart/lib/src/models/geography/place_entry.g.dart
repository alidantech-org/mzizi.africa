// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'place_entry.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

GeographyPlaceEntry _$GeographyPlaceEntryFromJson(Map<String, dynamic> json) => GeographyPlaceEntry(
  code: json['code'] as String,
  featureId: json['featureId'] as String,
  fromYear: (json['fromYear'] as num?)?.toInt(),
  identityKind: $enumDecode(_$SharedIdentityKindEnumMap, json['identityKind']),
  kindTerm: json['kindTerm'] as String,
  names: (json['names'] as List<dynamic>).map((e) => GeographyPlaceEntryNames.fromJson(e as Map<String, dynamic>)).toList(),
  toYear: (json['toYear'] as num?)?.toInt(),
);

Map<String, dynamic> _$GeographyPlaceEntryToJson(GeographyPlaceEntry instance) => <String, dynamic>{
  'code': instance.code,
  'featureId': instance.featureId,
  'fromYear': ?instance.fromYear,
  'identityKind': _$SharedIdentityKindEnumMap[instance.identityKind]!,
  'kindTerm': instance.kindTerm,
  'names': instance.names,
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
