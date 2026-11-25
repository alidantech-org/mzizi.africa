// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'indicator_detail.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

StatisticsIndicatorDetail _$StatisticsIndicatorDetailFromJson(Map<String, dynamic> json) => StatisticsIndicatorDetail(
  aggregation: $enumDecode(_$StatisticsAggregationEnumMap, json['aggregation']),
  code: json['code'] as String,
  decimals: (json['decimals'] as num?)?.toInt(),
  dimensions: (json['dimensions'] as List<dynamic>).map((e) => StatisticsIndicatorDetailDimensions.fromJson(e as Map<String, dynamic>)).toList(),
  frequency: $enumDecodeNullable(_$StatisticsFrequencyEnumMap, json['frequency']),
  higherIsBetter: json['higherIsBetter'] as bool?,
  indicatorId: json['indicatorId'] as String,
  isDerived: json['isDerived'] as bool,
  kindTerm: json['kindTerm'] as String,
  names: (json['names'] as List<dynamic>).map((e) => StatisticsIndicatorDetailNames.fromJson(e as Map<String, dynamic>)).toList(),
  topicTerm: json['topicTerm'] as String,
  unitId: json['unitId'] as String?,
  unitSymbol: json['unitSymbol'] as String?,
);

Map<String, dynamic> _$StatisticsIndicatorDetailToJson(StatisticsIndicatorDetail instance) => <String, dynamic>{
  'aggregation': _$StatisticsAggregationEnumMap[instance.aggregation]!,
  'code': instance.code,
  'decimals': ?instance.decimals,
  'dimensions': instance.dimensions,
  'frequency': ?_$StatisticsFrequencyEnumMap[instance.frequency],
  'higherIsBetter': ?instance.higherIsBetter,
  'indicatorId': instance.indicatorId,
  'isDerived': instance.isDerived,
  'kindTerm': instance.kindTerm,
  'names': instance.names,
  'topicTerm': instance.topicTerm,
  'unitId': ?instance.unitId,
  'unitSymbol': ?instance.unitSymbol,
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
