// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'place_statistics_topics_indicators_previous.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

InsightsPlaceStatisticsTopicsIndicatorsPrevious _$InsightsPlaceStatisticsTopicsIndicatorsPreviousFromJson(Map<String, dynamic> json) =>
    InsightsPlaceStatisticsTopicsIndicatorsPrevious(
      estimated: json['estimated'] as bool,
      period: json['period'] as String,
      value: (json['value'] as num).toDouble(),
    );

Map<String, dynamic> _$InsightsPlaceStatisticsTopicsIndicatorsPreviousToJson(InsightsPlaceStatisticsTopicsIndicatorsPrevious instance) =>
    <String, dynamic>{'estimated': instance.estimated, 'period': instance.period, 'value': instance.value};
