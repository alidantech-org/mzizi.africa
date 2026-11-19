// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'place_statistics_breakdowns_residence.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

InsightsPlaceStatisticsBreakdownsResidence _$InsightsPlaceStatisticsBreakdownsResidenceFromJson(Map<String, dynamic> json) =>
    InsightsPlaceStatisticsBreakdownsResidence(
      label: json['label'] as String,
      share: (json['share'] as num).toDouble(),
      value: (json['value'] as num).toDouble(),
    );

Map<String, dynamic> _$InsightsPlaceStatisticsBreakdownsResidenceToJson(InsightsPlaceStatisticsBreakdownsResidence instance) =>
    <String, dynamic>{'label': instance.label, 'share': instance.share, 'value': instance.value};
