// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'indicator_entry.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

StatisticsIndicatorEntry _$StatisticsIndicatorEntryFromJson(Map<String, dynamic> json) => StatisticsIndicatorEntry(
  aggregation: $enumDecode(_$StatisticsAggregationEnumMap, json['aggregation']),
  code: json['code'] as String,
  decimals: (json['decimals'] as num?)?.toInt(),
  frequency: $enumDecodeNullable(_$StatisticsFrequencyEnumMap, json['frequency']),
  higherIsBetter: json['higherIsBetter'] as bool?,
  indicatorId: json['indicatorId'] as String,
  kindTerm: json['kindTerm'] as String,
  names: (json['names'] as List<dynamic>).map((e) => StatisticsIndicatorEntryNames.fromJson(e as Map<String, dynamic>)).toList(),
  roleTerm: json['roleTerm'] as String?,
  topicTerm: json['topicTerm'] as String,
  unitSymbol: json['unitSymbol'] as String?,
);

Map<String, dynamic> _$StatisticsIndicatorEntryToJson(StatisticsIndicatorEntry instance) => <String, dynamic>{
  'aggregation': _$StatisticsAggregationEnumMap[instance.aggregation]!,
  'code': instance.code,
  'decimals': ?instance.decimals,
  'frequency': ?_$StatisticsFrequencyEnumMap[instance.frequency],
  'higherIsBetter': ?instance.higherIsBetter,
  'indicatorId': instance.indicatorId,
  'kindTerm': instance.kindTerm,
  'names': instance.names,
  'roleTerm': ?instance.roleTerm,
  'topicTerm': instance.topicTerm,
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
