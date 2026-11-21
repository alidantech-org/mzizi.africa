// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'place_statistics_input.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

InsightsPlaceStatisticsInput _$InsightsPlaceStatisticsInputFromJson(Map<String, dynamic> json) => InsightsPlaceStatisticsInput(
  countryCode: json['countryCode'] as String,
  languageCode: json['languageCode'] as String?,
  path: json['path'] as String?,
  scope: json['scope'] as String?,
  topic: json['topic'] as String?,
);

Map<String, dynamic> _$InsightsPlaceStatisticsInputToJson(InsightsPlaceStatisticsInput instance) => <String, dynamic>{
  'countryCode': instance.countryCode,
  'languageCode': ?instance.languageCode,
  'path': ?instance.path,
  'scope': ?instance.scope,
  'topic': ?instance.topic,
};
