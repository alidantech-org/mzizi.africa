// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'name_match.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

IdentityNameMatch _$IdentityNameMatchFromJson(Map<String, dynamic> json) => IdentityNameMatch(
  code: json['code'] as String,
  identityId: json['identityId'] as String,
  isDefault: json['isDefault'] as bool,
  kind: $enumDecode(_$SharedIdentityKindEnumMap, json['kind']),
  languageCode: json['languageCode'] as String,
  text: json['text'] as String,
);

Map<String, dynamic> _$IdentityNameMatchToJson(IdentityNameMatch instance) => <String, dynamic>{
  'code': instance.code,
  'identityId': instance.identityId,
  'isDefault': instance.isDefault,
  'kind': _$SharedIdentityKindEnumMap[instance.kind]!,
  'languageCode': instance.languageCode,
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
