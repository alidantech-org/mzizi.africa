// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'place_statistics_breakdowns_sex.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

InsightsPlaceStatisticsBreakdownsSex _$InsightsPlaceStatisticsBreakdownsSexFromJson(Map<String, dynamic> json) =>
    InsightsPlaceStatisticsBreakdownsSex(
      label: json['label'] as String,
      share: (json['share'] as num).toDouble(),
      value: (json['value'] as num).toDouble(),
    );

Map<String, dynamic> _$InsightsPlaceStatisticsBreakdownsSexToJson(InsightsPlaceStatisticsBreakdownsSex instance) => <String, dynamic>{
  'label': instance.label,
  'share': instance.share,
  'value': instance.value,
};
