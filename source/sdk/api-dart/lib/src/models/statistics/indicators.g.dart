// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'indicators.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

StatisticsIndicators _$StatisticsIndicatorsFromJson(Map<String, dynamic> json) => StatisticsIndicators(
  aggregation: $enumDecode(_$StatisticsAggregationEnumMap, json['aggregation']),
  code: json['code'] as String,
  createdAt: DateTime.parse(json['createdAt'] as String),
  decimals: (json['decimals'] as num?)?.toInt(),
  deletedAt: json['deletedAt'] == null ? null : DateTime.parse(json['deletedAt'] as String),
  frequency: $enumDecodeNullable(_$StatisticsFrequencyEnumMap, json['frequency']),
  higherIsBetter: json['higherIsBetter'] as bool?,
  id: json['id'] as String,
  identityKind: $enumDecode(_$SharedIdentityKindEnumMap, json['identityKind']),
  isDerived: json['isDerived'] as bool,
  kindTerm: json['kindTerm'] as String,
  roleTerm: json['roleTerm'] as String?,
  topicTerm: json['topicTerm'] as String,
  unitId: json['unitId'] as String?,
  updatedAt: DateTime.parse(json['updatedAt'] as String),
  version: (json['version'] as num).toInt(),
);

Map<String, dynamic> _$StatisticsIndicatorsToJson(StatisticsIndicators instance) => <String, dynamic>{
  'aggregation': _$StatisticsAggregationEnumMap[instance.aggregation]!,
  'code': instance.code,
  'createdAt': instance.createdAt.toIso8601String(),
  'decimals': ?instance.decimals,
  'deletedAt': ?instance.deletedAt?.toIso8601String(),
  'frequency': ?_$StatisticsFrequencyEnumMap[instance.frequency],
  'higherIsBetter': ?instance.higherIsBetter,
  'id': instance.id,
  'identityKind': _$SharedIdentityKindEnumMap[instance.identityKind]!,
  'isDerived': instance.isDerived,
  'kindTerm': instance.kindTerm,
  'roleTerm': ?instance.roleTerm,
  'topicTerm': instance.topicTerm,
  'unitId': ?instance.unitId,
  'updatedAt': instance.updatedAt.toIso8601String(),
  'version': instance.version,
};

const _$StatisticsAggregationEnumMap = {
  StatisticsAggregation.mean: 'mean',
  StatisticsAggregation.none: 'none',
  StatisticsAggregation.sum: 'sum',
  StatisticsAggregation.weighted: 'weighted',
};

const _$StatisticsFrequencyEnumMap = {
  StatisticsFrequency.annual: 'annual',
  StatisticsFrequency.decennial: 'decennial',
  StatisticsFrequency.intercensal: 'intercensal',
  StatisticsFrequency.monthly: 'monthly',
  StatisticsFrequency.quarterly: 'quarterly',
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
