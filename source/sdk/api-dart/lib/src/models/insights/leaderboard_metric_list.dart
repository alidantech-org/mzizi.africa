import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/models/insights/leaderboard_metric.dart';

part 'leaderboard_metric_list.g.dart';

/// Leaderboard Metric List
@JsonSerializable(includeIfNull: false)
class InsightsLeaderboardMetricList {
  const InsightsLeaderboardMetricList({required this.metrics});
  final List<InsightsLeaderboardMetric> metrics;

  factory InsightsLeaderboardMetricList.fromJson(Map<String, dynamic> json) => _$InsightsLeaderboardMetricListFromJson(json);

  Map<String, dynamic> toJson() => _$InsightsLeaderboardMetricListToJson(this);
}
