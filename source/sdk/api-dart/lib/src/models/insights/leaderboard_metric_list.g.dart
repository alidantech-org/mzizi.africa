// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'leaderboard_metric_list.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

InsightsLeaderboardMetricList _$InsightsLeaderboardMetricListFromJson(Map<String, dynamic> json) => InsightsLeaderboardMetricList(
  metrics: (json['metrics'] as List<dynamic>).map((e) => InsightsLeaderboardMetric.fromJson(e as Map<String, dynamic>)).toList(),
);

Map<String, dynamic> _$InsightsLeaderboardMetricListToJson(InsightsLeaderboardMetricList instance) => <String, dynamic>{
  'metrics': instance.metrics,
};
