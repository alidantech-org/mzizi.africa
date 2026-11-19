// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'place_statistics_breakdowns_language.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

InsightsPlaceStatisticsBreakdownsLanguage _$InsightsPlaceStatisticsBreakdownsLanguageFromJson(Map<String, dynamic> json) =>
    InsightsPlaceStatisticsBreakdownsLanguage(
      label: json['label'] as String,
      share: (json['share'] as num).toDouble(),
      value: (json['value'] as num).toDouble(),
    );

Map<String, dynamic> _$InsightsPlaceStatisticsBreakdownsLanguageToJson(InsightsPlaceStatisticsBreakdownsLanguage instance) => <String, dynamic>{
  'label': instance.label,
  'share': instance.share,
  'value': instance.value,
};
