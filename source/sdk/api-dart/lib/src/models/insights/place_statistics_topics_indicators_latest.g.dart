// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'place_statistics_topics_indicators_latest.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

InsightsPlaceStatisticsTopicsIndicatorsLatest _$InsightsPlaceStatisticsTopicsIndicatorsLatestFromJson(Map<String, dynamic> json) =>
    InsightsPlaceStatisticsTopicsIndicatorsLatest(
      estimated: json['estimated'] as bool,
      period: json['period'] as String,
      value: (json['value'] as num).toDouble(),
    );

Map<String, dynamic> _$InsightsPlaceStatisticsTopicsIndicatorsLatestToJson(InsightsPlaceStatisticsTopicsIndicatorsLatest instance) =>
    <String, dynamic>{'estimated': instance.estimated, 'period': instance.period, 'value': instance.value};
