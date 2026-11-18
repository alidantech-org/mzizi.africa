// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'leaderboard_metric.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

InsightsLeaderboardMetric _$InsightsLeaderboardMetricFromJson(Map<String, dynamic> json) => InsightsLeaderboardMetric(
  code: json['code'] as String,
  describe: json['describe'] as String,
  domain: json['domain'] as String,
  higherIsBetter: json['higherIsBetter'] as bool,
  title: json['title'] as String,
  unit: json['unit'] as String?,
);

Map<String, dynamic> _$InsightsLeaderboardMetricToJson(InsightsLeaderboardMetric instance) => <String, dynamic>{
  'code': instance.code,
  'describe': instance.describe,
  'domain': instance.domain,
  'higherIsBetter': instance.higherIsBetter,
  'title': instance.title,
  'unit': ?instance.unit,
};
