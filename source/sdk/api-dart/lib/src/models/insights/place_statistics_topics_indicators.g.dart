// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'place_statistics_topics_indicators.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

InsightsPlaceStatisticsTopicsIndicators _$InsightsPlaceStatisticsTopicsIndicatorsFromJson(Map<String, dynamic> json) =>
    InsightsPlaceStatisticsTopicsIndicators(
      change: (json['change'] as num?)?.toDouble(),
      code: json['code'] as String,
      higherIsBetter: json['higherIsBetter'] as bool?,
      latest: InsightsPlaceStatisticsTopicsIndicatorsLatest.fromJson(json['latest'] as Map<String, dynamic>),
      measure: json['measure'] as String,
      name: json['name'] as String,
      previous: json['previous'] == null
          ? null
          : InsightsPlaceStatisticsTopicsIndicatorsPrevious.fromJson(json['previous'] as Map<String, dynamic>),
      series: (json['series'] as List<dynamic>)
          .map((e) => InsightsPlaceStatisticsTopicsIndicatorsSeries.fromJson(e as Map<String, dynamic>))
          .toList(),
      unit: json['unit'] as String,
    );

Map<String, dynamic> _$InsightsPlaceStatisticsTopicsIndicatorsToJson(InsightsPlaceStatisticsTopicsIndicators instance) => <String, dynamic>{
  'change': ?instance.change,
  'code': instance.code,
  'higherIsBetter': ?instance.higherIsBetter,
  'latest': instance.latest,
  'measure': instance.measure,
  'name': instance.name,
  'previous': ?instance.previous,
  'series': instance.series,
  'unit': instance.unit,
};
