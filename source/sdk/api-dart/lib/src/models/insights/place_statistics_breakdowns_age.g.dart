// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'place_statistics_breakdowns_age.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

InsightsPlaceStatisticsBreakdownsAge _$InsightsPlaceStatisticsBreakdownsAgeFromJson(Map<String, dynamic> json) =>
    InsightsPlaceStatisticsBreakdownsAge(
      label: json['label'] as String,
      share: (json['share'] as num).toDouble(),
      value: (json['value'] as num).toDouble(),
    );

Map<String, dynamic> _$InsightsPlaceStatisticsBreakdownsAgeToJson(InsightsPlaceStatisticsBreakdownsAge instance) => <String, dynamic>{
  'label': instance.label,
  'share': instance.share,
  'value': instance.value,
};
