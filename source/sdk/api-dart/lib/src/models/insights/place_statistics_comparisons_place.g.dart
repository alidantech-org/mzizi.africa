// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'place_statistics_comparisons_place.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

InsightsPlaceStatisticsComparisonsPlace _$InsightsPlaceStatisticsComparisonsPlaceFromJson(Map<String, dynamic> json) =>
    InsightsPlaceStatisticsComparisonsPlace(
      featureId: json['featureId'] as String,
      kindCode: json['kindCode'] as String,
      kindLabel: json['kindLabel'] as String,
      name: json['name'] as String,
      path: json['path'] as String?,
    );

Map<String, dynamic> _$InsightsPlaceStatisticsComparisonsPlaceToJson(InsightsPlaceStatisticsComparisonsPlace instance) => <String, dynamic>{
  'featureId': instance.featureId,
  'kindCode': instance.kindCode,
  'kindLabel': instance.kindLabel,
  'name': instance.name,
  'path': ?instance.path,
};
