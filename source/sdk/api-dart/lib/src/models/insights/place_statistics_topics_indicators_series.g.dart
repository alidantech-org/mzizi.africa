// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'place_statistics_topics_indicators_series.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

InsightsPlaceStatisticsTopicsIndicatorsSeries _$InsightsPlaceStatisticsTopicsIndicatorsSeriesFromJson(Map<String, dynamic> json) =>
    InsightsPlaceStatisticsTopicsIndicatorsSeries(
      estimated: json['estimated'] as bool,
      period: json['period'] as String,
      value: (json['value'] as num).toDouble(),
    );

Map<String, dynamic> _$InsightsPlaceStatisticsTopicsIndicatorsSeriesToJson(InsightsPlaceStatisticsTopicsIndicatorsSeries instance) =>
    <String, dynamic>{'estimated': instance.estimated, 'period': instance.period, 'value': instance.value};
