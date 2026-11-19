// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'place_statistics_topics.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

InsightsPlaceStatisticsTopics _$InsightsPlaceStatisticsTopicsFromJson(Map<String, dynamic> json) => InsightsPlaceStatisticsTopics(
  code: json['code'] as String,
  indicators: (json['indicators'] as List<dynamic>)
      .map((e) => InsightsPlaceStatisticsTopicsIndicators.fromJson(e as Map<String, dynamic>))
      .toList(),
  label: json['label'] as String,
);

Map<String, dynamic> _$InsightsPlaceStatisticsTopicsToJson(InsightsPlaceStatisticsTopics instance) => <String, dynamic>{
  'code': instance.code,
  'indicators': instance.indicators,
  'label': instance.label,
};
