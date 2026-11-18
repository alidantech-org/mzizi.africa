// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'leaderboard.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

InsightsLeaderboard _$InsightsLeaderboardFromJson(Map<String, dynamic> json) => InsightsLeaderboard(
  gaps: (json['gaps'] as List<dynamic>).map((e) => e as String).toList(),
  metric: InsightsLeaderboardMetric.fromJson(json['metric'] as Map<String, dynamic>),
  rows: (json['rows'] as List<dynamic>).map((e) => InsightsLeaderboardRow.fromJson(e as Map<String, dynamic>)).toList(),
  scope: json['scope'] as String,
);

Map<String, dynamic> _$InsightsLeaderboardToJson(InsightsLeaderboard instance) => <String, dynamic>{
  'gaps': instance.gaps,
  'metric': instance.metric,
  'rows': instance.rows,
  'scope': instance.scope,
};
