// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'place_detail.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

GeographyPlaceDetail _$GeographyPlaceDetailFromJson(Map<String, dynamic> json) => GeographyPlaceDetail(
  code: json['code'] as String,
  endedOn: json['endedOn'] == null ? null : DateTime.parse(json['endedOn'] as String),
  establishedOn: json['establishedOn'] == null ? null : DateTime.parse(json['establishedOn'] as String),
  featureId: json['featureId'] as String,
  fromYear: (json['fromYear'] as num?)?.toInt(),
  identityKind: $enumDecode(_$SharedIdentityKindEnumMap, json['identityKind']),
  kindTerm: json['kindTerm'] as String,
  names: (json['names'] as List<dynamic>).map((e) => GeographyPlaceDetailNames.fromJson(e as Map<String, dynamic>)).toList(),
  parents: (json['parents'] as List<dynamic>).map((e) => GeographyPlaceDetailParents.fromJson(e as Map<String, dynamic>)).toList(),
  toYear: (json['toYear'] as num?)?.toInt(),
);

Map<String, dynamic> _$GeographyPlaceDetailToJson(GeographyPlaceDetail instance) => <String, dynamic>{
  'code': instance.code,
  'endedOn': ?instance.endedOn?.toIso8601String(),
  'establishedOn': ?instance.establishedOn?.toIso8601String(),
  'featureId': instance.featureId,
  'fromYear': ?instance.fromYear,
  'identityKind': _$SharedIdentityKindEnumMap[instance.identityKind]!,
  'kindTerm': instance.kindTerm,
  'names': instance.names,
  'parents': instance.parents,
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
