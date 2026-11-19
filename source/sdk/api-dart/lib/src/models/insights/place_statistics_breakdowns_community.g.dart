// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'place_statistics_breakdowns_community.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

InsightsPlaceStatisticsBreakdownsCommunity _$InsightsPlaceStatisticsBreakdownsCommunityFromJson(Map<String, dynamic> json) =>
    InsightsPlaceStatisticsBreakdownsCommunity(
      label: json['label'] as String,
      share: (json['share'] as num).toDouble(),
      value: (json['value'] as num).toDouble(),
    );

Map<String, dynamic> _$InsightsPlaceStatisticsBreakdownsCommunityToJson(InsightsPlaceStatisticsBreakdownsCommunity instance) =>
    <String, dynamic>{'label': instance.label, 'share': instance.share, 'value': instance.value};
